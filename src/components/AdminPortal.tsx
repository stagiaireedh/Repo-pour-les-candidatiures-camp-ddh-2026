import React, { useState, useEffect } from 'react';
import { DossierCandidature, DepartementBenin, UserAccount } from '../types';
import { apiLoginAdmin, apiRegisterAdmin, apiGetAdminDossiers, apiDeleteAdminDossier, apiResetAdminDossiers, clearStoredTokens } from '../utils/api';
import { deleteDossier, deleteDossierByUserId } from '../utils/storage';
import { generateSingleDossierPdf, generateGlobalListPdf } from '../utils/pdfGenerator';
import { 
  Lock, 
  Search, 
  Download, 
  Eye, 
  Check, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Mail, 
  X,
  Building2,
  Users,
  UserPlus,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface AdminPortalProps {
  onAdminLoginSuccess: (adminUser: UserAccount) => void;
  isAdminLoggedIn: boolean;
  onNavigatePublic?: () => void;
  onAdminLogout?: () => void;
}

const DEPARTEMENTS: (DepartementBenin | 'Tous')[] = [
  'Tous', 'Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo',
  'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou'
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onAdminLoginSuccess,
  isAdminLoggedIn,
  onNavigatePublic,
  onAdminLogout
}) => {
  // Auth mode for admin portal
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form states
  const [adminEmail, setAdminEmail] = useState('admin@csb.bj');
  const [adminPassword, setAdminPassword] = useState('admin2026');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form states (allows multiple admins/evaluators from CSB to register)
  const [regNom, setRegNom] = useState('');
  const [regPrenom, setRegPrenom] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelephone, setRegTelephone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('CSB-ADMIN-2026');
  const [regError, setRegError] = useState('');

  // Data states
  const [dossiers, setDossiers] = useState<DossierCandidature[]>([]);
  const [isLoadingDossiers, setIsLoadingDossiers] = useState(false);
  const [dataError, setDataError] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('Tous');
  const [selectedDomaine, setSelectedDomaine] = useState<string>('Tous');
  const [selectedStatut, setSelectedStatut] = useState<string>('Tous');

  // Detail Modal
  const [viewDossier, setViewDossier] = useState<DossierCandidature | null>(null);

  // Email Copy feedback
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Fetch dossiers when authenticated (source de vérité : le serveur/Redis)
  const loadDossiers = async () => {
    setIsLoadingDossiers(true);
    setDataError('');
    try {
      const serverDossiers = await apiGetAdminDossiers();
      setDossiers(serverDossiers);
    } catch (err: any) {
      console.error(err);
      setDataError(err.message || 'Impossible de charger les dossiers.');
    } finally {
      setIsLoadingDossiers(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadDossiers();
    }
  }, [isAdminLoggedIn]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      const result = await apiLoginAdmin({
        email: adminEmail.trim(),
        password: adminPassword
      });
      onAdminLoginSuccess(result.user);
      await loadDossiers();
    } catch (err: any) {
      setLoginError(err.message || 'Identifiant ou mot de passe administrateur incorrect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regNom.trim() || !regPrenom.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await apiRegisterAdmin({
        nom: regNom.trim(),
        prenom: regPrenom.trim(),
        email: regEmail.trim(),
        telephone: regTelephone.trim() || '+229 01 67 54 40 79',
        password: regPassword,
        inviteCode: regInviteCode.trim()
      });
      onAdminLoginSuccess(result.user);
      await loadDossiers();
    } catch (err: any) {
      setRegError(err.message || 'Erreur lors de la création du compte administrateur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdminDemo = () => {
    setAdminEmail('admin@csb.bj');
    setAdminPassword('admin2026');
    setLoginError('');
  };

  const fillRegisterDemo = () => {
    setRegNom('Migan');
    setRegPrenom('Roméo');
    setRegEmail('romeo.migan@changementsocialbenin.org');
    setRegTelephone('+229 01 67 54 40 79');
    setRegPassword('csbadmin2026');
    setRegInviteCode('CSB-ADMIN-2026');
  };

  const handleResetData = async () => {
    if (confirm('Voulez-vous réinitialiser les dossiers de test d\'origine ?')) {
      try {
        await apiResetAdminDossiers();
        await loadDossiers();
      } catch (err: any) {
        alert(err.message || 'Erreur de réinitialisation');
      }
    }
  };

  const handleDeleteDossier = async (dossierId: string, userId?: string) => {
    if (!window.confirm(`Êtes-vous sûr-e de vouloir supprimer définitivement le dossier ${dossierId} ?\n\nLe candidat pourra automatiquement introduire une nouvelle candidature de zéro.`)) {
      return;
    }

    try {
      setIsLoadingDossiers(true);
      await apiDeleteAdminDossier(dossierId);
      deleteDossier(dossierId);
      if (userId) {
        deleteDossierByUserId(userId);
      }
      if (viewDossier?.id === dossierId) {
        setViewDossier(null);
      }
      await loadDossiers();
      alert(`Le dossier ${dossierId} a été supprimé avec succès. Le candidat peut désormais repostuler de zéro.`);
    } catch (err: any) {
      alert(`Erreur lors de la suppression : ${err.message || 'Impossible de supprimer le dossier'}`);
    } finally {
      setIsLoadingDossiers(false);
    }
  };

  const handleLogout = () => {
    clearStoredTokens();
    if (onAdminLogout) {
      onAdminLogout();
    }
  };

  // Filter logic
  const filteredDossiers = dossiers.filter(d => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = 
      d.form.nom.toLowerCase().includes(searchLower) ||
      d.form.prenom.toLowerCase().includes(searchLower) ||
      d.form.titreProjet.toLowerCase().includes(searchLower) ||
      d.form.commune.toLowerCase().includes(searchLower) ||
      d.id.toLowerCase().includes(searchLower);

    const matchDept = selectedDept === 'Tous' || d.form.departement === selectedDept;
    const matchDomaine = selectedDomaine === 'Tous' || d.form.domaine.includes(selectedDomaine);
    const matchStatut = selectedStatut === 'Tous' || d.statut === selectedStatut;

    return matchSearch && matchDept && matchDomaine && matchStatut;
  });

  // Calculate statistics
  const totalDossiers = dossiers.length;
  const soumisCount = dossiers.filter(d => d.statut === 'soumis').length;
  const brouillonsCount = dossiers.filter(d => d.statut === 'brouillon').length;

  const copySubmittedEmails = () => {
    const emails = dossiers
      .filter(d => d.statut === 'soumis')
      .map(d => d.form.email)
      .filter(Boolean)
      .join(', ');

    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 3000);
  };

  // Unauthenticated Admin View: Secure Gate (No Dossier Data Exposed)
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        
        {/* Top Back to Public link */}
        <div className="mb-4">
          <button
            onClick={onNavigatePublic}
            className="text-sm font-bold text-slate-600 hover:text-[#1F4E79] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retourner au site public</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#1F4E79] text-white p-6 sm:p-7 border-b-4 border-[#7A0C10] text-center space-y-2 relative">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto text-amber-300 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Portail Administrateur & Évaluateurs CSB
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto font-medium">
              Accès privé réservé au Secrétariat et aux membres du Comité Scientifique de l'ONG Changement Social Bénin.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginError(''); setRegError(''); }}
                className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-[#1F4E79] shadow-sm font-extrabold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-amber-500" />
                <span>Connexion Admin</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('register'); setLoginError(''); setRegError(''); }}
                className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-[#1F4E79] shadow-sm font-extrabold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#1F4E79]" />
                <span>Créer Compte Admin / Jury</span>
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Identifiant E-mail Administrateur</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@csb.bj"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Mot de passe</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] focus:outline-none shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#1F4E79] hover:bg-[#163858] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-70 mt-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Vérification en cours...' : 'Accéder au Tableau de Bord Admin'}</span>
                </button>

                <div className="pt-3 border-t border-slate-200 text-center">
                  <button
                    type="button"
                    onClick={fillAdminDemo}
                    className="text-xs sm:text-sm text-[#7A0C10] font-bold hover:underline cursor-pointer"
                  >
                    Remplir avec identifiants officiels de test CSB
                  </button>
                </div>
              </form>
            ) : (
              /* Register New Admin Form (Multiple Evaluators Can Sign Up) */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Nom *</label>
                    <input
                      type="text"
                      required
                      value={regNom}
                      onChange={(e) => setRegNom(e.target.value)}
                      placeholder="ex: MIGAN"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] focus:outline-none shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={regPrenom}
                      onChange={(e) => setRegPrenom(e.target.value)}
                      placeholder="ex: Roméo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Adresse E-mail Professionnelle *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="prenom.nom@changementsocialbenin.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] focus:outline-none shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Téléphone</label>
                    <input
                      type="text"
                      value={regTelephone}
                      onChange={(e) => setRegTelephone(e.target.value)}
                      placeholder="+229 01 67 54 40 79"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] focus:outline-none shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Mot de passe *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                  <label className="block font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Code d'accès organisationnel CSB *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regInviteCode}
                    onChange={(e) => setRegInviteCode(e.target.value)}
                    placeholder="Code fourni par le Secrétariat CSB (ex: CSB-ADMIN-2026)"
                    className="w-full px-3 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-[#1F4E79] focus:outline-none text-sm bg-white uppercase font-mono font-bold text-slate-900 shadow-xs"
                  />
                  <p className="text-xs text-amber-800 font-medium">
                    Code de validation interne sécurisant l'enregistrement des évaluateurs CSB.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#7A0C10] hover:bg-[#5e090c] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-70 mt-2"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Création en cours...' : 'Créer mon Compte Administrateur / Évaluateur'}</span>
                </button>

                <div className="pt-2 border-t border-slate-200 text-center">
                  <button
                    type="button"
                    onClick={fillRegisterDemo}
                    className="text-xs sm:text-sm text-[#1F4E79] font-bold hover:underline cursor-pointer"
                  >
                    Remplir exemple évaluateur (Roméo Migan)
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="space-y-8 pb-12">
      
      {/* Admin Dashboard Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Building2 className="w-4 h-4 text-[#1F4E79]" />
            <span className="font-semibold text-slate-700">ONG Changement Social Bénin | Direction des Programmes</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Session Sécurisée
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1F4E79]">
            Gestion des Candidatures - Camp 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Consultez les dossiers soumis par les 24 jeunes et exportez les rapports PDF pour le comité d'accompagnement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {onNavigatePublic && (
            <button
              onClick={onNavigatePublic}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Site Public</span>
            </button>
          )}

          <button
            onClick={() => generateGlobalListPdf(filteredDossiers)}
            className="px-4 py-2 bg-[#7A0C10] hover:bg-[#5e090c] text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Exporter Liste PDF</span>
          </button>

          <button
            onClick={copySubmittedEmails}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            {copiedEmails ? <Check className="w-4 h-4 text-emerald-600" /> : <Mail className="w-4 h-4 text-[#1F4E79]" />}
            <span>{copiedEmails ? 'E-mails copiés !' : 'Copier E-mails'}</span>
          </button>

          <button
            onClick={handleResetData}
            title="Réinitialiser les dossiers de test"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            title="Déconnexion Administrateur"
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
          >
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {dataError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-semibold flex items-center justify-between">
          <span>{dataError}</span>
          <button onClick={loadDossiers} className="underline font-bold">Réessayer</button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#EBF3FB] p-5 rounded-2xl border border-blue-100 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total Candidatures</p>
            <p className="text-3xl font-extrabold text-[#1F4E79] mt-1">{totalDossiers}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1F4E79] text-white flex items-center justify-center font-bold">
            <Users className="w-6 h-6 text-amber-300" />
          </div>
        </div>

        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-emerald-700 font-bold uppercase">Dossiers Soumis</p>
            <p className="text-3xl font-extrabold text-emerald-800 mt-1">{soumisCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-amber-800 font-bold uppercase">Brouillons en rédaction</p>
            <p className="text-3xl font-extrabold text-amber-900 mt-1">{brouillonsCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Chercher par nom, titre, commune..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F4E79] focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#1F4E79] focus:outline-none font-medium text-slate-700"
            >
              <option value="Tous">Tous les départements</option>
              {DEPARTEMENTS.filter(d => d !== 'Tous').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Domaine Filter */}
          <div>
            <select
              value={selectedDomaine}
              onChange={(e) => setSelectedDomaine(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#1F4E79] focus:outline-none font-medium text-slate-700"
            >
              <option value="Tous">Tous les domaines</option>
              <option value="SDR">SDR (Surveillance-Documentation-Rapportage)</option>
              <option value="Sensibilisation">Sensibilisation Droits Humains</option>
              <option value="Plaidoyer">Plaidoyer DESC</option>
            </select>
          </div>

          {/* Statut Filter */}
          <div>
            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#1F4E79] focus:outline-none font-medium text-slate-700"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="soumis">Dossiers soumis uniquement</option>
              <option value="brouillon">Brouillons uniquement</option>
            </select>
          </div>

        </div>

      </div>

      {/* Candidatures Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="p-4 bg-[#1F4E79] text-white flex items-center justify-between border-b-2 border-[#7A0C10]">
          <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Liste des Candidatures ({filteredDossiers.length})</span>
          </span>
          <span className="text-[11px] text-blue-200">
            {isLoadingDossiers ? 'Chargement sécurisé...' : 'Cliquez sur un dossier pour la vue détaillée'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3.5">N° Dossier</th>
                <th className="p-3.5">Candidat-e</th>
                <th className="p-3.5">Département / Localité</th>
                <th className="p-3.5">Domaine</th>
                <th className="p-3.5">Titre du Projet</th>
                <th className="p-3.5 text-right">Budget (FCFA)</th>
                <th className="p-3.5 text-center">Statut</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingDossiers ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    Chargement sécurisé des dossiers en cours...
                  </td>
                </tr>
              ) : filteredDossiers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    Aucun dossier ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredDossiers.map((d) => {
                  const total = d.form.budgetItems.reduce((sum, item) => sum + (item.quantite * item.coutUnitaire), 0);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="p-3.5 font-extrabold text-[#1F4E79]">
                        {d.id}
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{d.form.nom} {d.form.prenom}</p>
                        <p className="text-[11px] text-slate-500">{d.form.email}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-800">{d.form.departement}</span>
                        <span className="block text-[11px] text-slate-500">{d.form.commune || '-'}</span>
                      </td>

                      <td className="p-3.5 max-w-[180px]">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#1F4E79] font-semibold text-[11px] truncate w-full">
                          {d.form.domaine ? d.form.domaine.split('(')[0] : '-'}
                        </span>
                      </td>

                      <td className="p-3.5 max-w-[220px]">
                        <p className="text-slate-900 font-medium line-clamp-2 leading-tight">
                          {d.form.titreProjet || 'Projet sans titre'}
                        </p>
                      </td>

                      <td className="p-3.5 text-right font-extrabold text-[#7A0C10]">
                        {total.toLocaleString('fr-FR')}
                      </td>

                      <td className="p-3.5 text-center">
                        {d.statut === 'soumis' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                            Soumis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                            Brouillon
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewDossier(d)}
                            className="p-1.5 bg-[#1F4E79] hover:bg-[#163858] text-white rounded-lg transition-colors cursor-pointer"
                            title="Voir le dossier complet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => generateSingleDossierPdf(d)}
                            className="p-1.5 bg-[#7A0C10] hover:bg-[#5e090c] text-white rounded-lg transition-colors cursor-pointer"
                            title="Télécharger la fiche PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteDossier(d.id, d.userId)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                            title="Supprimer ce dossier (permet au candidat de repostuler)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Detailed Dossier Modal */}
      {viewDossier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-[#1F4E79] text-white p-5 border-b-4 border-[#7A0C10] flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  Dossier N° {viewDossier.id}
                </span>
                <h3 className="font-extrabold text-lg text-white">
                  {viewDossier.form.nom} {viewDossier.form.prenom} ({viewDossier.form.departement})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateSingleDossierPdf(viewDossier)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={() => handleDeleteDossier(viewDossier.id, viewDossier.userId)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1 cursor-pointer"
                  title="Supprimer définitivement ce dossier"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>

                <button
                  onClick={() => setViewDossier(null)}
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Section 1 */}
              <div className="bg-[#EBF3FB] p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-[#1F4E79] text-sm">1. Coordonnées & Domaine</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p><strong>Candidat-e :</strong> {viewDossier.form.nom} {viewDossier.form.prenom}</p>
                  <p><strong>Contact :</strong> {viewDossier.form.telephone} | {viewDossier.form.email}</p>
                  <p><strong>Département :</strong> {viewDossier.form.departement} ({viewDossier.form.commune})</p>
                  <p><strong>Domaine :</strong> {viewDossier.form.domaine}</p>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#1F4E79] text-sm border-b border-slate-200 pb-1">
                  2. Description du Projet
                </h4>
                
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Titre de la mini-activité :</span>
                  <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-200">
                    {viewDossier.form.titreProjet}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">Problématique :</span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-800 whitespace-pre-line leading-relaxed">
                    {viewDossier.form.problematique}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Objectif Général :</span>
                    <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed">
                      {viewDossier.form.objectifGeneral}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Résultats Attendus :</span>
                    <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed">
                      {viewDossier.form.resultatsAttendus}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">Objectifs Spécifiques :</span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-800 whitespace-pre-line leading-relaxed">
                    {viewDossier.form.objectifsSpecifiques}
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#1F4E79] text-sm border-b border-slate-200 pb-1">
                  3. Méthodologie & Vision Bénin 2060
                </h4>
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Méthodologie :</span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed">{viewDossier.form.methodologie}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Contribution à la Vision 2060 :</span>
                  <p className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
                    {viewDossier.form.lienVision2060}
                  </p>
                </div>
              </div>

              {/* Section 4 Budget */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#1F4E79] text-sm border-b border-slate-200 pb-1">
                  4. Budget Détaillé
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#1F4E79] text-white uppercase text-[10px]">
                      <tr>
                        <th className="p-2">Poste</th>
                        <th className="p-2 text-center">Qté</th>
                        <th className="p-2 text-right">Prix U.</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewDossier.form.budgetItems.map((b) => (
                        <tr key={b.id}>
                          <td className="p-2 font-medium">{b.designation}</td>
                          <td className="p-2 text-center">{b.quantite}</td>
                          <td className="p-2 text-right">{b.coutUnitaire.toLocaleString('fr-FR')}</td>
                          <td className="p-2 text-right font-bold">{(b.quantite * b.coutUnitaire).toLocaleString('fr-FR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-right pt-1">
                  <span className="font-extrabold text-[#7A0C10] text-sm">
                    Total : {viewDossier.form.budgetItems.reduce((acc, i) => acc + (i.quantite * i.coutUnitaire), 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewDossier(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
