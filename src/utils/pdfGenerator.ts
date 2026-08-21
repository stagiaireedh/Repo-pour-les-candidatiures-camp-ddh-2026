import { jsPDF } from 'jspdf';

const clean = (s: string | undefined | null) => {
  return (s || '').replace(/[^\x00-\x7F]/g, (c) => {
    const map: Record<string, string> = {
      'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
      'à': 'a', 'â': 'a', 'ä': 'a',
      'ù': 'u', 'û': 'u', 'ü': 'u',
      'ô': 'o', 'ö': 'o',
      'î': 'i', 'ï': 'i',
      'ç': 'c',
      'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
      'À': 'A', 'Â': 'A', 'Ä': 'A',
      'Ù': 'U', 'Û': 'U', 'Ü': 'U',
      'Ô': 'O', 'Ö': 'O',
      'Î': 'I', 'Ï': 'I',
      'Ç': 'C',
    };
    return map[c] || c;
  });
};

const wrap = (text: string, maxChars: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur.length + w.length + 1 > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur += (cur ? ' ' : '') + w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;
const CW = PAGE_W - 2 * M;

export function generateSingleDossierPdf(dossier: any): void {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const { form, id, statut, dateSoumission } = dossier;
  const totalBudget = form.budgetItems.reduce((s: number, i: any) => s + i.quantite * i.coutUnitaire, 0);

  let y = 0;

  const ensure = (need: number) => {
    if (y + need > PAGE_H - 15) { doc.addPage(); y = 15; }
  };

  const write = (text: string, x: number, yPos: number, opts?: { bold?: boolean; size?: number; color?: [number, number, number]; align?: 'left' | 'right' }) => {
    doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
    doc.setFontSize(opts?.size || 10);
    doc.setTextColor(...(opts?.color || [40, 40, 40]));
    doc.text(clean(text), x, yPos, { align: opts?.align || 'left' });
  };

  const writeField = (label: string, value: string) => {
    ensure(8);
    write(label, M, y, { bold: true, size: 9, color: [100, 100, 100] });
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const text = clean(value || '-');
    const lines = doc.splitTextToSize(text, CW);
    doc.text(lines, M, y, { maxWidth: CW });
    const lineCount = Array.isArray(lines) ? lines.length : 1;
    y += lineCount * 4.5 + 3;
  };

  // ═══ HEADER ═══
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, PAGE_W, 26, 'F');
  write('CHANGEMENT SOCIAL BENIN (CSB)', M, 10, { bold: true, color: [255, 255, 255], size: 13 });
  write('Statut consultatif special ECOSOC / ONU', M, 16, { color: [255, 255, 255], size: 8.5 });
  write('3e Camp National Jeunes DDH 2026', M, 22, { bold: true, color: [255, 255, 255], size: 8.5 });
  write('DOSSIER N° ' + id, PAGE_W - M, 14, { bold: true, color: [255, 255, 255], size: 9, align: 'right' });
  write('Statut : ' + statut.toUpperCase(), PAGE_W - M, 20, { color: [255, 255, 255], size: 9, align: 'right' });

  y = 33;

  // ═══ BANNER ═══
  doc.setFillColor(235, 243, 251);
  doc.rect(M, y, CW, 10, 'F');
  write('FICHE DE CANDIDATURE - MINI-ACTIVITE DE TERRAIN', M + 4, y + 7, { bold: true, color: [31, 78, 121], size: 11 });
  y += 16;

  // ═══ SECTION 1 ═══
  ensure(25);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('1. IDENTIFICATION DE DU/DE LA CANDIDAT-E', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  writeField('Nom & Prenom', form.nom + ' ' + form.prenom);
  writeField('Telephone', form.telephone || '-');
  writeField('E-mail', form.email || '-');
  writeField('Departement', (form.departement || '-') + ' (' + (form.commune || '-') + ')');
  writeField("Domaine d'intervention", form.domaines?.join(', ') || '-');

  // ═══ SECTION 2 ═══
  ensure(25);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('2. DESCRIPTION DE LA MINI-ACTIVITE', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  writeField('Titre du projet', form.titreProjet);
  writeField('Problematique identifiee', form.problematique);
  writeField('Objectif general', form.objectifGeneral);
  writeField('Objectifs specifiques', form.objectifsSpecifiques);
  writeField('Resultats attendus', form.resultatsAttendus);
  writeField('Beneficiaires directs', form.beneficiairesDirects || 'Non precise');
  writeField('Beneficiaires indirects', form.beneficiairesIndirects || 'Non precise');
  writeField("Zone d'intervention", form.zoneIntervention);

  // ═══ SECTION 3 ═══
  ensure(25);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('3. METHODOLOGIE & ALIGNEMENT VISION BENIN 2060', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  writeField('Methodologie de mise en oeuvre', form.methodologie);
  writeField("Chronogramme d'execution", form.chronogramme);
  writeField('Contribution a la Vision Benin 2060', form.lienVision2060);

  // ═══ SECTION 4 ═══
  ensure(25);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('4. BUDGET INDICATIF DE LA MINI-ACTIVITE', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  // Budget header
  ensure(10);
  doc.setFillColor(31, 78, 121);
  doc.rect(M, y, CW, 8, 'F');
  write('Designation', M + 4, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  write('Qte', M + 100, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  write('Cout Unit.', M + 120, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  write('Total', M + 160, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  y += 8;

  form.budgetItems.forEach((item: any, idx: number) => {
    ensure(1);
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(M, y, CW, 7, 'F');
    }
    write(item.designation || '-', M + 4, y + 5, { size: 9 });
    write(String(item.quantite || 0), M + 100, y + 5, { size: 9 });
    write((item.coutUnitaire || 0).toLocaleString('fr-FR'), M + 120, y + 5, { size: 9 });
    write((item.quantite * item.coutUnitaire).toLocaleString('fr-FR'), M + 160, y + 5, { size: 9 });
    y += 7;
  });

  // Total
  ensure(12);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('TOTAL BUDGET', M + 6, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  write(totalBudget.toLocaleString('fr-FR') + ' FCFA', PAGE_W - M - 6, y + 6.5, { bold: true, color: [255, 255, 255], size: 11, align: 'right' });
  y += 14;

  // ═══ FOOTER ═══
  ensure(15);
  doc.setDrawColor(200, 200, 200);
  doc.line(M, y, PAGE_W - M, y);
  y += 6;
  write('Document genere via la plateforme Officielle CSB Benin - Camp National Droits Humains 2026.', M, y, { size: 8, color: [100, 100, 100] });
  y += 4;
  if (dateSoumission) {
    write('Dossier transmis le ' + new Date(dateSoumission).toLocaleDateString('fr-FR') + ' a ' + new Date(dateSoumission).toLocaleTimeString('fr-FR'), M, y, { size: 8, color: [100, 100, 100] });
  }

  doc.save('CSB_Dossier_' + id + '_' + form.nom.replace(/\s+/g, '_') + '.pdf');
}

export function generateGlobalListPdf(dossiers: any[]): void {
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
  const W = 297, H = 210, M = 12, CW = W - 2 * M;
  let y = 0;

  const ensure = (need: number) => {
    if (y + need > H - 15) { doc.addPage(); y = 15; }
  };

  const write = (text: string, x: number, yPos: number, opts?: { bold?: boolean; size?: number; color?: [number, number, number]; align?: 'left' | 'right' }) => {
    doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
    doc.setFontSize(opts?.size || 10);
    doc.setTextColor(...(opts?.color || [40, 40, 40]));
    doc.text(clean(text), x, yPos, { align: opts?.align || 'left' });
  };

  // Header
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, W, 24, 'F');
  write('CHANGEMENT SOCIAL BENIN (CSB) — Rapport Recapitulatif', 14, 10, { bold: true, color: [255, 255, 255], size: 12 });
  write('3e Camp National Jeunes DDH 2026', 14, 16, { color: [255, 255, 255], size: 9 });
  const nowStr = new Date().toLocaleDateString('fr-FR');
  write('Export : ' + nowStr + ' | Total : ' + dossiers.length, W - 14, 16, { color: [255, 255, 255], size: 9, align: 'right' });

  y = 30;

  // Table header
  const cols = [
    { label: 'N° Dossier', x: M + 4, w: 35 },
    { label: 'Candidat-e', x: M + 39, w: 45 },
    { label: 'Departement', x: M + 84, w: 35 },
    { label: 'Domaine', x: M + 119, w: 45 },
    { label: 'Titre du Projet', x: M + 164, w: 55 },
    { label: 'Budget', x: M + 219, w: 28 },
    { label: 'Statut', x: M + 247, w: 25 },
  ];

  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 8, 'F');
  cols.forEach(c => write(c.label, c.x, y + 5.5, { bold: true, color: [255, 255, 255], size: 8 }));
  y += 8;

  dossiers.forEach((d: any, idx: number) => {
    ensure(1);
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(M, y, CW, 7, 'F');
    }
    write(d.id, cols[0].x, y + 5, { bold: true, size: 8 });
    write((d.form.nom + ' ' + d.form.prenom).substring(0, 28), cols[1].x, y + 5, { size: 8 });
    write(d.form.departement, cols[2].x, y + 5, { size: 8 });
    const dom = (d.form.domaines?.[0] || '-').split('(')[0].trim().substring(0, 28);
    write(dom, cols[3].x, y + 5, { size: 8 });
    write((d.form.titreProjet || '-').substring(0, 32), cols[4].x, y + 5, { size: 8 });
    const budget = d.form.budgetItems.reduce((s: number, b: any) => s + b.quantite * b.coutUnitaire, 0);
    write(budget.toLocaleString('fr-FR'), cols[5].x, y + 5, { size: 8 });
    if (d.statut === 'soumis') {
      write('SOUMIS', cols[6].x, y + 5, { color: [22, 101, 52], size: 8 });
    } else {
      write('BROUILLON', cols[6].x, y + 5, { color: [180, 83, 9], size: 8 });
    }
    y += 7;
  });

  doc.save('CSB_Camp2026_Liste_' + nowStr.replace(/\//g, '-') + '.pdf');
}
