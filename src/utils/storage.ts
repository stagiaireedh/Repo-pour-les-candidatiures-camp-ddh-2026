import { CandidatureForm, DossierCandidature, UserAccount } from '../types';
import { DEMO_DOSSIERS, DEMO_USERS } from '../data/demoData';

const STORAGE_USERS_KEY = 'csb_camp2026_users';
const STORAGE_DOSSIERS_KEY = 'csb_camp2026_dossiers';
const STORAGE_CURRENT_USER_KEY = 'csb_camp2026_current_user';

export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_USERS_KEY)) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEMO_USERS));
  }
  if (!localStorage.getItem(STORAGE_DOSSIERS_KEY)) {
    localStorage.setItem(STORAGE_DOSSIERS_KEY, JSON.stringify(DEMO_DOSSIERS));
  }
}

export function getAllUsers(): UserAccount[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_USERS_KEY);
  return raw ? JSON.parse(raw) : DEMO_USERS;
}

export function getAllDossiers(): DossierCandidature[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_DOSSIERS_KEY);
  return raw ? JSON.parse(raw) : DEMO_DOSSIERS;
}

export function getCurrentUser(): UserAccount | null {
  const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  }
}

export function registerCandidate(account: Omit<UserAccount, 'id' | 'role'>): UserAccount {
  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === account.email.toLowerCase());
  if (existing) {
    return existing;
  }
  const newAccount: UserAccount = {
    ...account,
    id: `user-${Date.now()}`,
    role: 'candidat'
  };
  users.push(newAccount);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  return newAccount;
}

export function getDossierByUserId(userId: string): DossierCandidature | null {
  const dossiers = getAllDossiers();
  return dossiers.find(d => d.userId === userId) || null;
}

export function createOrUpdateDraft(userId: string, form: CandidatureForm): DossierCandidature {
  const dossiers = getAllDossiers();
  const now = new Date().toISOString();
  let dossier = dossiers.find(d => d.userId === userId);

  if (dossier) {
    if (dossier.statut === 'soumis') {
      // Cannot edit submitted dossier
      return dossier;
    }
    dossier.form = form;
    dossier.dateDerniereModif = now;
  } else {
    // Generate new dossier ID
    const count = dossiers.length + 1;
    const formattedCount = String(count).padStart(3, '0');
    dossier = {
      id: `CSB-2026-N${formattedCount}`,
      userId,
      statut: 'brouillon',
      form,
      dateCreation: now,
      dateDerniereModif: now
    };
    dossiers.push(dossier);
  }

  localStorage.setItem(STORAGE_DOSSIERS_KEY, JSON.stringify(dossiers));
  return dossier;
}

export function submitDossier(userId: string, form: CandidatureForm): DossierCandidature {
  const dossiers = getAllDossiers();
  const now = new Date().toISOString();
  let dossier = dossiers.find(d => d.userId === userId);

  if (!dossier) {
    const count = dossiers.length + 1;
    const formattedCount = String(count).padStart(3, '0');
    dossier = {
      id: `CSB-2026-N${formattedCount}`,
      userId,
      statut: 'soumis',
      form,
      dateCreation: now,
      dateDerniereModif: now,
      dateSoumission: now
    };
    dossiers.push(dossier);
  } else {
    dossier.form = form;
    dossier.statut = 'soumis';
    dossier.dateDerniereModif = now;
    dossier.dateSoumission = now;
  }

  localStorage.setItem(STORAGE_DOSSIERS_KEY, JSON.stringify(dossiers));
  return dossier;
}

export function deleteDossier(id: string): void {
  const dossiers = getAllDossiers();
  const filtered = dossiers.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_DOSSIERS_KEY, JSON.stringify(filtered));
}

export function deleteDossierByUserId(userId: string): void {
  const dossiers = getAllDossiers();
  const filtered = dossiers.filter(d => d.userId !== userId);
  localStorage.setItem(STORAGE_DOSSIERS_KEY, JSON.stringify(filtered));
}

export function resetDemoData(): void {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEMO_USERS));
  localStorage.setItem(STORAGE_DOSSIERS_KEY, JSON.stringify(DEMO_DOSSIERS));
}
