import React, { useState, useEffect, useCallback } from 'react';
import { UserAccount } from './types';
import { getStoredUser, setStoredUser, clearStoredTokens } from './utils/api';
import { initializeStorage } from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PublicCallPage } from './components/PublicCallPage';
import { CandidatePortal } from './components/CandidatePortal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'public' | 'candidate' | 'admin'>('public');
  const [currentUser, setCurrentUserAccount] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // URL Path & Hash Parser
  const resolveRouteFromUrl = useCallback((): 'public' | 'candidate' | 'admin' => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (pathname.includes('/admin') || hash.includes('admin')) {
      return 'admin';
    }
    if (pathname.includes('/candidat') || hash.includes('candidat') || hash.includes('candidate')) {
      return 'candidate';
    }
    return 'public';
  }, []);

  // Update URL pathname & hash when tab changes
  const handleTabChange = useCallback((tab: 'public' | 'candidate' | 'admin') => {
    setActiveTab(tab);
    if (tab === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (tab === 'candidate') {
      window.history.pushState(null, '', '/candidat');
    } else {
      window.history.pushState(null, '', '/');
    }
  }, []);

  useEffect(() => {
    initializeStorage();

    // Check stored user session
    const stored = getStoredUser();
    if (stored) {
      setCurrentUserAccount(stored);
    }

    // Initial Route check from URL
    const initialRoute = resolveRouteFromUrl();
    setActiveTab(initialRoute);

    // Listen to browser forward/back buttons and hash changes
    const onLocationChange = () => {
      const route = resolveRouteFromUrl();
      setActiveTab(route);
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, [resolveRouteFromUrl]);

  const handleLogout = () => {
    clearStoredTokens();
    setStoredUser(null);
    setCurrentUserAccount(null);
    handleTabChange('public');
  };

  const handleCandidateAuthSuccess = (user: UserAccount) => {
    setStoredUser(user);
    setCurrentUserAccount(user);
    if (user.role === 'admin') {
      handleTabChange('admin');
    } else {
      handleTabChange('candidate');
    }
  };

  const handleAdminLoginSuccess = (adminUser: UserAccount) => {
    setStoredUser(adminUser);
    setCurrentUserAccount(adminUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-[#1F4E79] selection:text-white">
      
      {/* Header Bar: Only shows public navigation links (no admin button on public site) */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* PUBLIC PRESENTATION ROUTE (/) */}
        {activeTab === 'public' && (
          <PublicCallPage
            onStartApplication={() => {
              if (currentUser) {
                handleTabChange('candidate');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
          />
        )}

        {/* CANDIDATE SPACE ROUTE (/candidat) */}
        {activeTab === 'candidate' && (
          currentUser ? (
            <CandidatePortal currentUser={currentUser} />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1F4E79] text-white flex items-center justify-center mx-auto text-xl font-extrabold shadow-md border border-white/20">
                CSB
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-xl text-slate-900">Accès Espace Candidat-e</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Connectez-vous ou créez votre compte pour commencer la rédaction de votre proposition de mini-activité.
                </p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-3.5 px-4 bg-[#1F4E79] hover:bg-[#163858] text-white font-extrabold rounded-xl shadow-md transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Se connecter / Créer mon compte</span>
              </button>
            </div>
          )
        )}

        {/* PRIVATE ADMIN ROUTE (/admin) */}
        {activeTab === 'admin' && (
          <AdminPortal
            isAdminLoggedIn={currentUser?.role === 'admin'}
            onAdminLoginSuccess={handleAdminLoginSuccess}
            onNavigatePublic={() => handleTabChange('public')}
            onAdminLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateAdmin={() => handleTabChange('admin')} />

      {/* Auth Modal for Candidates */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleCandidateAuthSuccess}
      />

    </div>
  );
}
