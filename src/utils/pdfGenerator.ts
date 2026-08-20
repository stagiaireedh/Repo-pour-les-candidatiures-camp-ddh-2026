import { jsPDF } from 'jspdf';
import { DossierCandidature } from '../types';

export function generateSingleDossierPdf(dossier: DossierCandidature): void {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const { form, id, statut, dateSoumission } = dossier;
  const totalBudget = form.budgetItems.reduce((s, i) => s + i.quantite * i.coutUnitaire, 0);

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 14;
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  let y = 0;

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - 20) {
      doc.addPage();
      y = 15;
    }
  };

  // ─── HEADER ───
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, PAGE_W, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CHANGEMENT SOCIAL BÉNIN (CSB)', MARGIN, 9.5);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Statut consultatif spécial ECOSOC / ONU · Observateur accrédité CADHP', MARGIN, 15);
  doc.setFont('helvetica', 'bold');
  doc.text('3ᵉ Camp National Jeunes DDH 2026 · LES DESC EN ARRIMAGE AVEC LA VISION 2060', MARGIN, 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`DOSSIER N° ${id}`, PAGE_W - MARGIN, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Statut : ${statut.toUpperCase()}`, PAGE_W - MARGIN, 20, { align: 'right' });

  y = 35;

  // ─── BANNER ───
  doc.setFillColor(235, 243, 251);
  doc.rect(MARGIN, y, CONTENT_W, 12, 'F');
  doc.setTextColor(31, 78, 121);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FICHE DE CANDIDATURE - MINI-ACTIVITÉ DE TERRAIN', MARGIN + 4, y + 8);
  y += 18;

  // ─── HELPERS ───
  const sectionTitle = (title: string) => {
    ensure(10);
    doc.setFillColor(122, 12, 16);
    doc.rect(MARGIN, y, 3, 7, 'F');
    doc.setTextColor(122, 12, 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(title, MARGIN + 6, y + 5.5);
    y += 9;
  };

  const field = (label: string, value: string, fullWidth: boolean = false) => {
    ensure(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(31, 78, 121);
    doc.text(`${label} :`, MARGIN, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);

    const valueX = fullWidth ? MARGIN : MARGIN + 60;
    const maxWidth = fullWidth ? CONTENT_W : CONTENT_W - 60;
    const valueY = fullWidth ? y + 5 : y;

    const lines = doc.splitTextToSize(value || 'Non renseigné', maxWidth);
    const text = Array.isArray(lines) ? lines : [String(lines)];
    doc.text(text, valueX, valueY);

    const blockH = Math.max(5, text.length * 4.5);
    y += blockH + 4;
  };

  // ─── SECTION 1 ───
  sectionTitle('1. IDENTIFICATION DE DU/DE LA CANDIDAT-E');

  ensure(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(31, 78, 121);
  doc.text('Nom & Prénom :', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(`${form.nom} ${form.prenom}`, MARGIN + 60, y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 78, 121);
  doc.text('Téléphone :', MARGIN + 105, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(form.telephone || '-', MARGIN + 105 + 35, y);
  y += 6;

  ensure(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 78, 121);
  doc.text('E-mail :', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(form.email || '-', MARGIN + 60, y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 78, 121);
  doc.text('Département :', MARGIN + 105, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(`${form.departement || '-'} (${form.commune || '-'})`, MARGIN + 105 + 35, y);
  y += 6;

  field("Domaine d'intervention", form.domaines?.join(', ') || '-', true);

  // ─── SECTION 2 ───
  sectionTitle('2. DESCRIPTION DE LA MINI-ACTIVITÉ');
  field('Titre du projet', form.titreProjet, true);
  field('Problématique identifiée', form.problematique, true);
  field('Objectif général', form.objectifGeneral, true);
  field('Objectifs spécifiques', form.objectifsSpecifiques, true);
  field('Résultats attendus', form.resultatsAttendus, true);
  field('Bénéficiaires directs', form.beneficiairesDirects || 'Non précisé', true);
  field('Bénéficiaires indirects', form.beneficiairesIndirects || 'Non précisé', true);
  field("Zone d'intervention", form.zoneIntervention, true);

  // ─── SECTION 3 ───
  sectionTitle('3. MÉTHODOLOGIE & ALIGNEMENT VISION BÉNIN 2060');
  field('Méthodologie de mise en œuvre', form.methodologie, true);
  field("Chronogramme d'exécution", form.chronogramme, true);
  field('Contribution à la Vision Bénin 2060', form.lienVision2060, true);

  // ─── SECTION 4 ───
  sectionTitle('4. BUDGET INDICATIF DE LA MINI-ACTIVITÉ');

  ensure(20);

  // Budget table
  const colWidths = [95, 18, 28, 28];
  const colX = [MARGIN];
  for (let i = 1; i < colWidths.length; i++) {
    colX.push(colX[i - 1] + colWidths[i - 1]);
  }

  // Header
  doc.setFillColor(31, 78, 121);
  doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Désignation', colX[0] + 4, y + 5.5);
  doc.text('Qté', colX[1] + 4, y + 5.5);
  doc.text('Coût Unit. (FCFA)', colX[2] + 4, y + 5.5);
  doc.text('Total (FCFA)', colX[3] + 4, y + 5.5);
  y += 8;

  form.budgetItems.forEach((item, idx) => {
    const rowH = 7;
    ensure(rowH);

    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(MARGIN, y, CONTENT_W, rowH, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);

    const descLines = doc.splitTextToSize(item.designation || '-', colWidths[0] - 6);
    const desc = Array.isArray(descLines) ? descLines : [String(descLines)];
    doc.text(desc.slice(0, 2).join(' '), colX[0] + 4, y + 4.5);

    doc.text(String(item.quantite || 0), colX[1] + 4, y + 4.5);
    doc.text((item.coutUnitaire || 0).toLocaleString('fr-FR'), colX[2] + 4, y + 4.5);
    doc.text((item.quantite * item.coutUnitaire).toLocaleString('fr-FR'), colX[3] + 4, y + 4.5);

    y += rowH;
  });

  // Total
  ensure(12);
  doc.setFillColor(122, 12, 16);
  doc.rect(MARGIN, y, CONTENT_W, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL BUDGET', MARGIN + 6, y + 6);
  doc.text(`${totalBudget.toLocaleString('fr-FR')} FCFA`, PAGE_W - MARGIN - 6, y + 6, { align: 'right' });
  y += 14;

  // ─── FOOTER ───
  ensure(20);
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Document généré via la plateforme Officielle CSB Bénin - Camp National Droits Humains 2026.', MARGIN, y);
  y += 4;
  if (dateSoumission) {
    doc.text(`Dossier transmis le ${new Date(dateSoumission).toLocaleDateString('fr-FR')} à ${new Date(dateSoumission).toLocaleTimeString('fr-FR')}`, MARGIN, y);
  }

  doc.save(`CSB_Dossier_${id}_${form.nom.replace(/\s+/g, '_')}.pdf`);
}

export function generateGlobalListPdf(dossiers: DossierCandidature[]): void {
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
  const PAGE_W = 297, PAGE_H = 210, MARGIN = 12, CONTENT_W = PAGE_W - 2 * MARGIN;
  let y = 0;

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - 15) { doc.addPage(); y = 15; }
  };

  // Header
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, PAGE_W, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('CHANGEMENT SOCIAL BÉNIN (CSB) — Rapport Récapitulatif', 14, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('3ᵉ Camp National Jeunes DDH 2026 · Mini-Activités · Vision Bénin 2060', 14, 16);
  const nowStr = new Date().toLocaleDateString('fr-FR');
  doc.text(`Export : ${nowStr} | Total : ${dossiers.length}`, PAGE_W - 14, 16, { align: 'right' });

  y = 30;

  // Table columns
  const cols = [
    { label: 'N° Dossier', x: MARGIN + 4, w: 38 },
    { label: 'Candidat-e', x: MARGIN + 42, w: 45 },
    { label: 'Département', x: MARGIN + 87, w: 35 },
    { label: 'Domaine', x: MARGIN + 122, w: 45 },
    { label: 'Titre du Projet', x: MARGIN + 167, w: 55 },
    { label: 'Budget', x: MARGIN + 222, w: 28 },
    { label: 'Statut', x: MARGIN + 250, w: 25 },
  ];

  // Header
  doc.setFillColor(122, 12, 16);
  doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  cols.forEach(c => doc.text(c.label, c.x, y + 5.5));
  y += 8;

  dossiers.forEach((d, idx) => {
    ensure(8);
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(MARGIN, y, CONTENT_W, 7, 'F');
    }

    doc.setFontSize(7.5);
    doc.setTextColor(40, 40, 40);

    doc.setFont('helvetica', 'bold');
    doc.text(d.id, cols[0].x, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(`${d.form.nom} ${d.form.prenom}`.substring(0, 28), cols[1].x, y + 5);
    doc.text(`${d.form.departement}`, cols[2].x, y + 5);

    const dom = (d.form.domaines?.[0] || '-').split('(')[0].trim().substring(0, 28);
    doc.text(dom, cols[3].x, y + 5);

    const ttl = (d.form.titreProjet || '-').substring(0, 32);
    doc.text(ttl, cols[4].x, y + 5);

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

  doc.save(`CSB_Camp2026_Liste_${nowStr.replace(/\//g, '-')}.pdf`);
}
