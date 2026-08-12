import { CandidatureForm, DossierCandidature, UserAccount } from '../types';

const TOKEN_KEY = 'csb_auth_token';
const ADMIN_TOKEN_KEY = 'csb_admin_token';
const USER_KEY = 'csb_current_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredToken(token: string, isAdmin = false): void {
  if (isAdmin) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): UserAccount | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

// --- Candidate API Calls ---
export async function apiRegisterCandidate(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  departement: string;
  password?: string;
}): Promise<{ token: string; user: UserAccount }> {
  const res = await fetch('/api/auth/register-candidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'inscription' }));
    throw new Error(err.error || 'Erreur lors de l\'inscription');
  }
  const result = await res.json();
  setStoredToken(result.token, false);
  setStoredUser(result.user);
  return result;
}

export async function apiLoginCandidate(data: {
  email: string;
  password?: string;
}): Promise<{ token: string; user: UserAccount }> {
  const res = await fetch('/api/auth/login-candidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur de connexion' }));
    throw new Error(err.error || 'Erreur de connexion');
  }
  const result = await res.json();
  setStoredToken(result.token, false);
  setStoredUser(result.user);
  return result;
}

// --- Admin API Calls ---
export async function apiRegisterAdmin(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  departement?: string;
  password: string;
  inviteCode: string;
}): Promise<{ token: string; user: UserAccount }> {
  const res = await fetch('/api/auth/register-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur d\'inscription administrateur' }));
    throw new Error(err.error || 'Erreur d\'inscription administrateur');
  }
  const result = await res.json();
  setStoredToken(result.token, true);
  setStoredUser(result.user);
  return result;
}

export async function apiLoginAdmin(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: UserAccount }> {
  const res = await fetch('/api/auth/login-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Identifiant ou mot de passe administrateur incorrect' }));
    throw new Error(err.error || 'Identifiant ou mot de passe administrateur incorrect');
  }
  const result = await res.json();
  setStoredToken(result.token, true);
  setStoredUser(result.user);
  return result;
}

// --- Dossier API Calls ---
export async function apiGetMyDossier(): Promise<DossierCandidature | null> {
  const token = getStoredToken();
  if (!token) return null;
  const res = await fetch('/api/candidature/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.dossier;
}

export async function apiSaveDraft(form: CandidatureForm): Promise<DossierCandidature> {
  const token = getStoredToken();
  if (!token) throw new Error('Authentification requise');
  const res = await fetch('/api/candidature/save-draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ form })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur de sauvegarde' }));
    throw new Error(err.error || 'Erreur de sauvegarde');
  }
  const data = await res.json();
  return data.dossier;
}

export async function apiSubmitDossier(form: CandidatureForm): Promise<DossierCandidature> {
  const token = getStoredToken();
  if (!token) throw new Error('Authentification requise');
  const res = await fetch('/api/candidature/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ form })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur de soumission' }));
    throw new Error(err.error || 'Erreur de soumission');
  }
  const data = await res.json();
  return data.dossier;
}

// --- Admin Protected Dossier Management ---
export async function apiGetAdminDossiers(): Promise<DossierCandidature[]> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || getStoredToken();
  if (!token) {
    throw new Error('Authentification administrateur requise');
  }
  const res = await fetch('/api/admin/dossiers', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Accès refusé. Privilèges administrateur requis.');
    }
    throw new Error('Erreur lors du chargement des dossiers');
  }
  const data = await res.json();
  return data.dossiers || [];
}

export async function apiDeleteAdminDossier(id: string): Promise<void> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || getStoredToken();
  if (!token) throw new Error('Authentification administrateur requise');
  const res = await fetch(`/api/admin/dossiers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur lors de la suppression du dossier' }));
    throw new Error(err.error || 'Erreur lors de la suppression du dossier');
  }
}

export async function apiResetAdminDossiers(): Promise<void> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || getStoredToken();
  if (!token) throw new Error('Authentification administrateur requise');
  const res = await fetch('/api/admin/reset', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la réinitialisation');
  }
}
