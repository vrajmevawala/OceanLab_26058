'use client';

export const auth = {
  login: async () => {
    throw new Error('Use Clerk authentication flow. Mock login is disabled.');
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  },
};
