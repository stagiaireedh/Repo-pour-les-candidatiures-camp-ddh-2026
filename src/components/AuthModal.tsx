import React, { useState } from 'react';
import { UserAccount, DepartementBenin } from '../types';
import { apiRegisterCandidate, apiLoginCandidate } from '../utils/api';
import { X, UserPlus, LogIn, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, Mail, Phone, Lock, User, MapPin } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

const DEPARTEMENTS: DepartementBenin[] = [
  'Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo',
  'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Form states
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [departement, setDepartement] = useState<DepartementBenin>('Littoral');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nom.trim() || !prenom.trim() || !email.trim() || !telephone.trim()) {
      setErrorMsg('Veuillez renseigner tous les champs obligatoires (*).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRegisterCandidate({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        departement,
        password: password || 'candidat2026'
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la création du compte candidat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Veuillez saisir votre adresse e-mail.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiLoginCandidate({
        email: email.trim(),
        password: password || undefined
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = () => {
    setNom('Kpanou');
    setPrenom('Aïchatou');
    setEmail('aichatou.kpanou@camp2026.bj');
    setTelephone('+229 97 44 55 66');
    setDepartement('Ouémé');
    setPassword('candidat2026');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* High-definition, razor-sharp modal container without GPU-blur filters */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-auto">
        
        {/* Top Header Banner */}
        <div className="bg-[#1F4E79] text-white px-6 py-5 border-b-4 border-[#7A0C10] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white tracking-tight leading-snug">
                {mode === 'register' ? 'Créer un Compte Candidat-e' : 'Connexion Candidat-e'}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Camp National Jeunes Droits Humains 2026 • CSB Bénin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Inner Content */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Mode Switch Tabs (Ultra-sharp & High Contrast) */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#1F4E79] shadow-sm font-extrabold border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4 text-amber-500" />
              <span>Créer un compte</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1F4E79] shadow-sm font-extrabold border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4 text-[#1F4E79]" />
              <span>Se connecter</span>
            </button>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl font-medium flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#1F4E79]" />
                    <span>Nom <span className="text-rose-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="ex: KPANOU"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] placeholder:text-slate-400 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#1F4E79]" />
                    <span>Prénom <span className="text-rose-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="ex: Aïchatou"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] placeholder:text-slate-400 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#1F4E79]" />
                  <span>Adresse E-mail <span className="text-rose-600">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aichatou.kpanou@camp2026.bj"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#1F4E79]" />
                    <span>Téléphone (WhatsApp) <span className="text-rose-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+229 97 44 55 66"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] placeholder:text-slate-400 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1F4E79]" />
                    <span>Département <span className="text-rose-600">*</span></span>
                  </label>
                  <select
                    value={departement}
                    onChange={(e) => setDepartement(e.target.value as DepartementBenin)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] shadow-xs"
                  >
                    {DEPARTEMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1F4E79]" />
                  <span>Mot de passe (optionnel)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#1F4E79] hover:bg-[#163858] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 mt-3"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Création de votre compte...' : 'Créer mon compte et démarrer'}</span>
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#1F4E79]" />
                  <span>Adresse E-mail de votre compte <span className="text-rose-600">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@camp2026.bj"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1F4E79]" />
                  <span>Mot de passe</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#1F4E79] hover:bg-[#163858] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 mt-2"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Connexion en cours...' : 'Accéder à mon espace'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Fill Helper Button */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">Pour tester la plateforme :</span>
            <button
              type="button"
              onClick={fillQuickDemo}
              className="text-[#7A0C10] hover:text-[#5e090c] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Remplir exemple candidat-e (Aïchatou)</span>
            </button>
          </div>

        </div>

        {/* Security badge at bottom */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-700 font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#1F4E79]" />
          <span>Plateforme officielle sécurisée • ONG Changement Social Bénin</span>
        </div>

      </div>
    </div>
  );
};
