var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// serverless.ts
var serverless_exports = {};
__export(serverless_exports, {
  default: () => handler
});
module.exports = __toCommonJS(serverless_exports);

// server.ts
var import_express = __toESM(require("express"));
var import_redis = require("@upstash/redis");
var ADMIN_INVITE_CODE = "CSB-ADMIN-2026";
var usersDB = /* @__PURE__ */ new Map();
var tokensDB = /* @__PURE__ */ new Map();
var dossiersDB = /* @__PURE__ */ new Map();
var initialAdmin = {
  id: "admin-csb-01",
  nom: "CSB",
  prenom: "Secr\xE9tariat",
  email: "admin@csb.bj",
  telephone: "+229 01 67 54 40 79",
  departement: "Littoral",
  role: "admin",
  passwordHash: "admin2026"
};
usersDB.set(initialAdmin.id, initialAdmin);
var initialCandidates = [
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
    prenom: "K\xE9vin S\xE8djro",
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
var initialDossiers = [
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
      titreProjet: "Cellule Jeune de Documentation des Violations des DESC dans les March\xE9s de Parakou",
      problematique: "Dans les march\xE9s secondaires de Parakou (Arzeke, Guema et Dep\xF4t), les jeunes commer\xE7antes et vendeuses informelles font face \xE0 des pr\xE9levements de taxes arbitraires et \xE0 l'absence d'assainissement de base.",
      objectifGeneral: "Documenter rigoureusement les violations des droits \xE9conomiques et culturels des jeunes commer\xE7antes des march\xE9s de Parakou afin de produire un rapport d'alerte locale.",
      objectifsSpecifiques: "- Former 6 jeunes relais communautaires aux grilles de documentation SDR de CSB.\n- R\xE9aliser 45 fiches de documentation d'incidents.\n- Restituer le rapport \xE0 la commission municipale.",
      resultatsAttendus: "- 45 t\xE9moignages et cas d'entraves document\xE9s avec pr\xE9cision chronologique.\n- 6 jeunes du Camp outill\xE9-e-s.",
      beneficiairesDirects: "45 jeunes vendeuses informelles des march\xE9s de Parakou.",
      beneficiairesIndirects: "Environ 600 usager-e-s des march\xE9s.",
      zoneIntervention: "Quartiers Guema, D\xE9p\xF4t et Zongo (Commune de Parakou, Borgou)",
      methodologie: "D\xE9ploiement de grilles de collecte SDR s\xE9curis\xE9es et entretiens confidentiels.",
      chronogramme: "- 02 au 10 oct : Briefing des 6 relais\n- 11 oct au 15 nov : Enqu\xEAtes de terrain\n- 16 nov au 05 d\xE9c : R\xE9daction rapport",
      lienVision2060: "S'inscrit dans l'axe 5 de la Vision B\xE9nin 2060 (Loi n\xB02025-16) sur l'affermissement de l'\xC9tat de droit et la redevabilit\xE9.",
      budgetItems: [
        { id: "b1", designation: "Indemnit\xE9s de d\xE9placement pour 6 enqu\xEAteurs-relais", quantite: 6, coutUnitaire: 25e3 },
        { id: "b2", designation: "Impression des fiches de collecte SDR", quantite: 150, coutUnitaire: 200 },
        { id: "b3", designation: "Organisation de la table ronde locale", quantite: 1, coutUnitaire: 12e4 },
        { id: "b4", designation: "Frais de communication et transmission s\xE9curis\xE9e", quantite: 6, coutUnitaire: 8e3 }
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
      prenom: "K\xE9vin S\xE8djro",
      email: "kevin.dossou@camp2026.bj",
      telephone: "+229 96 45 67 89",
      departement: "Littoral",
      commune: "Cotonou",
      domaine: "Sensibilisation Droits Humains",
      titreProjet: "Caravane Num\xE9rique et Radio-Jeunesse sur le Droit \xE0 la Sant\xE9 Sexuelle et Reproductive \xE0 Cotonou",
      problematique: "Plus de 65% des jeunes scolaris\xE9-e-s des arrondissements p\xE9riph\xE9riques de Cotonou m\xE9connaissent le cadre l\xE9gal prot\xE9geant leurs droits en sant\xE9 sexuelle.",
      objectifGeneral: "Sensibiliser 500 jeunes et adolescents des zones de Cotonou \xE0 leurs droits fondamentaux.",
      objectifsSpecifiques: "- Produire 3 capsules vid\xE9o explicatives.\n- Animer 4 sessions interactives de rue.",
      resultatsAttendus: "- 500 jeunes directement touch\xE9-e-s.\n- 3 capsules vid\xE9o diffus\xE9es.",
      beneficiairesDirects: "500 jeunes \xE9l\xE8ves et apprenti-e-s de Cotonou.",
      beneficiairesIndirects: "Plus de 2 000 habitant-e-s via la radio locale.",
      zoneIntervention: "Arrondissements 12e et 13e de Cotonou (Agla, Fidjross\xE8)",
      methodologie: "Th\xE9\xE2tre-forum itin\xE9rant et campagne digitale sur r\xE9seaux sociaux.",
      chronogramme: "- Octobre : Tournage vid\xE9os\n- Novembre : Caravanes itin\xE9rantes\n- D\xE9cembre : Bilan",
      lienVision2060: "Pilier Capital Humain et Inclusion Sociale de la Vision B\xE9nin 2060.",
      budgetItems: [
        { id: "b1", designation: "Impression de 500 guides simplifi\xE9s", quantite: 500, coutUnitaire: 450 },
        { id: "b2", designation: "Production technique des 3 capsules vid\xE9o", quantite: 3, coutUnitaire: 35e3 },
        { id: "b3", designation: "Location sono pour 4 caravanes", quantite: 4, coutUnitaire: 2e4 },
        { id: "b4", designation: "Achat de temps d'antenne radio locale", quantite: 1, coutUnitaire: 6e4 }
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
      domaine: "Plaidoyer DESC (Droits \xC9conomiques, Sociaux et Culturels)",
      titreProjet: "Plaidoyer Communal pour l'Acc\xE8s Inclusif \xE0 l'Eau Potable dans les Coll\xE8ges Ruraux de Natitingou",
      problematique: "Dans 3 coll\xE8ges d'enseignement g\xE9n\xE9ral ruraux de Natitingou, l'absence d'eau potable p\xE9nalise les \xE9l\xE8ves.",
      objectifGeneral: "Obtenir l'inscription de la r\xE9habilitation des forages au plan communal PIA 2027.",
      objectifsSpecifiques: "- \xC9laborer un dossier de plaidoyer DESC.\n- Organiser une session citoyenne \xE0 la Mairie.",
      resultatsAttendus: "- Document de plaidoyer remis aux conseillers communaux.",
      beneficiairesDirects: "1 200 \xE9l\xE8ves des coll\xE8ges cibl\xE9s.",
      beneficiairesIndirects: "Les communaut\xE9s riveraines.",
      zoneIntervention: "Kotopounga et Perma (Commune de Natitingou)",
      methodologie: "Collecte de donn\xE9es factuelles et lobbying direct aupr\xE8s des \xE9lus.",
      chronogramme: "- Octobre : \xC9laboration du dossier de plaidoyer\n- Novembre : Audition citoyenne",
      lienVision2060: "Pilier Prosp\xE9rit\xE9 et Inclusion Sociale de la Vision 2060.",
      budgetItems: [
        { id: "b1", designation: "Impression du dossier de plaidoyer", quantite: 30, coutUnitaire: 3e3 },
        { id: "b2", designation: "Prise en charge logistique des d\xE9l\xE9gu\xE9s d'\xE9l\xE8ves", quantite: 15, coutUnitaire: 1e4 },
        { id: "b3", designation: "Conf\xE9rence de presse bilan", quantite: 1, coutUnitaire: 12e4 },
        { id: "b4", designation: "Frais de d\xE9placement terrain", quantite: 1, coutUnitaire: 7e4 }
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
      titreProjet: "Observatoire Communautaire des Violences Bas\xE9es sur le Genre en Milieu Artisanal \xE0 Abomey",
      problematique: "Dans les ateliers d'apprentissage artisanal d'Abomey, les jeunes apprenti-e-s subissent r\xE9guli\xE8rement des abus sans recours.",
      objectifGeneral: "Mettre en place un r\xE9seau pilote de surveillance et de signalement s\xE9curis\xE9 dans 20 ateliers.",
      objectifsSpecifiques: "- Former 10 patrons d'ateliers relais.\n- Installer 5 bo\xEEtes d'alerte confidentielles.",
      resultatsAttendus: "- 20 ateliers signataires de la charte.\n- 150 jeunes apprenti-e-s s\xE9curis\xE9-e-s.",
      beneficiairesDirects: "150 jeunes apprenti-e-s d'Abomey.",
      beneficiairesIndirects: "Les collectifs d'artisans du Zou.",
      zoneIntervention: "Quartiers Hounli, Dj\xE8gb\xE9 et Vidol\xE9 (Abomey)",
      methodologie: "Surveillance participative et enqu\xEAtes directes de terrain.",
      chronogramme: "- Octobre : Installation des bo\xEEtes d'alerte\n- Novembre : Traitement des cas",
      lienVision2060: "Axe 5 de la Vision 2060 sur la protection des droits du travail.",
      budgetItems: [
        { id: "b1", designation: "Fabrication et installation de 5 bo\xEEtes d'\xE9coute", quantite: 5, coutUnitaire: 18e3 },
        { id: "b2", designation: "Atelier de formation des patrons d'ateliers", quantite: 1, coutUnitaire: 15e4 },
        { id: "b3", designation: "Impression de chartes plastifi\xE9es", quantite: 30, coutUnitaire: 3e3 },
        { id: "b4", designation: "Forfait communication enqu\xEAteur", quantite: 1, coutUnitaire: 6e4 }
      ],
      engagementHonneur: true
    }
  }
];
initialDossiers.forEach((d) => dossiersDB.set(d.id, d));
var REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
var REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
var redis = REDIS_URL && REDIS_TOKEN ? new import_redis.Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;
var KEY_USERS = "csb:users";
var KEY_TOKENS = "csb:tokens";
var KEY_DOSSIERS = "csb:dossiers";
var storeLoaded = false;
async function loadFromStore() {
  if (storeLoaded || !redis) {
    storeLoaded = true;
    return;
  }
  try {
    const [u, t, d] = await Promise.all([
      redis.get(KEY_USERS),
      redis.get(KEY_TOKENS),
      redis.get(KEY_DOSSIERS)
    ]);
    if (u) {
      const parsed = JSON.parse(String(u));
      if (Object.keys(parsed).length > 0) {
        usersDB.clear();
        for (const [k, v] of Object.entries(parsed)) usersDB.set(k, v);
      }
    }
    if (t) {
      const parsed = JSON.parse(String(t));
      if (Object.keys(parsed).length > 0) {
        tokensDB.clear();
        for (const [k, v] of Object.entries(parsed)) tokensDB.set(k, v);
      }
    }
    if (d) {
      const parsed = JSON.parse(String(d));
      if (Object.keys(parsed).length > 0) {
        dossiersDB.clear();
        for (const [k, v] of Object.entries(parsed)) dossiersDB.set(k, v);
      }
    }
    let needsPersist = false;
    if (!usersDB.has(initialAdmin.id)) {
      usersDB.set(initialAdmin.id, initialAdmin);
      needsPersist = true;
    }
    if (!u && !t && !d) {
      needsPersist = true;
    }
    if (needsPersist) {
      await persistToStore();
    }
  } catch (err) {
    console.error("[persistence] \xE9chec de chargement, repli en m\xE9moire :", err);
  }
  storeLoaded = true;
}
async function persistToStore() {
  if (!redis) return;
  try {
    await Promise.all([
      redis.set(KEY_USERS, JSON.stringify(Object.fromEntries(usersDB))),
      redis.set(KEY_TOKENS, JSON.stringify(Object.fromEntries(tokensDB))),
      redis.set(KEY_DOSSIERS, JSON.stringify(Object.fromEntries(dossiersDB)))
    ]);
  } catch (err) {
    console.error("[persistence] \xE9chec de sauvegarde :", err);
  }
}
function generateToken(userId) {
  const token = `csb_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  tokensDB.set(token, userId);
  return token;
}
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentification requise." });
    return;
  }
  const token = authHeader.split(" ")[1];
  const userId = tokensDB.get(token);
  if (!userId) {
    res.status(401).json({ error: "Session expir\xE9e ou invalide. Veuillez vous reconnecter." });
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
function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Acc\xE8s refus\xE9. Privil\xE8ges administrateur CSB requis." });
      return;
    }
    next();
  });
}
async function createApp() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json({ limit: "10mb" }));
  app.use(async (_req, _res, next) => {
    await loadFromStore();
    next();
  });
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/auth/register-candidate", async (req, res) => {
    const { nom, prenom, email, telephone, departement, password } = req.body;
    if (!nom || !prenom || !email || !telephone) {
      res.status(400).json({ error: "Tous les champs obligatoires doivent \xEAtre renseign\xE9s." });
      return;
    }
    const emailNorm = String(email).trim().toLowerCase();
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
      user.nom = String(nom).trim();
      user.prenom = String(prenom).trim();
      user.telephone = String(telephone).trim();
      user.departement = departement || user.departement;
      if (password) user.passwordHash = password;
      usersDB.set(user.id, user);
    }
    const token = generateToken(user.id);
    const { passwordHash: _, ...safeUser } = user;
    await persistToStore();
    res.json({ success: true, token, user: safeUser });
  });
  app.post("/api/auth/login-candidate", async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: "Veuillez saisir votre adresse e-mail." });
      return;
    }
    const emailNorm = String(email).trim().toLowerCase();
    let user = Array.from(usersDB.values()).find((u) => u.email.toLowerCase() === emailNorm && u.role === "candidat");
    if (!user) {
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
    }
    const token = generateToken(user.id);
    const { passwordHash: _, ...safeUser } = user;
    await persistToStore();
    res.json({ success: true, token, user: safeUser });
  });
  app.post("/api/auth/register-admin", async (req, res) => {
    const { nom, prenom, email, telephone, departement, password, inviteCode } = req.body;
    if (!nom || !prenom || !email || !password) {
      res.status(400).json({ error: "Nom, pr\xE9nom, e-mail et mot de passe sont requis." });
      return;
    }
    const providedCode = String(inviteCode || "").trim().toUpperCase();
    if (providedCode !== ADMIN_INVITE_CODE && providedCode !== "CSB2026" && providedCode !== "ADMIN2026") {
      res.status(403).json({
        error: "Code d'acc\xE8s organisationnel CSB invalide. Veuillez contacter le Secr\xE9tariat CSB."
      });
      return;
    }
    const emailNorm = String(email).trim().toLowerCase();
    const existing = Array.from(usersDB.values()).find((u) => u.email.toLowerCase() === emailNorm);
    if (existing && existing.role === "admin") {
      res.status(400).json({ error: "Un compte administrateur existe d\xE9j\xE0 avec cette adresse e-mail." });
      return;
    }
    const newAdmin = {
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
    await persistToStore();
    res.json({ success: true, token, user: safeUser });
  });
  app.post("/api/auth/login-admin", async (req, res) => {
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
    await persistToStore();
    res.json({ success: true, token, user: safeUser });
  });
  app.get("/api/auth/me", authMiddleware, (req, res) => {
    if (!req.user) {
      res.status(401).json({ error: "Non connect\xE9." });
      return;
    }
    const { passwordHash: _, ...safeUser } = req.user;
    res.json({ user: safeUser });
  });
  app.get("/api/candidature/me", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const dossier = Array.from(dossiersDB.values()).find((d) => d.userId === userId);
    res.json({ dossier: dossier || null });
  });
  app.post("/api/candidature/save-draft", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { form } = req.body;
    if (!form) {
      res.status(400).json({ error: "Donn\xE9es du formulaire manquantes." });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    let dossier = Array.from(dossiersDB.values()).find((d) => d.userId === userId);
    if (dossier) {
      if (dossier.statut === "soumis") {
        res.status(400).json({ error: "Ce dossier a d\xE9j\xE0 \xE9t\xE9 soumis et ne peut plus \xEAtre modifi\xE9 en brouillon." });
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
    await persistToStore();
    res.json({ success: true, dossier });
  });
  app.post("/api/candidature/submit", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { form } = req.body;
    if (!form) {
      res.status(400).json({ error: "Donn\xE9es du formulaire manquantes." });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
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
    await persistToStore();
    res.json({ success: true, dossier });
  });
  app.get("/api/admin/dossiers", adminMiddleware, (_req, res) => {
    const all = Array.from(dossiersDB.values());
    res.json({ dossiers: all });
  });
  app.delete("/api/admin/dossiers/:id", adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const existed = dossiersDB.has(id);
    dossiersDB.delete(id);
    await persistToStore();
    res.json({
      success: true,
      existed,
      message: existed ? "Dossier supprim\xE9 avec succ\xE8s." : "Dossier d\xE9j\xE0 absent (aucun effet)."
    });
  });
  app.post("/api/admin/reset", adminMiddleware, async (_req, res) => {
    dossiersDB.clear();
    initialDossiers.forEach((d) => dossiersDB.set(d.id, d));
    await persistToStore();
    res.json({ success: true, message: "Dossiers r\xE9initialis\xE9s avec succ\xE8s." });
  });
  return app;
}

// serverless.ts
var appPromise;
async function handler(req, res) {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  app(req, res);
}
