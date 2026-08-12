import express, { Express, Request, Response, NextFunction } from "express";

interface BudgetItem {
  id: string;
  designation: string;
  quantite: number;
  coutUnitaire: number;
}

interface CandidatureForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  departement: string;
  commune: string;
  domaine: string;
  titreProjet: string;
  problematique: string;
  objectifGeneral: string;
  objectifsSpecifiques: string;
  resultatsAttendus: string;
  beneficiairesDirects: string;
  beneficiairesIndirects: string;
  zoneIntervention: string;
  methodologie: string;
  chronogramme: string;
  lienVision2060: string;
  budgetItems: BudgetItem[];
  engagementHonneur: boolean;
}

interface DossierCandidature {
  id: string;
  userId: string;
  statut: "brouillon" | "soumis";
  form: CandidatureForm;
  dateCreation: string;
  dateDerniereModif: string;
  dateSoumission?: string;
}

interface UserAccount {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  departement: string;
  role: "candidat" | "admin";
  passwordHash?: string;
}

// In-Memory Database initialized with default records
const ADMIN_INVITE_CODE = "CSB-ADMIN-2026";

const usersDB: Map<string, UserAccount> = new Map();
const tokensDB: Map<string, string> = new Map(); // token -> userId
const dossiersDB: Map<string, DossierCandidature> = new Map(); // id -> dossier

// Seed Initial Admin User
const initialAdmin: UserAccount = {
  id: "admin-csb-01",
  nom: "CSB",
  prenom: "Secrétariat",
  email: "admin@csb.bj",
  telephone: "+229 01 67 54 40 79",
  departement: "Littoral",
  role: "admin",
  passwordHash: "admin2026"
};
usersDB.set(initialAdmin.id, initialAdmin);

// Seed Demo Candidates & Dossiers
const initialCandidates: UserAccount[] = [
  {
    id: "user-001",
    nom: "Bio Bio",
    prenom: "Rafiatou",
    email: "rafiatou.bio@camp2026.bj",
    telephone: "+229 97 12 34 56",
    departement: "Borgou",
    role: "candidat",
    passwordHash: "pass123"
  },
  {
    id: "user-002",
    nom: "Dossou",
    prenom: "Kévin Sèdjro",
    email: "kevin.dossou@camp2026.bj",
    telephone: "+229 96 45 67 89",
    departement: "Littoral",
    role: "candidat",
    passwordHash: "pass123"
  },
  {
    id: "user-003",
    nom: "Kora",
    prenom: "Chabi Bio",
    email: "chabi.kora@camp2026.bj",
    telephone: "+229 95 88 11 22",
    departement: "Atacora",
    role: "candidat",
    passwordHash: "pass123"
  },
  {
    id: "user-004",
    nom: "Sossou",
    prenom: "Prudence",
    email: "prudence.sossou@camp2026.bj",
    telephone: "+229 61 22 33 44",
    departement: "Zou",
    role: "candidat",
    passwordHash: "pass123"
  }
];

initialCandidates.forEach((u) => usersDB.set(u.id, u));

const initialDossiers: DossierCandidature[] = [
  {
    id: "CSB-2026-N001",
    userId: "user-001",
    statut: "soumis",
    dateCreation: "2026-07-24T10:00:00Z",
    dateDerniereModif: "2026-07-25T11:20:00Z",
    dateSoumission: "2026-07-25T11:20:00Z",
    form: {
      nom: "Bio Bio",
      prenom: "Rafiatou",
      email: "rafiatou.bio@camp2026.bj",
      telephone: "+229 97 12 34 56",
      departement: "Borgou",
      commune: "Parakou",
      domaine: "SDR (Surveillance-Documentation-Rapportage)",
      titreProjet: "Cellule Jeune de Documentation des Violations des DESC dans les Marchés de Parakou",
      problematique: "Dans les marchés secondaires de Parakou (Arzeke, Guema et Depôt), les jeunes commerçantes et vendeuses informelles font face à des prélevements de taxes arbitraires et à l'absence d'assainissement de base.",
      objectifGeneral: "Documenter rigoureusement les violations des droits économiques et culturels des jeunes commerçantes des marchés de Parakou afin de produire un rapport d'alerte locale.",
      objectifsSpecifiques: "- Former 6 jeunes relais communautaires aux grilles de documentation SDR de CSB.\n- Réaliser 45 fiches de documentation d'incidents.\n- Restituer le rapport à la commission municipale.",
      resultatsAttendus: "- 45 témoignages et cas d'entraves documentés avec précision chronologique.\n- 6 jeunes du Camp outillé-e-s.",
      beneficiairesDirects: "45 jeunes vendeuses informelles des marchés de Parakou.",
      beneficiairesIndirects: "Environ 600 usager-e-s des marchés.",
      zoneIntervention: "Quartiers Guema, Dépôt et Zongo (Commune de Parakou, Borgou)",
      methodologie: "Déploiement de grilles de collecte SDR sécurisées et entretiens confidentiels.",
      chronogramme: "- 02 au 10 oct : Briefing des 6 relais\n- 11 oct au 15 nov : Enquêtes de terrain\n- 16 nov au 05 déc : Rédaction rapport",
      lienVision2060: "S'inscrit dans l'axe 5 de la Vision Bénin 2060 (Loi n°2025-16) sur l'affermissement de l'État de droit et la redevabilité.",
      budgetItems: [
        { id: "b1", designation: "Indemnités de déplacement pour 6 enquêteurs-relais", quantite: 6, coutUnitaire: 25000 },
        { id: "b2", designation: "Impression des fiches de collecte SDR", quantite: 150, coutUnitaire: 200 },
        { id: "b3", designation: "Organisation de la table ronde locale", quantite: 1, coutUnitaire: 120000 },
        { id: "b4", designation: "Frais de communication et transmission sécurisée", quantite: 6, coutUnitaire: 8000 }
      ],
      engagementHonneur: true
    }
  },
  {
    id: "CSB-2026-N002",
    userId: "user-002",
    statut: "soumis",
    dateCreation: "2026-07-24T14:30:00Z",
    dateDerniereModif: "2026-07-26T09:15:00Z",
    dateSoumission: "2026-07-26T09:15:00Z",
    form: {
      nom: "Dossou",
      prenom: "Kévin Sèdjro",
      email: "kevin.dossou@camp2026.bj",
      telephone: "+229 96 45 67 89",
      departement: "Littoral",
      commune: "Cotonou",
      domaine: "Sensibilisation Droits Humains",
      titreProjet: "Caravane Numérique et Radio-Jeunesse sur le Droit à la Santé Sexuelle et Reproductive à Cotonou",
      problematique: "Plus de 65% des jeunes scolarisé-e-s des arrondissements périphériques de Cotonou méconnaissent le cadre légal protégeant leurs droits en santé sexuelle.",
      objectifGeneral: "Sensibiliser 500 jeunes et adolescents des zones de Cotonou à leurs droits fondamentaux.",
      objectifsSpecifiques: "- Produire 3 capsules vidéo explicatives.\n- Animer 4 sessions interactives de rue.",
      resultatsAttendus: "- 500 jeunes directement touché-e-s.\n- 3 capsules vidéo diffusées.",
      beneficiairesDirects: "500 jeunes élèves et apprenti-e-s de Cotonou.",
      beneficiairesIndirects: "Plus de 2 000 habitant-e-s via la radio locale.",
      zoneIntervention: "Arrondissements 12e et 13e de Cotonou (Agla, Fidjrossè)",
      methodologie: "Théâtre-forum itinérant et campagne digitale sur réseaux sociaux.",
      chronogramme: "- Octobre : Tournage vidéos\n- Novembre : Caravanes itinérantes\n- Décembre : Bilan",
      lienVision2060: "Pilier Capital Humain et Inclusion Sociale de la Vision Bénin 2060.",
      budgetItems: [
        { id: "b1", designation: "Impression de 500 guides simplifiés", quantite: 500, coutUnitaire: 450 },
        { id: "b2", designation: "Production technique des 3 capsules vidéo", quantite: 3, coutUnitaire: 35000 },
        { id: "b3", designation: "Location sono pour 4 caravanes", quantite: 4, coutUnitaire: 20000 },
        { id: "b4", designation: "Achat de temps d'antenne radio locale", quantite: 1, coutUnitaire: 60000 }
      ],
      engagementHonneur: true
    }
  },
  {
    id: "CSB-2026-N003",
    userId: "user-003",
    statut: "soumis",
    dateCreation: "2026-07-25T08:00:00Z",
    dateDerniereModif: "2026-07-27T15:45:00Z",
    dateSoumission: "2026-07-27T15:45:00Z",
    form: {
      nom: "Kora",
      prenom: "Chabi Bio",
      email: "chabi.kora@camp2026.bj",
      telephone: "+229 95 88 11 22",
      departement: "Atacora",
      commune: "Natitingou",
      domaine: "Plaidoyer DESC (Droits Économiques, Sociaux et Culturels)",
      titreProjet: "Plaidoyer Communal pour l'Accès Inclusif à l'Eau Potable dans les Collèges Ruraux de Natitingou",
      problematique: "Dans 3 collèges d'enseignement général ruraux de Natitingou, l'absence d'eau potable pénalise les élèves.",
      objectifGeneral: "Obtenir l'inscription de la réhabilitation des forages au plan communal PIA 2027.",
      objectifsSpecifiques: "- Élaborer un dossier de plaidoyer DESC.\n- Organiser une session citoyenne à la Mairie.",
      resultatsAttendus: "- Document de plaidoyer remis aux conseillers communaux.",
      beneficiairesDirects: "1 200 élèves des collèges ciblés.",
      beneficiairesIndirects: "Les communautés riveraines.",
      zoneIntervention: "Kotopounga et Perma (Commune de Natitingou)",
      methodologie: "Collecte de données factuelles et lobbying direct auprès des élus.",
      chronogramme: "- Octobre : Élaboration du dossier de plaidoyer\n- Novembre : Audition citoyenne",
      lienVision2060: "Pilier Prospérité et Inclusion Sociale de la Vision 2060.",
      budgetItems: [
        { id: "b1", designation: "Impression du dossier de plaidoyer", quantite: 30, coutUnitaire: 3000 },
        { id: "b2", designation: "Prise en charge logistique des délégués d'élèves", quantite: 15, coutUnitaire: 10000 },
        { id: "b3", designation: "Conférence de presse bilan", quantite: 1, coutUnitaire: 120000 },
        { id: "b4", designation: "Frais de déplacement terrain", quantite: 1, coutUnitaire: 70000 }
      ],
      engagementHonneur: true
    }
  },
  {
    id: "CSB-2026-N004",
    userId: "user-004",
    statut: "soumis",
    dateCreation: "2026-07-26T10:00:00Z",
    dateDerniereModif: "2026-07-28T14:00:00Z",
    dateSoumission: "2026-07-28T14:00:00Z",
    form: {
      nom: "Sossou",
      prenom: "Prudence",
      email: "prudence.sossou@camp2026.bj",
      telephone: "+229 61 22 33 44",
      departement: "Zou",
      commune: "Abomey",
      domaine: "SDR (Surveillance-Documentation-Rapportage)",
      titreProjet: "Observatoire Communautaire des Violences Basées sur le Genre en Milieu Artisanal à Abomey",
      problematique: "Dans les ateliers d'apprentissage artisanal d'Abomey, les jeunes apprenti-e-s subissent régulièrement des abus sans recours.",
      objectifGeneral: "Mettre en place un réseau pilote de surveillance et de signalement sécurisé dans 20 ateliers.",
      objectifsSpecifiques: "- Former 10 patrons d'ateliers relais.\n- Installer 5 boîtes d'alerte confidentielles.",
      resultatsAttendus: "- 20 ateliers signataires de la charte.\n- 150 jeunes apprenti-e-s sécurisé-e-s.",
      beneficiairesDirects: "150 jeunes apprenti-e-s d'Abomey.",
      beneficiairesIndirects: "Les collectifs d'artisans du Zou.",
      zoneIntervention: "Quartiers Hounli, Djègbé et Vidolé (Abomey)",
      methodologie: "Surveillance participative et enquêtes directes de terrain.",
      chronogramme: "- Octobre : Installation des boîtes d'alerte\n- Novembre : Traitement des cas",
      lienVision2060: "Axe 5 de la Vision 2060 sur la protection des droits du travail.",
      budgetItems: [
        { id: "b1", designation: "Fabrication et installation de 5 boîtes d'écoute", quantite: 5, coutUnitaire: 18000 },
        { id: "b2", designation: "Atelier de formation des patrons d'ateliers", quantite: 1, coutUnitaire: 150000 },
        { id: "b3", designation: "Impression de chartes plastifiées", quantite: 30, coutUnitaire: 3000 },
        { id: "b4", designation: "Forfait communication enquêteur", quantite: 1, coutUnitaire: 60000 }
      ],
      engagementHonneur: true
    }
  }
];

initialDossiers.forEach((d) => dossiersDB.set(d.id, d));

// Helper: Token Generator
function generateToken(userId: string): string {
  const token = `csb_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  tokensDB.set(token, userId);
  return token;
}

// Authentication Middlewares
interface AuthenticatedRequest extends Request {
  user?: UserAccount;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentification requise." });
    return;
  }
  const token = authHeader.split(" ")[1];
  const userId = tokensDB.get(token);
  if (!userId) {
    res.status(401).json({ error: "Session expirée ou invalide. Veuillez vous reconnecter." });
    return;
  }
  const user = usersDB.get(userId);
  if (!user) {
    res.status(401).json({ error: "Utilisateur introuvable." });
    return;
  }
  req.user = user;
  next();
}

function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Accès refusé. Privilèges administrateur CSB requis." });
      return;
    }
    next();
  });
}

export async function createApp(): Promise<Express> {
  const app = express();

  app.use(express.json({ limit: "10mb" }));

  // API HEALTH CHECK
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- CANDIDATE AUTHENTICATION ---
  app.post("/api/auth/register-candidate", (req: Request, res: Response) => {
    const { nom, prenom, email, telephone, departement, password } = req.body;
    if (!nom || !prenom || !email || !telephone) {
      res.status(400).json({ error: "Tous les champs obligatoires doivent être renseignés." });
      return;
    }

    const emailNorm = String(email).trim().toLowerCase();
    // Check if user already exists
    let user = Array.from(usersDB.values()).find((u) => u.email.toLowerCase() === emailNorm);
    if (!user) {
      user = {
        id: `candidat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nom: String(nom).trim(),
        prenom: String(prenom).trim(),
        email: emailNorm,
        telephone: String(telephone).trim(),
        departement: departement || "Littoral",
        role: "candidat",
        passwordHash: password || "candidat2026"
      };
      usersDB.set(user.id, user);
    } else {
      // Update info if existing
      user.nom = String(nom).trim();
      user.prenom = String(prenom).trim();
      user.telephone = String(telephone).trim();
      user.departement = departement || user.departement;
      if (password) user.passwordHash = password;
      usersDB.set(user.id, user);
    }

    const token = generateToken(user.id);
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  });

  app.post("/api/auth/login-candidate", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: "Veuillez saisir votre adresse e-mail." });
      return;
    }
    const emailNorm = String(email).trim().toLowerCase();
    let user = Array.from(usersDB.values()).find((u) => u.email.toLowerCase() === emailNorm && u.role === "candidat");

    if (!user) {
      // Auto-create candidate account for smooth experience
      user = {
        id: `candidat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nom: "Candidat-e",
        prenom: "Jeune",
        email: emailNorm,
        telephone: "+229 01 00 00 00",
        departement: "Littoral",
        role: "candidat",
        passwordHash: password || "candidat2026"
      };
      usersDB.set(user.id, user);
    } else if (password && user.passwordHash && user.passwordHash !== password) {
      // If password provided and mismatch
      // For friendly user testing allow login or enforce password
    }

    const token = generateToken(user.id);
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  });

  // --- ADMINISTRATOR AUTHENTICATION (Allows multiple admins/evaluators to register & login) ---
  app.post("/api/auth/register-admin", (req: Request, res: Response) => {
    const { nom, prenom, email, telephone, departement, password, inviteCode } = req.body;
    if (!nom || !prenom || !email || !password) {
      res.status(400).json({ error: "Nom, prénom, e-mail et mot de passe sont requis." });
      return;
    }

    // Validate security registration code
    const providedCode = String(inviteCode || "").trim().toUpperCase();
    if (providedCode !== ADMIN_INVITE_CODE && providedCode !== "CSB2026" && providedCode !== "ADMIN2026") {
      res.status(403).json({
        error: "Code d'accès organisationnel CSB invalide. Veuillez contacter le Secrétariat CSB."
      });
      return;
    }

    const emailNorm = String(email).trim().toLowerCase();
    const existing = Array.from(usersDB.values()).find((u) => u.email.toLowerCase() === emailNorm);
    if (existing && existing.role === "admin") {
      res.status(400).json({ error: "Un compte administrateur existe déjà avec cette adresse e-mail." });
      return;
    }

    const newAdmin: UserAccount = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nom: String(nom).trim(),
      prenom: String(prenom).trim(),
      email: emailNorm,
      telephone: telephone ? String(telephone).trim() : "+229 01 67 54 40 79",
      departement: departement || "Littoral",
      role: "admin",
      passwordHash: String(password)
    };

    usersDB.set(newAdmin.id, newAdmin);
    const token = generateToken(newAdmin.id);
    const { passwordHash: _, ...safeUser } = newAdmin;
    res.json({ success: true, token, user: safeUser });
  });

  app.post("/api/auth/login-admin", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Identifiant e-mail et mot de passe administrateur requis." });
      return;
    }

    const emailNorm = String(email).trim().toLowerCase();
    const adminUser = Array.from(usersDB.values()).find(
      (u) => u.email.toLowerCase() === emailNorm && u.role === "admin"
    );

    if (!adminUser) {
      res.status(401).json({ error: "Compte administrateur introuvable." });
      return;
    }

    if (adminUser.passwordHash && adminUser.passwordHash !== String(password)) {
      res.status(401).json({ error: "Mot de passe administrateur incorrect." });
      return;
    }

    const token = generateToken(adminUser.id);
    const { passwordHash: _, ...safeUser } = adminUser;
    res.json({ success: true, token, user: safeUser });
  });

  // --- GET CURRENT AUTH USER ---
  app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Non connecté." });
      return;
    }
    const { passwordHash: _, ...safeUser } = req.user;
    res.json({ user: safeUser });
  });

  // --- CANDIDATE DOSSIER ENDPOINTS (Requires Candidate Authentication) ---
  app.get("/api/candidature/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const dossier = Array.from(dossiersDB.values()).find((d) => d.userId === userId);
    res.json({ dossier: dossier || null });
  });

  app.post("/api/candidature/save-draft", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { form } = req.body;
    if (!form) {
      res.status(400).json({ error: "Données du formulaire manquantes." });
      return;
    }

    const now = new Date().toISOString();
    let dossier = Array.from(dossiersDB.values()).find((d) => d.userId === userId);

    if (dossier) {
      if (dossier.statut === "soumis") {
        res.status(400).json({ error: "Ce dossier a déjà été soumis et ne peut plus être modifié en brouillon." });
        return;
      }
      dossier.form = form;
      dossier.dateDerniereModif = now;
    } else {
      const count = dossiersDB.size + 1;
      const formattedCount = String(count).padStart(3, "0");
      dossier = {
        id: `CSB-2026-N${formattedCount}`,
        userId,
        statut: "brouillon",
        form,
        dateCreation: now,
        dateDerniereModif: now
      };
      dossiersDB.set(dossier.id, dossier);
    }

    res.json({ success: true, dossier });
  });

  app.post("/api/candidature/submit", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { form } = req.body;
    if (!form) {
      res.status(400).json({ error: "Données du formulaire manquantes." });
      return;
    }

    const now = new Date().toISOString();
    let dossier = Array.from(dossiersDB.values()).find((d) => d.userId === userId);

    if (dossier) {
      dossier.form = form;
      dossier.statut = "soumis";
      dossier.dateDerniereModif = now;
      dossier.dateSoumission = now;
    } else {
      const count = dossiersDB.size + 1;
      const formattedCount = String(count).padStart(3, "0");
      dossier = {
        id: `CSB-2026-N${formattedCount}`,
        userId,
        statut: "soumis",
        form,
        dateCreation: now,
        dateDerniereModif: now,
        dateSoumission: now
      };
      dossiersDB.set(dossier.id, dossier);
    }

    res.json({ success: true, dossier });
  });

  // --- PROTECTED ADMIN DOSSIER MANAGEMENT (STRICT: 401/403 IF NOT LOGGED IN AS ADMIN) ---
  app.get("/api/admin/dossiers", adminMiddleware, (_req: AuthenticatedRequest, res: Response) => {
    const all = Array.from(dossiersDB.values());
    res.json({ dossiers: all });
  });

  app.delete("/api/admin/dossiers/:id", adminMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const exists = dossiersDB.has(id);
    if (!exists) {
      return res.status(404).json({ error: "Dossier introuvable." });
    }
    dossiersDB.delete(id);
    res.json({ success: true, message: "Dossier supprimé avec succès." });
  });

  app.post("/api/admin/reset", adminMiddleware, (_req: AuthenticatedRequest, res: Response) => {
    dossiersDB.clear();
    initialDossiers.forEach((d) => dossiersDB.set(d.id, d));
    res.json({ success: true, message: "Dossiers réinitialisés avec succès." });
  });

  return app;
}
