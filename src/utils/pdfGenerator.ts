import { jsPDF } from 'jspdf';
import { DossierCandidature } from '../types';

// Nettoyer le texte pour jsPDF (évite les problèmes d'encodage)
const t = (s: string | undefined | null) => {
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
      'Ç': 'C', '\'': "'", '’': "'",
    };
    return map[c] || c;
  });
};

export function generateSingleDossierPdf(dossier: DossierCandidature): void {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const { form, id, statut, dateSoumission } = dossier;
  const totalBudget = form.budgetItems.reduce((s, i) => s + i.quantite * i.coutUnitaire, 0);

  const W = 210, H = 297, M = 14, CW = W - 2 * M;
  let y = 0;

  const pageBreak = (need: number) => {
    if (y + need > H - 15) { doc.addPage(); y = 15; }
  };

  const write = (text: string, x: number, yPos: number, opts?: { bold?: boolean; color?: [number, number, number]; size?: number; align?: 'left' | 'right' }) => {
    doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
    doc.setFontSize(opts?.size || 10);
    doc.setTextColor(...(opts?.color || [40, 40, 40]));
    doc.text(t(text), x, yPos, { align: opts?.align || 'left' });
  };

  const line = (x1: number, y1: number, x2: number, y2: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(x1, y1, x2, y2);
  };

  // ═══════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, W, 26, 'F');
  write('CHANGEMENT SOCIAL BENIN (CSB)', M, 10, { bold: true, color: [255, 255, 255], size: 13 });
  write('Statut consultatif special ECOSOC / ONU', M, 16, { color: [255, 255, 255], size: 8.5 });
  write('3e Camp National Jeunes DDH 2026', M, 22, { bold: true, color: [255, 255, 255], size: 8.5 });
  write(`DOSSIER N° ${id}`, W - M, 14, { bold: true, color: [255, 255, 255], size: 9, align: 'right' });
  write(`Statut : ${statut.toUpperCase()}`, W - M, 20, { color: [255, 255, 255], size: 9, align: 'right' });

  y = 33;

  // ═══════════════════════════════════════
  // BANNER
  // ═══════════════════════════════════════
  doc.setFillColor(235, 243, 251);
  doc.rect(M, y, CW, 10, 'F');
  write('FICHE DE CANDIDATURE - MINI-ACTIVITE DE TERRAIN', M + 4, y + 7, { bold: true, color: [31, 78, 121], size: 11 });
  y += 16;

  // ═══════════════════════════════════════
  // SECTION 1
  // ═══════════════════════════════════════
  pageBreak(25);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('1. IDENTIFICATION DE DU/DE LA CANDIDAT-E', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  // Ligne 1
  write('Nom & Prenom', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(`${form.nom} ${form.prenom}`, M, y, { bold: true, size: 10 });
  y += 7;

  write('Telephone', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(form.telephone || '-', M, y, { bold: true, size: 10 });
  y += 7;

  write('E-mail', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(form.email || '-', M, y, { bold: true, size: 10 });
  y += 7;

  write('Departement', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(`${form.departement || '-'} (${form.commune || '-'})`, M, y, { bold: true, size: 10 });
  y += 7;

  write("Domaine d'intervention", M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(form.domaines?.join(', ') || '-', M, y, { bold: true, size: 10 });
  y += 10;

  // ═══════════════════════════════════════
  // SECTION 2
  // ═══════════════════════════════════════
  pageBreak(25);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('2. DESCRIPTION DE LA MINI-ACTIVITE', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  write('Titre du projet', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const titreLines = doc.splitTextToSize(form.titreProjet || '-', CW);
  doc.text(t(titreLines.join(' ')), M, y);
  y += titreLines.length * 4.5 + 2;

  write('Problematique identifiee', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const probLines = doc.splitTextToSize(form.problematique || '-', CW);
  doc.text(t(probLines.join(' ')), M, y);
  y += probLines.length * 4.5 + 2;

  write('Objectif general', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const objLines = doc.splitTextToSize(form.objectifGeneral || '-', CW);
  doc.text(t(objLines.join(' ')), M, y);
  y += objLines.length * 4.5 + 2;

  write('Objectifs specifiques', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const objSpeLines = doc.splitTextToSize(form.objectifsSpecifiques || '-', CW);
  doc.text(t(objSpeLines.join(' ')), M, y);
  y += objSpeLines.length * 4.5 + 2;

  write('Resultats attendus', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const resLines = doc.splitTextToSize(form.resultatsAttendus || '-', CW);
  doc.text(t(resLines.join(' ')), M, y);
  y += resLines.length * 4.5 + 2;

  write('Beneficiaires directs', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(form.beneficiairesDirects || 'Non precise', M, y, { bold: true, size: 10 });
  y += 7;

  write('Beneficiaires indirects', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(form.beneficiairesIndirects || 'Non precise', M, y, { bold: true, size: 10 });
  y += 7;

  write("Zone d'intervention", M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  write(form.zoneIntervention || '-', M, y, { bold: true, size: 10 });
  y += 8;

  // ═══════════════════════════════════════
  // SECTION 3
  // ═══════════════════════════════════════
  pageBreak(30);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('3. METHODOLOGIE & ALIGNEMENT VISION BENIN 2060', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  write('Methodologie de mise en oeuvre', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const methLines = doc.splitTextToSize(form.methodologie || '-', CW);
  doc.text(t(methLines.join(' ')), M, y);
  y += methLines.length * 4.5 + 2;

  write("Chronogramme d'execution", M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const chronoLines = doc.splitTextToSize(form.chronogramme || '-', CW);
  doc.text(t(chronoLines.join(' ')), M, y);
  y += chronoLines.length * 4.5 + 2;

  write('Contribution a la Vision Benin 2060', M, y, { size: 9, color: [100, 100, 100] });
  y += 5;
  const visionLines = doc.splitTextToSize(form.lienVision2060 || '-', CW);
  doc.text(t(visionLines.join(' ')), M, y);
  y += visionLines.length * 4.5 + 4;

  // ═══════════════════════════════════════
  // SECTION 4
  // ═══════════════════════════════════════
  pageBreak(40);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('4. BUDGET INDICATIF DE LA MINI-ACTIVITE', M + 4, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  y += 14;

  // Budget header
  pageBreak(20);
  doc.setFillColor(31, 78, 121);
  doc.rect(M, y, CW, 8, 'F');
  write('Designation', M + 4, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  write('Qte', M + 100, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  write('Cout Unit.', M + 120, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  write('Total', M + 160, y + 5.5, { bold: true, color: [255, 255, 255], size: 9 });
  y += 8;

  form.budgetItems.forEach((item, idx) => {
    pageBreak(8);
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
  pageBreak(12);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  write('TOTAL BUDGET', M + 6, y + 6.5, { bold: true, color: [255, 255, 255], size: 11 });
  write(`${totalBudget.toLocaleString('fr-FR')} FCFA`, W - M - 6, y + 6.5, { bold: true, color: [255, 255, 255], size: 11, align: 'right' });
  y += 14;

  // ═══════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════
  pageBreak(15);
  line(M, y, W - M, y);
  y += 6;
  write('Document genere via la plateforme Officielle CSB Benin - Camp National Droits Humains 2026.', M, y, { size: 8, color: [100, 100, 100] });
  y += 4;
  if (dateSoumission) {
    write(`Dossier transmis le ${new Date(dateSoumission).toLocaleDateString('fr-FR')} a ${new Date(dateSoumission).toLocaleTimeString('fr-FR')}`, M, y, { size: 8, color: [100, 100, 100] });
  }

  doc.save(`CSB_Dossier_${id}_${form.nom.replace(/\s+/g, '_')}.pdf`);
}

export function generateGlobalListPdf(dossiers: DossierCandidature[]): void {
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
  const W = 297, H = 210, M = 12, CW = W - 2 * M;
  let y = 0;

  const pageBreak = (need: number) => {
    if (y + need > H - 15) { doc.addPage(); y = 15; }
  };

  const write = (text: string, x: number, yPos: number, opts?: { bold?: boolean; color?: [number, number, number]; size?: number; align?: 'left' | 'right' }) => {
    doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
    doc.setFontSize(opts?.size || 10);
    doc.setTextColor(...(opts?.color || [40, 40, 40]));
    doc.text(t(text), x, yPos, { align: opts?.align || 'left' });
  };

  // Header
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, W, 24, 'F');
  write('CHANGEMENT SOCIAL BENIN (CSB) — Rapport Recapitulatif', 14, 10, { bold: true, color: [255, 255, 255], size: 12 });
  write('3e Camp National Jeunes DDH 2026', 14, 16, { color: [255, 255, 255], size: 9 });
  const nowStr = new Date().toLocaleDateString('fr-FR');
  write(`Export : ${nowStr} | Total : ${dossiers.length}`, W - 14, 16, { color: [255, 255, 255], size: 9, align: 'right' });

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

  dossiers.forEach((d, idx) => {
    pageBreak(8);
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(M, y, CW, 7, 'F');
    }

    write(d.id, cols[0].x, y + 5, { bold: true, size: 8 });
    write(`${d.form.nom} ${d.form.prenom}`.substring(0, 28), cols[1].x, y + 5, { size: 8 });
    write(`${d.form.departement}`, cols[2].x, y + 5, { size: 8 });
    const dom = (d.form.domaines?.[0] || '-').split('(')[0].trim().substring(0, 28);
    write(dom, cols[3].x, y + 5, { size: 8 });
    const ttl = (d.form.titreProjet || '-').substring(0, 32);
    write(ttl, cols[4].x, y + 5, { size: 8 });
    const budget = d.form.budgetItems.reduce((s, b) => s + b.quantite * b.coutUnitaire, 0);
    write(budget.toLocaleString('fr-FR'), cols[5].x, y + 5, { size: 8 });
    if (d.statut === 'soumis') {
      write('SOUMIS', cols[6].x, y + 5, { color: [22, 101, 52], size: 8 });
    } else {
      write('BROUILLON', cols[6].x, y + 5, { color: [180, 83, 9], size: 8 });
    }
    y += 7;
  });

  doc.save(`CSB_Camp2026_Liste_${nowStr.replace(/\//g, '-')}.pdf`);
}
