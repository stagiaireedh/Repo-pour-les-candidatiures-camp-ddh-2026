import { jsPDF } from 'jspdf';
import { DossierCandidature } from '../types';

export function generateSingleDossierPdf(dossier: DossierCandidature): void {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const { form, id, statut, dateSoumission } = dossier;
  const totalBudget = form.budgetItems.reduce((sum, item) => sum + (item.quantite * item.coutUnitaire), 0);

  let y = 15;

  // Header Bar (Navy #1F4E79)
  doc.setFillColor(31, 78, 121); // #1F4E79
  doc.rect(0, 0, 210, 28, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CHANGEMENT SOCIAL BÉNIN (CSB)', 14, 9.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Statut consultatif spécial ECOSOC / ONU · Observateur accrédité CADHP', 14, 15);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('3ᵉ Camp National Jeunes DDH 2026 · Thème : LES DESC EN ARRIMAGE AVEC LA VISION 2060', 14, 21);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`DOSSIER N° ${id}`, 160, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Statut : ${statut.toUpperCase()}`, 160, 20, { align: 'right' });

  y = 35;

  // Banner Section
  doc.setFillColor(235, 243, 251); // #EBF3FB
  doc.rect(14, y, 182, 12, 'F');
  doc.setTextColor(31, 78, 121);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHE DE CANDIDATURE - MINI-ACTIVITÉ DE TERRAIN', 18, y + 8);

  y += 18;

  // Helper function for field rows
  const addSectionTitle = (title: string) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(122, 12, 16); // #7A0C10 Bordeaux
    doc.rect(14, y, 3, 7, 'F');
    doc.setTextColor(122, 12, 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title, 20, y + 5.5);
    y += 10;
  };

  const addField = (label: string, value: string, fullWidth: boolean = false) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 78, 121);
    doc.text(`${label} :`, 14, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);

    const splitText = doc.splitTextToSize(value || 'Non renseigné', fullWidth ? 180 : 130);
    doc.text(splitText, 14, y + 5);
    y += (splitText.length * 4.5) + 4;
  };

  // Section 1: Identification
  addSectionTitle('1. IDENTIFICATION DE DU/DE LA CANDIDAT-E');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(31, 78, 121);
  doc.text(`Nom & Prénom : ${form.nom} ${form.prenom}`, 14, y);
  doc.text(`Téléphone : ${form.telephone}`, 110, y);
  y += 6;

  doc.text(`E-mail : ${form.email}`, 14, y);
  doc.text(`Département : ${form.departement} (${form.commune || 'Commune non précisée'})`, 110, y);
  y += 6;

  doc.text(`Domaine d'intervention :`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(form.domaine || 'Non spécifié', 58, y);
  y += 10;

  // Section 2: Description du projet
  addSectionTitle('2. DESCRIPTION DE LA MINI-ACTIVITÉ');
  addField('Titre du projet', form.titreProjet, true);
  addField('Problématique identifiée', form.problematique, true);
  addField('Objectif général', form.objectifGeneral, true);
  addField('Objectifs spécifiques', form.objectifsSpecifiques, true);
  addField('Résultats attendus', form.resultatsAttendus, true);
  addField('Bénéficiaires direct-e-s & indirect-e-s', `Directs: ${form.beneficiairesDirects}\nIndirects: ${form.beneficiairesIndirects}`, true);
  addField('Zone d\'intervention', form.zoneIntervention, true);

  // Section 3: Méthodologie & Vision 2060
  addSectionTitle('3. MÉTHODOLOGIE & ALIGNEMENT VISION BÉNIN 2060');
  addField('Méthodologie de mise en œuvre', form.methodologie, true);
  addField('Chronogramme d\'exécution', form.chronogramme, true);
  addField('Contribution à la Vision Bénin 2060', form.lienVision2060, true);

  // Section 4: Budget
  addSectionTitle('4. BUDGET INDICATIF DE LA MINI-ACTIVITÉ');

  // Budget Table Header
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(31, 78, 121);
  doc.rect(14, y, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Désignation / Poste de dépense', 18, y + 4.8);
  doc.text('Qté', 130, y + 4.8, { align: 'center' });
  doc.text('Coût Unit (FCFA)', 158, y + 4.8, { align: 'right' });
  doc.text('Total (FCFA)', 192, y + 4.8, { align: 'right' });
  y += 7;

  form.budgetItems.forEach((item, index) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    const lineTotal = item.quantite * item.coutUnitaire;
    if (index % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(14, y, 182, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);

    const descText = doc.splitTextToSize(item.designation, 105);
    doc.text(descText, 18, y + 4);
    doc.text(String(item.quantite), 130, y + 4, { align: 'center' });
    doc.text(item.coutUnitaire.toLocaleString('fr-FR'), 158, y + 4, { align: 'right' });
    doc.text(lineTotal.toLocaleString('fr-FR'), 192, y + 4, { align: 'right' });

    const rowHeight = Math.max(6.5, descText.length * 4);
    y += rowHeight;
  });

  // Total Row
  if (y > 265) {
    doc.addPage();
    y = 20;
  }
  doc.setFillColor(235, 243, 251);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(31, 78, 121);
  doc.text('MONTANT TOTAL DU BUDGET PROPOSÉ :', 18, y + 5.5);
  doc.setTextColor(122, 12, 16);
  doc.text(`${totalBudget.toLocaleString('fr-FR')} FCFA`, 192, y + 5.5, { align: 'right' });

  y += 15;

  // Footer / Attestation
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Document généré via la plateforme Officielle CSB Bénin - Camp National Droits Humains 2026.`, 14, y);
  y += 4;
  if (dateSoumission) {
    doc.text(`Dossier définitivement transmis le : ${new Date(dateSoumission).toLocaleDateString('fr-FR')} à ${new Date(dateSoumission).toLocaleTimeString('fr-FR')}`, 14, y);
  }

  doc.save(`CSB_Dossier_${id}_${form.nom.replace(/\s+/g, '_')}.pdf`);
}

export function generateGlobalListPdf(dossiers: DossierCandidature[]): void {
  const doc = new jsPDF({
    orientation: 'l', // Landscape
    unit: 'mm',
    format: 'a4'
  });

  let y = 15;

  // Header Bar Navy
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, 297, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CHANGEMENT SOCIAL BÉNIN (CSB) — ONG Dotée du Statut Consultatif ECOSOC / ONU', 14, 10);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Rapport Récapitulatif · 3ᵉ Camp National Jeunes DDH 2026 & Vision Bénin 2060 (Loi n°2025-16)', 14, 17);

  const nowStr = new Date().toLocaleDateString('fr-FR');
  doc.setFontSize(9);
  doc.text(`Date d'exportation : ${nowStr} | Total : ${dossiers.length} dossier(s)`, 283, 18, { align: 'right' });

  y = 33;

  // Table Header
  doc.setFillColor(122, 12, 16); // Bordeaux
  doc.rect(14, y, 269, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('N° Dossier', 18, y + 5.5);
  doc.text('Candidat-e', 48, y + 5.5);
  doc.text('Département', 100, y + 5.5);
  doc.text('Domaine', 130, y + 5.5);
  doc.text('Titre du Projet', 180, y + 5.5);
  doc.text('Budget (FCFA)', 245, y + 5.5, { align: 'right' });
  doc.text('Statut', 280, y + 5.5, { align: 'right' });

  y += 8;

  dossiers.forEach((d, idx) => {
    if (y > 185) {
      doc.addPage();
      y = 20;

      // Repeat Table Header
      doc.setFillColor(122, 12, 16);
      doc.rect(14, y, 269, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('N° Dossier', 18, y + 5.5);
      doc.text('Candidat-e', 48, y + 5.5);
      doc.text('Département', 100, y + 5.5);
      doc.text('Domaine', 130, y + 5.5);
      doc.text('Titre du Projet', 180, y + 5.5);
      doc.text('Budget (FCFA)', 245, y + 5.5, { align: 'right' });
      doc.text('Statut', 280, y + 5.5, { align: 'right' });
      y += 8;
    }

    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(14, y, 269, 8, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);

    const budgetTotal = d.form.budgetItems.reduce((acc, b) => acc + (b.quantite * b.coutUnitaire), 0);

    doc.setFont('helvetica', 'bold');
    doc.text(d.id, 18, y + 5.5);

    doc.setFont('helvetica', 'normal');
    const nameText = doc.splitTextToSize(`${d.form.nom} ${d.form.prenom}`, 48);
    doc.text(nameText[0] || '', 48, y + 5.5);

    doc.text(`${d.form.departement} (${d.form.commune || '-'})`, 100, y + 5.5);

    const domaineShort = d.form.domaine ? d.form.domaine.split('(')[0].trim() : '-';
    doc.text(domaineShort, 130, y + 5.5);

    const titleShort = doc.splitTextToSize(d.form.titreProjet || 'Sans titre', 60);
    doc.text(titleShort[0] || '', 180, y + 5.5);

    doc.text(budgetTotal.toLocaleString('fr-FR'), 245, y + 5.5, { align: 'right' });

    if (d.statut === 'soumis') {
      doc.setTextColor(22, 101, 52); // green
      doc.text('SOUMIS', 280, y + 5.5, { align: 'right' });
    } else {
      doc.setTextColor(180, 83, 9); // amber
      doc.text('BROUILLON', 280, y + 5.5, { align: 'right' });
    }

    y += 8;
  });

  doc.save(`CSB_Camp2026_Liste_Candidatures_${nowStr.replace(/\//g, '-')}.pdf`);
}
