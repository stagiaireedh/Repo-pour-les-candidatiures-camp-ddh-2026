import { DossierCandidature, UserAccount } from '../types';

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'user-001',
    nom: 'Bio Bio',
    prenom: 'Rafiatou',
    email: 'rafiatou.bio@camp2026.bj',
    telephone: '+229 97 12 34 56',
    departement: 'Borgou',
    role: 'candidat'
  },
  {
    id: 'user-002',
    nom: 'Dossou',
    prenom: 'Kévin Sèdjro',
    email: 'kevin.dossou@camp2026.bj',
    telephone: '+229 96 45 67 89',
    departement: 'Littoral',
    role: 'candidat'
  },
  {
    id: 'user-003',
    nom: 'Kora',
    prenom: 'Chabi Bio',
    email: 'chabi.kora@camp2026.bj',
    telephone: '+229 95 88 11 22',
    departement: 'Atacora',
    role: 'candidat'
  },
  {
    id: 'user-004',
    nom: 'Sossou',
    prenom: 'Prudence',
    email: 'prudence.sossou@camp2026.bj',
    telephone: '+229 61 22 33 44',
    departement: 'Zou',
    role: 'candidat'
  }
];

export const DEMO_DOSSIERS: DossierCandidature[] = [
  {
    id: 'CSB-2026-N001',
    userId: 'user-001',
    statut: 'soumis',
    dateCreation: '2026-07-24T10:00:00Z',
    dateDerniereModif: '2026-07-25T11:20:00Z',
    dateSoumission: '2026-07-25T11:20:00Z',
    form: {
      nom: 'Bio Bio',
      prenom: 'Rafiatou',
      email: 'rafiatou.bio@camp2026.bj',
      telephone: '+229 97 12 34 56',
      departement: 'Borgou',
      commune: 'Parakou',
      domaine: 'SDR (Surveillance-Documentation-Rapportage)',
      titreProjet: 'Cellule Jeune de Documentation des Violations des DESC dans les Marchés de Parakou',
      problematique: 'Dans les marchés secondaires de Parakou (Arzeke, Guema et Depôt), les jeunes commerçantes et vendeuses informelles font face à des prélevements de taxes arbitraires et à l\'absence d\'assainissement de base. Ces situations ne sont ni documentées ni remontées aux autorités municipales, maintenant un déni systématique de leurs droits économiques.',
      objectifGeneral: 'Documenter rigoureusement les violations des droits économiques et culturels des jeunes commerçantes des marchés de Parakou afin de produire un rapport d\'alerte locale à l\'intention de la mairie.',
      objectifsSpecifiques: '- Former 6 jeunes relais communautaires aux grilles de documentation SDR de CSB.\n- Réaliser 45 fiches de documentation d\'incidents et d\'entraves aux DESC d\'ici fin septembre 2026.\n- Produire et présenter une note synthétique de synthèse lors d\'une table ronde avec la commission des marchés de Parakou.',
      resultatsAttendus: '- 45 témoignages et cas d\'entraves documentés avec précision chronologique.\n- 6 jeunes du Camp 2026 outillé-e-s de façon pratique aux outils SDR.\n- Engagement formel des délégués de marché et du conseiller local pour ouvrir une boîte à doléances.',
      beneficiairesDirects: '45 jeunes vendeuses informelles des marchés de Parakou et 6 enquêtrices-relais.',
      beneficiairesIndirects: 'Environ 600 usager-e-s des marchés Arzeke et Guema bénéficiant d\'un plaidoyer d\'assainissement.',
      zoneIntervention: 'Quartiers Guema, Dépôt et Zongo (Commune de Parakou, Département du Borgou)',
      methodologie: 'Déploiement de grilles de collecte SDR sécurisées, entretiens individuels confidentiels, triangulation des faits auprès des syndicats de marchands, et rédaction d\'un rapport d\'alerte conforme aux standards de CSB.',
      chronogramme: '- 02 au 10 octobre 2026 : Briefing des 6 relais de Parakou et déploiement des grilles SDR.\n- 11 octobre au 15 novembre 2026 : Enquêtes de terrain et documentation des 45 cas dans les marchés.\n- 16 novembre au 05 décembre : Saisie, analyse et rédaction du rapport d\'alerte SDR.\n- 15 au 20 décembre 2026 : Table ronde de restitution avec la commission des marchés et la Mairie de Parakou.',
      lienVision2060: 'S\'inscrit directement dans le 5e axe de la Vision Bénin 2060 (Loi n°2025-16) sur l\'affermissement de l\'État de droit et la gouvernance éthique. Répond également au critère d\'Accessibilité du cadre AAAQ du Comité DESC de l\'ONU.',
      budgetItems: [
        { id: 'b1', designation: 'Indemnités de déplacement de terrain pour 6 enquêteurs-relais (3 semaines)', quantite: 6, coutUnitaire: 25000 },
        { id: 'b2', designation: 'Impression des fiches de collecte et fiches d\'information droits humains', quantite: 150, coutUnitaire: 200 },
        { id: 'b3', designation: 'Organisation de la table ronde locale de restitution (pause café + salle)', quantite: 1, coutUnitaire: 120000 },
        { id: 'b4', designation: 'Frais de téléphonie et connexion pour la transmission sécurisée des données SDR', quantite: 6, coutUnitaire: 8000 }
      ],
      engagementHonneur: true
    }
  },
  {
    id: 'CSB-2026-N002',
    userId: 'user-002',
    statut: 'soumis',
    dateCreation: '2026-07-24T14:30:00Z',
    dateDerniereModif: '2026-07-26T09:15:00Z',
    dateSoumission: '2026-07-26T09:15:00Z',
    form: {
      nom: 'Dossou',
      prenom: 'Kévin Sèdjro',
      email: 'kevin.dossou@camp2026.bj',
      telephone: '+229 96 45 67 89',
      departement: 'Littoral',
      commune: 'Cotonou',
      domaine: 'Sensibilisation Droits Humains',
      titreProjet: 'Caravane Numérique et Radio-Jeunesse sur le Droit à la Santé Sexuelle et Reproductive à Cotonou',
      problematique: 'Malgré les réformes législatives progressistes au Bénin, plus de 65% des jeunes scolarisé-e-s des arrondissements périphériques de Cotonou (Agla, Sainte-Rita) méconnaissent le cadre légal protégeant leurs droits en santé sexuelle et reproductive, ce qui alimente stigmatisation et grossesses précoces.',
      objectifGeneral: 'Sensibiliser 500 jeunes et adolescents des zones périurbaines de Cotonou à leurs droits fondamentaux en matière de santé sexuelle et reproductive à travers des canaux artistiques et numériques.',
      objectifsSpecifiques: '- Produire 3 capsules vidéo explicatives en français et fon sur la loi SSR.\n- Animer 4 sessions interactives "Bout de rue Droits Humains" dans les quartiers d\'Agla et Fidjrossè.\n- Organiser une émission radio-jeunesse sur une station à forte audience locale.',
      resultatsAttendus: '- 500 jeunes directement touché-e-s et sensibilisé-e-s.\n- 3 capsules vidéo diffusées et comptabilisant au moins 3 000 vues sur les réseaux sociaux.\n- Distribution de 500 guides simplifiés "Mes Droits, Ma Santé".',
      beneficiairesDirects: '500 jeunes élèves et apprenti-e-s de Cotonou (15-24 ans).',
      beneficiairesIndirects: 'Plus de 2 000 habitant-e-s et parents sensibilisés via la radio locale.',
      zoneIntervention: 'Arrondissements 12e et 13e de Cotonou (Agla, Cadjehoun, Fidjrossè)',
      methodologie: 'Approche participative par le théâtre-forum itinérant, couplée à une campagne digitale sur TikTok/Facebook et à la distribution de guides illustrés faciles à comprendre.',
      chronogramme: '- 02 au 15 octobre 2026 : Conception graphique des guides et tournage des 3 capsules vidéo.\n- 16 octobre au 10 novembre : 4 passages de la caravane itinérante dans les quartiers ciblés.\n- 15 au 25 novembre : Enregistrement et diffusion de l\'émission radio.\n- 10 au 20 décembre 2026 : Évaluation d\'impact et transmission du rapport final à CSB.',
      lienVision2060: 'S\'inscrit dans le pilier Capital Humain et Inclusion Sociale de la Vision Bénin 2060 (Loi n°2025-16), en assurant la Disponibilité et l\'Acceptabilité (Cadre AAAQ ONU) des informations sur les droits en santé sexuelle.',
      budgetItems: [
        { id: 'b1', designation: 'Conception et impression de 500 guides simplifiés "Mes Droits, Ma Santé"', quantite: 500, coutUnitaire: 450 },
        { id: 'b2', designation: 'Production technique des 3 capsules vidéo (Prise de vue + Montage)', quantite: 3, coutUnitaire: 35000 },
        { id: 'b3', designation: 'Location sono portable et logistique pour 4 caravanes de quartier', quantite: 4, coutUnitaire: 20000 },
        { id: 'b4', designation: 'Achat de temps d\'antenne pour émission radio interactive (1h)', quantite: 1, coutUnitaire: 60000 }
      ],
      engagementHonneur: true
    }
  },
  {
    id: 'CSB-2026-N003',
    userId: 'user-003',
    statut: 'soumis',
    dateCreation: '2026-07-25T08:00:00Z',
    dateDerniereModif: '2026-07-27T15:45:00Z',
    dateSoumission: '2026-07-27T15:45:00Z',
    form: {
      nom: 'Kora',
      prenom: 'Chabi Bio',
      email: 'chabi.kora@camp2026.bj',
      telephone: '+229 95 88 11 22',
      departement: 'Atacora',
      commune: 'Natitingou',
      domaine: 'Plaidoyer DESC (Droits Économiques, Sociaux et Culturels)',
      titreProjet: 'Plaidoyer Communal pour l\'Accès Inclusif à l\'Eau Potable dans les Collèges Ruraux de Natitingou',
      problematique: 'Dans trois collèges d\'enseignement général ruraux de Natitingou (Kotopounga, Perma), l\'absence de points d\'eau potable fonctionnels et séparés viole le droit à l\'éducation et à la santé, provoquant l\'absentéisme récurrent des jeunes filles pendant leurs périodes menstruelles.',
      objectifGeneral: 'Obtenir l\'inscription prioritaire de la réhabilitation des forages de 3 collèges ruraux au plan d\'investissement annuel (PIA 2027) de la commune de Natitingou.',
      objectifsSpecifiques: '- Élaborer un dossier de plaidoyer étayé sur le droit à l\'eau et à l\'assainissement en milieu scolaire.\n- Organiser une session d\'audition citoyenne des jeunes devant la commission affaires sociales de la Mairie.\n- Signer une charte d\'engagement avec l\'association des parents d\'élèves et le conseil communal.',
      resultatsAttendus: '- Un document d\'argumentaire de plaidoyer remis officiel aux 19 conseillers communaux.\n- Adoption d\'une délibération communale actant l\'aménagement de points d\'eau.\n- 1 200 élèves bénéficiant à terme de meilleures conditions d\'hygiène.',
      beneficiairesDirects: '1 200 élèves des CEG Kotopounga, Perma et Natitingou 3.',
      beneficiairesIndirects: 'Les corps enseignants et les familles des communautés avoisinantes.',
      zoneIntervention: 'Arrondissements ruraux de Kotopounga et Perma (Commune de Natitingou)',
      methodologie: 'Plaidoyer factuel basé sur les principes des DESC : collecte d\'évidence, élaboration du document d\'orientations budgétaires citoyen, rencontres de lobbying stratégique et conférence de presse locale.',
      chronogramme: '- 02 au 20 octobre 2026 : Diagnostique technique de terrain et élaboration du dossier de plaidoyer.\n- 21 octobre au 15 novembre : Lobbying direct auprès des conseillers communaux de Natitingou.\n- 20 novembre : Session publique d\'audition citoyenne des jeunes devant la commission Mairie.\n- 15 au 22 décembre 2026 : Suivi du vote du budget communal PIA 2027.',
      lienVision2060: 'Traduit concrètement le pilier "Prospérité et Inclusion Sociale" de la Vision Bénin 2060 (Loi n°2025-16) en garantissant la Qualité et la Disponibilité (Cadre AAAQ DESC ONU) des infrastructures d\'eau potable en milieu scolaire rural.',
      budgetItems: [
        { id: 'b1', designation: 'Rédaction, graphisme et impression en couleur du dossier de plaidoyer', quantite: 30, coutUnitaire: 3000 },
        { id: 'b2', designation: 'Prise en charge logistique des représentant-e-s d\'élèves pour l\'audition citoyenne', quantite: 15, coutUnitaire: 10000 },
        { id: 'b3', designation: 'Organisation de la conférence de presse bilan avec les radios communautaires', quantite: 1, coutUnitaire: 120000 },
        { id: 'b4', designation: 'Frais de carburant et déplacement sur le terrain d\'intervention', quantite: 1, coutUnitaire: 70000 }
      ],
      engagementHonneur: true
    }
  },
  {
    id: 'CSB-2026-N004',
    userId: 'user-004',
    statut: 'soumis',
    dateCreation: '2026-07-26T10:00:00Z',
    dateDerniereModif: '2026-07-28T14:00:00Z',
    dateSoumission: '2026-07-28T14:00:00Z',
    form: {
      nom: 'Sossou',
      prenom: 'Prudence',
      email: 'prudence.sossou@camp2026.bj',
      telephone: '+229 61 22 33 44',
      departement: 'Zou',
      commune: 'Abomey',
      domaine: 'SDR (Surveillance-Documentation-Rapportage)',
      titreProjet: 'Observatoire Communautaire des Violences Basées sur le Genre en Milieu Artisanal à Abomey',
      problematique: 'Dans les ateliers d\'apprentissage artisanal (coiffure, couture, soudure) de la commune d\'Abomey, les jeunes apprenti-e-s subissent régulièrement des abus financiers, des châtiments corporels et des violences psychologiques occultées par la pression sociale.',
      objectifGeneral: 'Mettre en place un réseau pilote de surveillance et de signalement sécurisé pour prévenir et documenter les abus de droits humains dans 20 ateliers d\'apprentissage d\'Abomey.',
      objectifsSpecifiques: '- Identifier et former 10 patrons et patronnes d\'ateliers champions des droits humains.\n- Installer 5 boîtes d\'alerte et d\'écoute confidentielles au sein des marchés d\'Abomey.\n- Rédiger un rapport périodique transmis au point focal CSB et aux services sociaux.',
      resultatsAttendus: '- 20 ateliers signataires d\'une charte Zéro Abus Droits Humains.\n- 10 cas d\'abus documentés et accompagnés vers une résolution pacifique ou légale.\n- 150 jeunes apprenti-e-s sécurisé-e-s dans leur parcours de formation professionnelle.',
      beneficiairesDirects: '150 jeunes apprenti-e-s artisan-e-s d\'Abomey.',
      beneficiairesIndirects: 'Les collectif des artisans du Zou et les centres de promotion sociale.',
      zoneIntervention: 'Quartiers Hounli, Djègbé et Vidolé (Commune d\'Abomey, Département du Zou)',
      methodologie: 'Approche SDR combinant surveillance passive (boîtes d\'alerte) et enquêtes de vérification directe avec l\'appui des représentants locaux des artisans.',
      chronogramme: '- 02 au 20 octobre 2026 : Signature des partenariats et installation des boîtes d\'écoute.\n- 21 octobre au 30 novembre : Collecte des alertes SDR, enquêtes de vérification et accompagnement.\n- 01 au 20 décembre 2026 : Rédaction et restitution du bulletin périodique de l\'observatoire.',
      lienVision2060: 'Directement aligné avec l\'orientation 5 de la Vision Bénin 2060 (Loi n°2025-16) sur la protection des droits du travail et le renforcement de la résilience sociale.',
      budgetItems: [
        { id: 'b1', designation: 'Fabrication et installation de 5 boîtes d\'écoute sécurisées', quantite: 5, coutUnitaire: 18000 },
        { id: 'b2', designation: 'Atelier de sensibilisation des 20 patrons et patronnes d\'ateliers d\'Abomey', quantite: 1, coutUnitaire: 150000 },
        { id: 'b3', designation: 'Impression de la Charte des droits de l\'apprenti-e en affiches plastifiées', quantite: 30, coutUnitaire: 3000 },
        { id: 'b4', designation: 'Forfait de communication et suivi des cas documentés par l\'enquêtrice', quantite: 1, coutUnitaire: 60000 }
      ],
      engagementHonneur: true
    }
  }
];
