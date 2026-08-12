import React from 'react';
import { UserAccount } from '../types';
import { User, LogOut, FileText, Lock, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentUser: UserAccount | null;
  activeTab: 'public' | 'candidate' | 'admin';
  setActiveTab: (tab: 'public' | 'candidate' | 'admin') => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAuthModal
}) => {
  return (
    <header className="bg-white text-slate-800 shadow-sm border-t-4 border-[#D9232A] border-b border-slate-200 sticky top-0 z-40">
      {/* Main Header Row: Navigation Tabs & User Controls Only */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Navigation Tabs Styled in Brand Colors (Public View Only) */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('public')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'public'
                ? 'bg-[#0084B4] text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100 hover:text-[#0084B4]'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Présentation de l'Appel</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuthModal();
              } else {
                setActiveTab('candidate');
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'candidate'
                ? 'bg-[#1F4E79] text-white shadow-md'
                : 'bg-amber-100/90 text-amber-950 border border-amber-300/80 hover:bg-amber-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Espace Candidat-e</span>
          </button>

          {currentUser?.role === 'admin' && activeTab === 'admin' && (
            <div className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#D9232A] text-white shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Lock className="w-4 h-4 text-amber-300" />
              <span>Espace Administrateur (Privé)</span>
            </div>
          )}
        </nav>

        {/* User Account Controls */}
        <div className="flex items-center gap-3 border-t md:border-t-0 border-slate-200 pt-2 md:pt-0">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-[#D9232A] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {currentUser.prenom.charAt(0)}{currentUser.nom.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {currentUser.prenom} {currentUser.nom}
                </p>
                <p className="text-xs font-semibold text-slate-600 capitalize">
                  {currentUser.role === 'admin' ? 'Administrateur CSB' : `Candidat-e (${currentUser.departement})`}
                </p>
              </div>
              <button
                onClick={onLogout}
                title="Se déconnecter"
                className="p-1.5 text-slate-500 hover:text-[#D9232A] hover:bg-rose-100/60 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl bg-[#D9232A] text-white font-black text-xs hover:bg-[#b51b21] transition-colors shadow-md flex items-center gap-1.5 border border-white/30"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>Connexion / Inscription</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
