import { jsPDF } from 'jspdf';
import { DossierCandidature } from '../types';

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
      'Ç': 'C',
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

  const checkPage = (lineCount: number) => {
    if (y + lineCount * 5 > H - 15) {
      doc.addPage();
      y = 15;
      return true;
    }
    return false;
  };

  // ═══ HEADER ═══
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, W, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CHANGEMENT SOCIAL BENIN (CSB)', M, 10);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Statut consultatif special ECOSOC / ONU', M, 16);
  doc.setFont('helvetica', 'bold');
  doc.text('3e Camp National Jeunes DDH 2026', M, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DOSSIER N° ' + id, W - M, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('Statut : ' + statut.toUpperCase(), W - M, 20, { align: 'right' });

  y = 33;

  // ═══ BANNER ═══
  doc.setFillColor(235, 243, 251);
  doc.rect(M, y, CW, 10, 'F');
  doc.setTextColor(31, 78, 121);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FICHE DE CANDIDATURE - MINI-ACTIVITE DE TERRAIN', M + 4, y + 7);
  y += 16;

  // ═══ SECTION 1 ═══
  checkPage(4);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. IDENTIFICATION DE DU/DE LA CANDIDAT-E', M + 4, y + 6.5);
  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Nom & Prenom', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t(form.nom + ' ' + form.prenom), M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Telephone', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t(form.telephone || '-'), M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('E-mail', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t(form.email || '-'), M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Departement', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t((form.departement || '-') + ' (' + (form.commune || '-') + ')'), M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Domaine', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t(form.domaines?.join(', ') || '-'), M, y);
  y += 10;

  // ═══ SECTION 2 ═══
  checkPage(4);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. DESCRIPTION DE LA MINI-ACTIVITE', M + 4, y + 6.5);
  y += 14;

  // Titre
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Titre du projet', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const titreLines = doc.splitTextToSize(t(form.titreProjet || '-'), CW);
  const titreArr = Array.isArray(titreLines) ? titreLines : [String(titreLines)];
  for (const line of titreArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 2;

  // Problematique
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Problematique identifiee', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const probLines = doc.splitTextToSize(t(form.problematique || '-'), CW);
  const probArr = Array.isArray(probLines) ? probLines : [String(probLines)];
  for (const line of probArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 2;

  // Objectif general
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Objectif general', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const objLines = doc.splitTextToSize(t(form.objectifGeneral || '-'), CW);
  const objArr = Array.isArray(objLines) ? objLines : [String(objLines)];
  for (const line of objArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 2;

  // Objectifs specifiques
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Objectifs specifiques', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const objSpeLines = doc.splitTextToSize(t(form.objectifsSpecifiques || '-'), CW);
  const objSpeArr = Array.isArray(objSpeLines) ? objSpeLines : [String(objSpeLines)];
  for (const line of objSpeArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 2;

  // Resultats attendus
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Resultats attendus', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const resLines = doc.splitTextToSize(t(form.resultatsAttendus || '-'), CW);
  const resArr = Array.isArray(resLines) ? resLines : [String(resLines)];
  for (const line of resArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 2;

  // Beneficiaires
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Beneficiaires directs', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t(form.beneficiairesDirects || 'Non precise'), M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Beneficiaires indirects', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t(form.beneficiairesIndirects || 'Non precise'), M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Zone d'intervention", M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(t(form.zoneIntervention || '-'), M, y);
  y += 8;

  // ═══ SECTION 3 ═══
  checkPage(4);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. METHODOLOGIE & ALIGNEMENT VISION BENIN 2060', M + 4, y + 6.5);
  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Methodologie de mise en oeuvre', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const methLines = doc.splitTextToSize(t(form.methodologie || '-'), CW);
  const methArr = Array.isArray(methLines) ? methLines : [String(methLines)];
  for (const line of methArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Chronogramme d'execution", M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const chronoLines = doc.splitTextToSize(t(form.chronogramme || '-'), CW);
  const chronoArr = Array.isArray(chronoLines) ? chronoLines : [String(chronoLines)];
  for (const line of chronoArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Contribution a la Vision Benin 2060', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const visionLines = doc.splitTextToSize(t(form.lienVision2060 || '-'), CW);
  const visionArr = Array.isArray(visionLines) ? visionLines : [String(visionLines)];
  for (const line of visionArr) {
    checkPage(1);
    doc.text(line, M, y);
    y += 4.5;
  }
  y += 4;

  // ═══ SECTION 4 ═══
  checkPage(4);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. BUDGET INDICATIF DE LA MINI-ACTIVITE', M + 4, y + 6.5);
  y += 14;

  // Budget header
  checkPage(3);
  doc.setFillColor(31, 78, 121);
  doc.rect(M, y, CW, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Designation', M + 4, y + 5.5);
  doc.text('Qte', M + 100, y + 5.5);
  doc.text('Cout Unit.', M + 120, y + 5.5);
  doc.text('Total', M + 160, y + 5.5);
  y += 8;

  form.budgetItems.forEach((item, idx) => {
    checkPage(1);
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(M, y, CW, 7, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(t(item.designation || '-'), M + 4, y + 5);
    doc.text(String(item.quantite || 0), M + 100, y + 5);
    doc.text((item.coutUnitaire || 0).toLocaleString('fr-FR'), M + 120, y + 5);
    doc.text((item.quantite * item.coutUnitaire).toLocaleString('fr-FR'), M + 160, y + 5);
    y += 7;
  });

  // Total
  checkPage(2);
  doc.setFillColor(122, 12, 16);
  doc.rect(M, y, CW, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL BUDGET', M + 6, y + 6);
  doc.text(totalBudget.toLocaleString('fr-FR') + ' FCFA', W - M - 6, y + 6, { align: 'right' });
  y += 14;

  // ═══ FOOTER ═══
  checkPage(3);
  doc.setDrawColor(200, 200, 200);
  doc.line(M, y, W - M, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Document genere via la plateforme Officielle CSB Benin - Camp National Droits Humains 2026.', M, y);
  y += 4;
  if (dateSoumission) {
    doc.text('Dossier transmis le ' + new Date(dateSoumission).toLocaleDateString('fr-FR') + ' a ' + new Date(dateSoumission).toLocaleTimeString('fr-FR'), M, y);
  }

  doc.save('CSB_Dossier_' + id + '_' + form.nom.replace(/\s+/g, '_') + '.pdf');
}

export function generateGlobalListPdf(dossiers: DossierCandidature[]): void {
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
  const W = 297, H = 210, M = 12, CW = W - 2 * M;
  let y = 0;

  const checkPage = (need: number) => {
    if (y + need > H - 15) { doc.addPage(); y = 15; }
  };

  // Header
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, W, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('CHANGEMENT SOCIAL BENIN (CSB) — Rapport Recapitulatif', 14, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('3e Camp National Jeunes DDH 2026', 14, 16);
  const nowStr = new Date().toLocaleDateString('fr-FR');
  doc.text('Export : ' + nowStr + ' | Total : ' + dossiers.length, W - 14, 16, { align: 'right' });

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
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  cols.forEach(c => doc.text(c.label, c.x, y + 5.5));
  y += 8;

  dossiers.forEach((d, idx) => {
    checkPage(1);
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(M, y, CW, 7, 'F');
    }
    doc.setFontSize(7.5);
    doc.setTextColor(40, 40, 40);
    doc.text(d.id, cols[0].x, y + 5);
    doc.text((d.form.nom + ' ' + d.form.prenom).substring(0, 28), cols[1].x, y + 5);
    doc.text(d.form.departement, cols[2].x, y + 5);
    const dom = (d.form.domaines?.[0] || '-').split('(')[0].trim().substring(0, 28);
    doc.text(dom, cols[3].x, y + 5);
    doc.text((d.form.titreProjet || '-').substring(0, 32), cols[4].x, y + 5);
    const budget = d.form.budgetItems.reduce((s, b) => s + b.quantite * b.coutUnitaire, 0);
    doc.text(budget.toLocaleString('fr-FR'), cols[5].x, y + 5);
    if (d.statut === 'soumis') {
      doc.setTextColor(22, 101, 52);
      doc.text('SOUMIS', cols[6].x, y + 5);
    } else {
      doc.setTextColor(180, 83, 9);
      doc.text('BROUILLON', cols[6].x, y + 5);
    }
    y += 7;
  });

  doc.save('CSB_Camp2026_Liste_' + nowStr.replace(/\//g, '-') + '.pdf');
}
