import { create } from 'zustand';

function getSafeUser() {
  try {
    const raw = localStorage.getItem('ludo_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    localStorage.removeItem('ludo_user');
    return null;
  }
}

export const useAuthStore = create((set) => ({
  user: getSafeUser(),
  token: localStorage.getItem('ludo_token') || null,
  login: (userData, token) => {
    localStorage.setItem('ludo_token', token);
    localStorage.setItem('ludo_user', JSON.stringify(userData));
    set({ user: userData, token });
  },
  logout: () => {
    localStorage.removeItem('ludo_token');
    localStorage.removeItem('ludo_user');
    set({ user: null, token: null });
  }
}));