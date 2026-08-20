import React, { useState, useEffect } from 'react';
import { 
  UserAccount, 
  CandidatureForm, 
  DossierCandidature, 
  DomaineActivite, 
  DepartementBenin, 
  BudgetItem 
} from '../types';
import { 
  getDossierByUserId, 
  createOrUpdateDraft, 
  submitDossier,
  deleteDossierByUserId
} from '../utils/storage';
import { 
  apiGetMyDossier, 
  apiSaveDraft, 
  apiSubmitDossier 
} from '../utils/api';
import { generateSingleDossierPdf } from '../utils/pdfGenerator';
import { 
  CheckCircle, 
  Save, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  FileCheck2, 
  Download, 
  Check, 
  Info,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface CandidatePortalProps {
  currentUser: UserAccount;
}

const DOMAINES: DomaineActivite[] = [
  'SDR (Surveillance-Documentation-Rapportage)',
  'Sensibilisation Droits Humains',
  'Plaidoyer DESC (Droits Économiques, Sociaux et Culturels)'
];

const DEPARTEMENTS: DepartementBenin[] = [
  'Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo',
  'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou'
];

export const CandidatePortal: React.FC<CandidatePortalProps> = ({ currentUser }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [dossier, setDossier] = useState<DossierCandidature | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [showSavedNotification, setShowSavedNotification] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showResetBanner, setShowResetBanner] = useState<boolean>(false);

  const getInitialForm = (u: UserAccount): CandidatureForm => ({
    nom: u.nom,
    prenom: u.prenom,
    email: u.email,
    telephone: u.telephone,
    departement: u.departement,
    commune: '',
    domaine: 'SDR (Surveillance-Documentation-Rapportage)',
    titreProjet: '',
    problematique: '',
    objectifGeneral: '',
    objectifsSpecifiques: '',
    resultatsAttendus: '',
    beneficiairesDirects: '',
    beneficiairesIndirects: '',
    zoneIntervention: '',
    methodologie: '',
    chronogramme: '',
    lienVision2060: '',
    budgetItems: [
      { id: 'b1', designation: 'Matériel et fiches de collecte/sensibilisation', quantite: 1, coutUnitaire: 50000 },
      { id: 'b2', designation: 'Frais de transport et déplacements de terrain', quantite: 1, coutUnitaire: 40000 },
      { id: 'b3', designation: 'Organisation de la session d\'échange / atelier local', quantite: 1, coutUnitaire: 100000 }
    ],
    engagementHonneur: false
  });

  // Form state
  const [form, setForm] = useState<CandidatureForm>(() => getInitialForm(currentUser));

  // Load existing dossier or draft on mount (tries Server API first, falls back to local storage)
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      // 1. Check local storage first for instant render
      const localExisting = getDossierByUserId(currentUser.id);
      if (isMounted && localExisting) {
        setDossier(localExisting);
        setForm(localExisting.form);
      }

      // 2. Fetch remote from server API
      try {
        const remote = await apiGetMyDossier();
        if (isMounted) {
          if (remote) {
            setDossier(remote);
            setForm(remote.form);
            createOrUpdateDraft(currentUser.id, remote.form);
          } else {
            // Server has no dossier for this user (e.g. deleted by admin)
            if (localExisting) {
              deleteDossierByUserId(currentUser.id);
              setDossier(null);
              setForm(getInitialForm(currentUser));
              setCurrentStep(1);
              setShowResetBanner(true);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote dossier:', err);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [currentUser.id]);

  // Auto-save draft on form change (debounced)
  useEffect(() => {
    if (dossier?.statut === 'soumis') return;

    const timer = setTimeout(async () => {
      // Save locally
      const updated = createOrUpdateDraft(currentUser.id, form);
      setDossier(updated);

      // Sync to backend API
      try {
        const remoteUpdated = await apiSaveDraft(form);
        setDossier(remoteUpdated);
      } catch (err) {
        console.warn('Backend draft save failed, kept local:', err);
      }

      const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeStr);
      setShowSavedNotification(true);
      setTimeout(() => setShowSavedNotification(false), 2500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [form, currentUser.id, dossier?.statut]);

  const handleManualSave = async () => {
    const updated = createOrUpdateDraft(currentUser.id, form);
    setDossier(updated);

    try {
      const remoteUpdated = await apiSaveDraft(form);
      setDossier(remoteUpdated);
    } catch (err) {
      console.warn('Backend manual save failed:', err);
    }

    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const handleFieldChange = (field: keyof CandidatureForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Budget Items handlers
  const handleAddBudgetItem = () => {
    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      designation: '',
      quantite: 1,
      coutUnitaire: 0
    };
    setForm(prev => ({ ...prev, budgetItems: [...prev.budgetItems, newItem] }));
  };

  const handleUpdateBudgetItem = (id: string, field: keyof BudgetItem, value: any) => {
    setForm(prev => ({
      ...prev,
      budgetItems: prev.budgetItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveBudgetItem = (id: string) => {
    if (form.budgetItems.length <= 1) return;
    setForm(prev => ({
      ...prev,
      budgetItems: prev.budgetItems.filter(item => item.id !== id)
    }));
  };

  const totalBudget = form.budgetItems.reduce((acc, item) => acc + (Number(item.quantite || 0) * Number(item.coutUnitaire || 0)), 0);

  const handleFinalSubmit = async () => {
    if (!form.engagementHonneur) {
      alert('Veuillez cocher la déclaration d\'engagement sur l\'honneur pour poursuivre.');
      return;
    }

    // 1. Submit locally for immediate feedback
    const localSubmitted = submitDossier(currentUser.id, form);
    setDossier(localSubmitted);

    // 2. Submit to server API so admin receives it immediately
    try {
      const remoteSubmitted = await apiSubmitDossier(form);
      setDossier(remoteSubmitted);
    } catch (err: any) {
      console.warn('Backend submission failed, maintained local submission:', err);
    }

    setShowSubmitModal(false);
  };

  // Step names
  const STEPS = [
    { num: 1, label: 'Identification' },
    { num: 2, label: 'Description' },
    { num: 3, label: 'Méthodologie' },
    { num: 4, label: 'Budget' },
    { num: 5, label: 'Relecture & Validation' }
  ];

  // If dossier is already submitted, display submitted confirmation view with PDF download option
  if (dossier?.statut === 'soumis') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6">
        
        {/* Success Header Box */}
        <div className="bg-[#0f5132] text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-700 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-100 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-emerald-600">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Dossier de Candidature Transmis avec Succès</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Dossier N° <span className="text-amber-300">{dossier.id}</span>
              </h2>
              <p className="text-sm text-emerald-100 max-w-xl leading-relaxed font-medium">
                Félicitations {currentUser.prenom} ! Votre dossier a été enregistré pour l'accompagnement technique et logistique des mini-activités du 3ᵉ Camp National des Jeunes sur les Droits Humains 2026.
              </p>
            </div>

            <div className="bg-emerald-900/90 rounded-xl p-4 border border-emerald-600/60 text-center w-full md:w-auto min-w-[220px]">
              <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider mb-1">Date de soumission</p>
              <p className="text-sm font-extrabold text-white">
                {dossier.dateSoumission ? new Date(dossier.dateSoumission).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : 'Soumis'}
              </p>
              <button
                onClick={() => generateSingleDossierPdf(dossier)}
                className="mt-3 w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger mon PDF</span>
              </button>
            </div>

          </div>
        </div>

        {/* Read-only dossier recap */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
            <h3 className="font-extrabold text-lg sm:text-xl text-[#1F4E79] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-500" />
              <span>Récapitulatif Officiel de votre Candidature</span>
            </h3>
            <span className="bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full uppercase self-start sm:self-auto">
              Verrouillé après soumission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block uppercase text-xs">Candidat-e</span>
              <p className="text-slate-900 font-extrabold text-base">{dossier.form.nom} {dossier.form.prenom}</p>
              <p className="text-slate-700 font-medium">{dossier.form.email} | {dossier.form.telephone}</p>
              <p className="text-slate-700 font-medium">Département : <strong>{dossier.form.departement}</strong> ({dossier.form.commune})</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block uppercase text-xs">Domaine & Budget</span>
              <p className="text-[#1F4E79] font-bold text-sm">{dossier.form.domaine}</p>
              <p className="text-slate-900 font-extrabold text-base text-[#7A0C10] pt-1">
                Total Budget : {totalBudget.toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          </div>

          <div className="space-y-5 text-sm">
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase text-[#1F4E79] mb-1.5">Titre de la Mini-Activité</h4>
              <p className="p-3.5 bg-[#EBF3FB] rounded-xl text-slate-900 font-semibold border border-blue-100">{dossier.form.titreProjet}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase text-[#1F4E79] mb-1.5">Problématique</h4>
              <p className="p-3.5 bg-slate-50 rounded-xl text-slate-800 whitespace-pre-line leading-relaxed border border-slate-200 font-medium">{dossier.form.problematique}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase text-[#1F4E79] mb-1.5">Objectif Général</h4>
                <p className="p-3.5 bg-slate-50 rounded-xl text-slate-800 leading-relaxed border border-slate-200 font-medium">{dossier.form.objectifGeneral}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase text-[#1F4E79] mb-1.5">Résultats Attendus</h4>
                <p className="p-3.5 bg-slate-50 rounded-xl text-slate-800 leading-relaxed border border-slate-200 font-medium">{dossier.form.resultatsAttendus}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase text-[#1F4E79] mb-1.5">Contribution Vision Bénin 2060</h4>
              <p className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 leading-relaxed font-medium">{dossier.form.lienVision2060}</p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => generateSingleDossierPdf(dossier)}
              className="px-6 py-3.5 bg-[#1F4E79] hover:bg-[#163858] text-white font-extrabold rounded-xl shadow transition-colors inline-flex items-center gap-2 text-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Générer et Télécharger le Dossier PDF Complet</span>
            </button>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Admin Reset Banner */}
      {showResetBanner && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm text-amber-950">
          <CheckCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-extrabold text-amber-900 text-sm sm:text-base">
              Votre candidature précédente a été réinitialisée par l'administration
            </h4>
            <p className="text-amber-800 font-medium">
              L'administration a supprimé votre ancien dossier. Vous disposez désormais de la possibilité de remplir et soumettre une toute nouvelle candidature de zéro.
            </p>
          </div>
          <button 
            onClick={() => setShowResetBanner(false)}
            className="ml-auto text-amber-700 hover:text-amber-950 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Title & Save Indicator */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase border border-amber-300">
              Brouillon en cours
            </span>
            <span className="text-xs sm:text-sm text-slate-600 font-semibold">
              {dossier?.id ? `N° Dossier : ${dossier.id}` : ''}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F4E79] mt-2">
            Formulaire de Candidature - Mini-Activité 2026
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showSavedNotification && (
            <span className="text-xs sm:text-sm text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Sauvegardé {lastSavedTime}</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleManualSave}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer border border-slate-300"
          >
            <Save className="w-4 h-4 text-[#1F4E79]" />
            <span>Enregistrer le brouillon</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="bg-[#1F4E79] text-white rounded-2xl p-5 sm:p-6 shadow-md border-b-4 border-[#7A0C10]">
        
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-3 text-blue-100">
          <span>Étape {currentStep} sur 5 : {STEPS[currentStep - 1].label}</span>
          <span className="text-amber-300 font-extrabold">{Math.round((currentStep / 5) * 100)}% complété</span>
        </div>

        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-6">
          <div 
            className="bg-amber-400 h-full transition-all duration-300 rounded-full shadow-sm"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>

        {/* Step Circles */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
          {STEPS.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`flex flex-col items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                currentStep === s.num
                  ? 'text-amber-300 font-bold'
                  : currentStep > s.num
                  ? 'text-blue-100 font-semibold'
                  : 'text-blue-300/70 font-medium'
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm transition-all ${
                  currentStep === s.num
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow'
                    : currentStep > s.num
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white/20 text-white'
                }`}
              >
                {currentStep > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="hidden sm:inline text-xs leading-tight">{s.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Form Content Steps */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
        
        {/* ÉTAPE 1: IDENTIFICATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3.5">
              <h3 className="text-base sm:text-lg font-extrabold text-[#1F4E79] flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#EBF3FB] text-[#1F4E79] font-black text-xs sm:text-sm flex items-center justify-center border border-blue-200">1</span>
                <span>Identification du/de la Candidat-e & Domaine</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Vos coordonnées de contact et le domaine d'action retenu.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Nom de famille <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => handleFieldChange('nom', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Prénom <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  value={form.prenom}
                  onChange={(e) => handleFieldChange('prenom', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Adresse E-mail <span className="text-rose-600">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Téléphone (WhatsApp souhaité) <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  value={form.telephone}
                  onChange={(e) => handleFieldChange('telephone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Département de résidence <span className="text-rose-600">*</span></label>
                <select
                  value={form.departement}
                  onChange={(e) => handleFieldChange('departement', e.target.value as DepartementBenin)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                >
                  {DEPARTEMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Commune / Localité d'intervention <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  placeholder="ex: Parakou, Natitingou, Cotonou, Abomey..."
                  value={form.commune}
                  onChange={(e) => handleFieldChange('commune', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-900 text-xs sm:text-sm mb-2.5">Domaine d'intervention de la Mini-Activité <span className="text-rose-600">*</span></label>
              <div className="space-y-2.5">
                {DOMAINES.map((d) => (
                  <label
                    key={d}
                    className={`flex items-center p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      form.domaine === d
                        ? 'border-[#1F4E79] bg-[#EBF3FB] font-extrabold text-[#1F4E79] shadow-xs'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="domaine"
                      checked={form.domaine === d}
                      onChange={() => handleFieldChange('domaine', d)}
                      className="mr-3 text-[#1F4E79] focus:ring-[#1F4E79] w-4 h-4"
                    />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2: DESCRIPTION DU PROJET */}
        {currentStep === 2 && (
          <div className="space-y-5 text-xs sm:text-sm">
            <div className="border-b border-slate-200 pb-3.5">
              <h3 className="text-base sm:text-lg font-extrabold text-[#1F4E79] flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#EBF3FB] text-[#1F4E79] font-black text-xs sm:text-sm flex items-center justify-center border border-blue-200">2</span>
                <span>Description détaillée de la Mini-Activité</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Présentez le titre, la problématique ciblée et vos objectifs.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Titre clair et concis de la mini-activité <span className="text-rose-600">*</span></label>
              <input
                type="text"
                placeholder="ex: Caravane de sensibilisation sur le droit à l'éducation inclusive dans les marchés de Parakou"
                value={form.titreProjet}
                onChange={(e) => handleFieldChange('titreProjet', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Problématique identifiée dans la communauté <span className="text-rose-600">*</span></label>
              <textarea
                rows={3}
                placeholder="Décrivez la situation d'atteinte aux droits humains ou le manque constaté dans votre localité..."
                value={form.problematique}
                onChange={(e) => handleFieldChange('problematique', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Objectif général <span className="text-rose-600">*</span></label>
                <textarea
                  rows={3}
                  placeholder="Quel est l'impact majeur recherché par votre mini-activité ?"
                  value={form.objectifGeneral}
                  onChange={(e) => handleFieldChange('objectifGeneral', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Objectifs spécifiques (puces) <span className="text-rose-600">*</span></label>
                <textarea
                  rows={3}
                  placeholder="- Objectif 1&#10;- Objectif 2&#10;- Objectif 3"
                  value={form.objectifsSpecifiques}
                  onChange={(e) => handleFieldChange('objectifsSpecifiques', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Résultats attendus <span className="text-rose-600">*</span></label>
              <textarea
                rows={2}
                placeholder="Exemples : 50 personnes sensibilisées, 20 fiches SDR remplies, un plaidoyer déposé en mairie..."
                value={form.resultatsAttendus}
                onChange={(e) => handleFieldChange('resultatsAttendus', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Bénéficiaires direct-e-s <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  placeholder="ex: 30 jeunes femmes apprenties de l'arrondissement"
                  value={form.beneficiairesDirects}
                  onChange={(e) => handleFieldChange('beneficiairesDirects', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Bénéficiaires indirect-e-s <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  placeholder="ex: Les usagers du marché et les familles des apprenties"
                  value={form.beneficiairesIndirects}
                  onChange={(e) => handleFieldChange('beneficiairesIndirects', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Zone exacte d'intervention (Quartier, Arrondissement) <span className="text-rose-600">*</span></label>
              <input
                type="text"
                placeholder="ex: Quartier Zongo, 2e Arrondissement de Parakou"
                value={form.zoneIntervention}
                onChange={(e) => handleFieldChange('zoneIntervention', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 3: MÉTHODOLOGIE & VISION 2060 */}
        {currentStep === 3 && (
          <div className="space-y-5 text-xs sm:text-sm">
            <div className="border-b border-slate-200 pb-3.5">
              <h3 className="text-base sm:text-lg font-extrabold text-[#1F4E79] flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#EBF3FB] text-[#1F4E79] font-black text-xs sm:text-sm flex items-center justify-center border border-blue-200">3</span>
                <span>Méthodologie, Chronogramme & Alignement Vision 2060</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Expliquez comment vous organiserez le travail de terrain.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Méthodologie de mise en œuvre <span className="text-rose-600">*</span></label>
              <textarea
                rows={3}
                placeholder="Expliquez la démarche choisie : entretiens, causeries éducatives, ateliers participatifs, collecte par fiches SDR..."
                value={form.methodologie}
                onChange={(e) => handleFieldChange('methodologie', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Chronogramme prévisionnel des activités <span className="text-rose-600">*</span></label>
              <textarea
                rows={3}
                placeholder="Exemple :&#10;- Semaine 1 : Préparation et prises de contact institutionnelles&#10;- Semaine 2 : Phase de terrain / sensibilisation&#10;- Semaine 3 : Rédaction du rapport d'activités"
                value={form.chronogramme}
                onChange={(e) => handleFieldChange('chronogramme', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
              />
            </div>

            <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5">
              <label className="block font-extrabold text-amber-950 text-xs sm:text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Contribution directe à la Vision Bénin 2060 (Loi n°2025-16) <span className="text-rose-600">*</span></span>
              </label>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                Le 4 juillet 2025, la Loi n°2025-16 a acté la Vision Bénin 2060 <em>« Alafia, un monde de splendeurs »</em> (4 piliers: Paix, Bonne gouvernance, Prospérité, Rayonnement; 5e axe: État de droit & gouvernance éthique). Expliquez comment votre mini-activité s'articule avec ces orientations et le <strong>Cadre AAAQ du Comité DESC de l'ONU</strong> (Disponibilité, Accessibilité, Acceptabilité, Qualité).
              </p>
              <textarea
                rows={3}
                placeholder="Précisez la contribution aux piliers de la Vision 2060 et aux critères AAAQ du Comité DESC de l'ONU..."
                value={form.lienVision2060}
                onChange={(e) => handleFieldChange('lienVision2060', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none shadow-xs"
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 4: BUDGET INDICATIF */}
        {currentStep === 4 && (
          <div className="space-y-5 text-xs sm:text-sm">
            <div className="border-b border-slate-200 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#1F4E79] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#EBF3FB] text-[#1F4E79] font-black text-xs sm:text-sm flex items-center justify-center border border-blue-200">4</span>
                  <span>Budget Prévisionnel Indicatif</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Détaillez les postes de dépense indispensables pour votre mini-activité.</p>
              </div>

              <button
                type="button"
                onClick={handleAddBudgetItem}
                className="px-4 py-2 bg-[#1F4E79] hover:bg-[#163858] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une ligne</span>
              </button>
            </div>

            {/* Budget Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#1F4E79] text-white text-xs uppercase font-extrabold">
                    <th className="p-3">Désignation / Poste</th>
                    <th className="p-3 w-28 text-center">Quantité</th>
                    <th className="p-3 w-36 text-right">Coût Unit (FCFA)</th>
                    <th className="p-3 w-36 text-right">Total (FCFA)</th>
                    <th className="p-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {form.budgetItems.map((item) => {
                    const lineTotal = Number(item.quantite || 0) * Number(item.coutUnitaire || 0);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5">
                          <input
                            type="text"
                            placeholder="ex: Fiches d'enquête, transport, pause café..."
                            value={item.designation}
                            onChange={(e) => handleUpdateBudgetItem(item.id, 'designation', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium focus:border-[#1F4E79] focus:outline-none"
                          />
                        </td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantite}
                            onChange={(e) => handleUpdateBudgetItem(item.id, 'quantite', parseInt(e.target.value) || 0)}
                            className="w-full text-center px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold focus:border-[#1F4E79] focus:outline-none"
                          />
                        </td>
                        <td className="p-2.5 text-right">
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={item.coutUnitaire}
                            onChange={(e) => handleUpdateBudgetItem(item.id, 'coutUnitaire', parseInt(e.target.value) || 0)}
                            className="w-full text-right px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold focus:border-[#1F4E79] focus:outline-none"
                          />
                        </td>
                        <td className="p-2.5 text-right font-extrabold text-slate-900 text-sm">
                          {lineTotal.toLocaleString('fr-FR')}
                        </td>
                        <td className="p-2.5 text-center">
                          {form.budgetItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBudgetItem(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                              title="Supprimer la ligne"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Display */}
            <div className="bg-[#EBF3FB] p-4 sm:p-5 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-extrabold text-[#1F4E79] text-sm sm:text-base">MONTANT TOTAL DU BUDGET PROPOSÉ :</span>
              <span className="text-xl sm:text-2xl font-black text-[#7A0C10]">
                {totalBudget.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>
        )}

        {/* ÉTAPE 5: RELECTURE ET VALIDATION */}
        {currentStep === 5 && (
          <div className="space-y-6 text-xs sm:text-sm">
            <div className="border-b border-slate-200 pb-3.5">
              <h3 className="text-base sm:text-lg font-extrabold text-[#1F4E79] flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#EBF3FB] text-[#1F4E79] font-black text-xs sm:text-sm flex items-center justify-center border border-blue-200">5</span>
                <span>Relecture complète & Engagement sur l'Honneur</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Vérifiez toutes les informations avant la soumission définitive.</p>
            </div>

            {/* Récapitulatif complet & éditable */}
            <div className="space-y-5">
              {/* 1. Identification */}
              <section className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-[#1F4E79] text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F4E79] text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  Identification du/de la candidat-e
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom</label>
                    <input type="text" value={form.nom} onChange={(e) => handleFieldChange('nom', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Prénom</label>
                    <input type="text" value={form.prenom} onChange={(e) => handleFieldChange('prenom', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                    <input type="email" value={form.email} onChange={(e) => handleFieldChange('email', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone</label>
                    <input type="text" value={form.telephone} onChange={(e) => handleFieldChange('telephone', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Département</label>
                    <select value={form.departement} onChange={(e) => handleFieldChange('departement', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none">
                      {DEPARTEMENTS.map(d => (<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Commune / Localité</label>
                    <input type="text" value={form.commune} onChange={(e) => handleFieldChange('commune', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Domaine d'intervention</label>
                  <select value={form.domaine} onChange={(e) => handleFieldChange('domaine', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none">
                    {DOMAINES.map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
              </section>

              {/* 2. Description */}
              <section className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-[#1F4E79] text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F4E79] text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  Description de la mini-activité
                </h4>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Titre du projet</label>
                  <input type="text" value={form.titreProjet} onChange={(e) => handleFieldChange('titreProjet', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Problématique identifiée</label>
                  <textarea rows={3} value={form.problematique} onChange={(e) => handleFieldChange('problematique', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Objectif général</label>
                    <textarea rows={3} value={form.objectifGeneral} onChange={(e) => handleFieldChange('objectifGeneral', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Objectifs spécifiques</label>
                    <textarea rows={3} value={form.objectifsSpecifiques} onChange={(e) => handleFieldChange('objectifsSpecifiques', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Résultats attendus</label>
                  <textarea rows={2} value={form.resultatsAttendus} onChange={(e) => handleFieldChange('resultatsAttendus', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bénéficiaires direct-e-s</label>
                    <input type="text" value={form.beneficiairesDirects} onChange={(e) => handleFieldChange('beneficiairesDirects', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bénéficiaires indirect-e-s</label>
                    <input type="text" value={form.beneficiairesIndirects} onChange={(e) => handleFieldChange('beneficiairesIndirects', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Zone d'intervention</label>
                  <input type="text" value={form.zoneIntervention} onChange={(e) => handleFieldChange('zoneIntervention', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                </div>
              </section>

              {/* 3. Méthodologie & Vision 2060 */}
              <section className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-[#1F4E79] text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F4E79] text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                  Méthodologie & Vision Bénin 2060
                </h4>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Méthodologie de mise en œuvre</label>
                  <textarea rows={3} value={form.methodologie} onChange={(e) => handleFieldChange('methodologie', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chronogramme prévisionnel</label>
                  <textarea rows={3} value={form.chronogramme} onChange={(e) => handleFieldChange('chronogramme', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contribution à la Vision Bénin 2060</label>
                  <textarea rows={3} value={form.lienVision2060} onChange={(e) => handleFieldChange('lienVision2060', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#1F4E79] focus:outline-none" />
                </div>
              </section>

              {/* 4. Budget */}
              <section className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-extrabold text-[#1F4E79] text-sm sm:text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1F4E79] text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                    Budget prévisionnel
                  </h4>
                  <button type="button" onClick={handleAddBudgetItem} className="px-3 py-1.5 bg-[#1F4E79] hover:bg-[#163858] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-[#1F4E79] text-white text-xs uppercase font-extrabold">
                        <th className="p-2.5">Désignation</th>
                        <th className="p-2.5 w-24 text-center">Qté</th>
                        <th className="p-2.5 w-32 text-right">Coût Unit</th>
                        <th className="p-2.5 w-32 text-right">Total</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                      {form.budgetItems.map((item) => {
                        const lineTotal = Number(item.quantite || 0) * Number(item.coutUnitaire || 0);
                        return (
                          <tr key={item.id}>
                            <td className="p-2"><input type="text" value={item.designation} onChange={(e) => handleUpdateBudgetItem(item.id, 'designation', e.target.value)} className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium focus:border-[#1F4E79] focus:outline-none" /></td>
                            <td className="p-2 text-center"><input type="number" min="1" value={item.quantite} onChange={(e) => handleUpdateBudgetItem(item.id, 'quantite', parseInt(e.target.value) || 0)} className="w-full text-center px-2 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold focus:border-[#1F4E79] focus:outline-none" /></td>
                            <td className="p-2 text-right"><input type="number" min="0" step="500" value={item.coutUnitaire} onChange={(e) => handleUpdateBudgetItem(item.id, 'coutUnitaire', parseInt(e.target.value) || 0)} className="w-full text-right px-2 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold focus:border-[#1F4E79] focus:outline-none" /></td>
                            <td className="p-2 text-right font-extrabold text-slate-900">{lineTotal.toLocaleString('fr-FR')}</td>
                            <td className="p-2 text-center">{form.budgetItems.length > 1 && (<button type="button" onClick={() => handleRemoveBudgetItem(item.id)} className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer" title="Supprimer"><Trash2 className="w-4 h-4" /></button>)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-extrabold text-xs sm:text-sm uppercase">Budget Total Calculé</span>
                  <p className="font-black text-[#7A0C10] text-lg sm:text-xl">{totalBudget.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </section>
            </div>

            {/* Declaration Checkbox */}
            <div className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-xl space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.engagementHonneur}
                  onChange={(e) => handleFieldChange('engagementHonneur', e.target.checked)}
                  className="mt-1 text-[#1F4E79] rounded focus:ring-[#1F4E79] w-5 h-5 cursor-pointer shrink-0"
                />
                <span className="text-slate-900 leading-relaxed font-semibold text-xs sm:text-sm">
                  <strong>Engagement sur l'honneur :</strong> Je certifie que les informations renseignées dans ce dossier sont exactes et sincères. Je m'engage à mener à bien la mini-activité pour laquelle je sollicite un accompagnement technique et logistique.
                </span>
              </label>
            </div>

            {/* Action submit button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!form.engagementHonneur}
                onClick={() => setShowSubmitModal(true)}
                className={`w-full py-4 rounded-xl font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                  form.engagementHonneur
                    ? 'bg-[#7A0C10] hover:bg-[#5e090c] text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                <FileCheck2 className="w-5 h-5 text-amber-300" />
                <span>Soumettre définitivement mon dossier</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer border border-slate-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Étape précédente</span>
          </button>

          {currentStep < 5 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
              className="px-6 py-2.5 bg-[#1F4E79] hover:bg-[#163858] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Étape suivante</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-[#7A0C10]">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">Confirmer la transmission définitive ?</h3>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Une fois votre dossier soumis, vous ne pourrez plus le modifier. Un numéro de dossier officiel vous sera attribué immédiatement.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-300"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 rounded-xl bg-[#7A0C10] hover:bg-[#5e090c] text-white text-xs sm:text-sm font-extrabold shadow transition-colors cursor-pointer"
              >
                Oui, soumettre mon dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
