export type DomaineActivite = 'SDR (Surveillance-Documentation-Rapportage)' | 'Sensibilisation Droits Humains' | 'Plaidoyer DESC (Droits Économiques, Sociaux et Culturels)';

export type DepartementBenin = 
  | 'Alibori'
  | 'Atacora'
  | 'Atlantique'
  | 'Borgou'
  | 'Collines'
  | 'Couffo'
  | 'Donga'
  | 'Littoral'
  | 'Mono'
  | 'Ouémé'
  | 'Plateau'
  | 'Zou';

export interface BudgetItem {
  id: string;
  designation: string;
  quantite: number;
  coutUnitaire: number;
}

export interface CandidatureForm {
  // Étape 1: Identification
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  departement: DepartementBenin | '';
  commune: string;
  domaines: DomaineActivite[];

  // Étape 2: Description du projet
  titreProjet: string;
  problematique: string;
  objectifGeneral: string;
  objectifsSpecifiques: string;
  resultatsAttendus: string;
  beneficiairesDirects: string;
  beneficiairesIndirects: string;
  zoneIntervention: string;

  // Étape 3: Méthodologie et Vision 2060
  methodologie: string;
  chronogramme: string;
  lienVision2060: string;

  // Étape 4: Budget
  budgetItems: BudgetItem[];

  // Engagements
  engagementHonneur: boolean;
}

export type StatutDossier = 'brouillon' | 'soumis';

export interface DossierCandidature {
  id: string; // e.g., CSB-2026-N001
  userId: string;
  statut: StatutDossier;
  form: CandidatureForm;
  dateCreation: string;
  dateDerniereModif: string;
  dateSoumission?: string;
}

export interface UserAccount {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  departement: DepartementBenin;
  role: 'candidat' | 'admin';
}
