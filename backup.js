#!/usr/bin/env node
/**
 * Daily backup of CSB data from the live API.
 * Usage: node backup.js
 * Outputs: ~/AppData/Local/csb-backups/csb_backup_YYYYMMDD_HHMMSS.json
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const API = 'https://repo-pour-les-candidatiures-camp-dd.vercel.app';
const BACKUP_DIR = path.join(os.homedir(), 'AppData', 'Local', 'csb-backups');
const RETENTION_DAYS = 30;

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.request(url, { method: options.method || 'GET', headers: options.headers || {} }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  const ts = new Date();
  const timestamp = `${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}_${String(ts.getHours()).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}${String(ts.getSeconds()).padStart(2, '0')}`;

  console.log(`[${ts.toISOString()}] CSB backup started...`);

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  // 1. Login admin
  const loginRes = await request(`${API}/api/auth/login-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@csb.bj', password: 'admin2026' }),
  });

  if (loginRes.status !== 200) {
    console.error(`[ERROR] Login failed: HTTP ${loginRes.status}`);
    process.exit(1);
  }

  const token = JSON.parse(loginRes.body).token;

  // 2. Get backup
  const backupRes = await request(`${API}/api/admin/backup`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (backupRes.status !== 200) {
    console.error(`[ERROR] Backup request failed: HTTP ${backupRes.status}`);
    process.exit(1);
  }

  // 3. Validate JSON
  let data;
  try {
    data = JSON.parse(backupRes.body);
  } catch (e) {
    console.error(`[ERROR] Invalid JSON response`);
    process.exit(1);
  }

  // 4. Save file
  const backupFile = path.join(BACKUP_DIR, `csb_backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));

  console.log(`[OK] Backup saved: ${backupFile}`);
  console.log(`     users: ${data.users?.length || 0}, dossiers: ${data.dossiers?.length || 0}`);

  // 5. Rotation
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('csb_backup_') && f.endsWith('.json'));
  const cutoff = Date.now() - (RETENTION_DAYS * 24 * 60 * 60 * 1000);
  let deleted = 0;
  for (const f of files) {
    const fp = path.join(BACKUP_DIR, f);
    const stat = fs.statSync(fp);
    if (stat.mtimeMs < cutoff) {
      fs.unlinkSync(fp);
      deleted++;
    }
  }

  console.log(`[OK] Retention: deleted ${deleted} old backup(s). Kept: ${files.length - deleted}`);
}

main().catch(err => { console.error('[ERROR]', err.message); process.exit(1); });
