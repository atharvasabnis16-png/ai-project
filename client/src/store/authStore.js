import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ 
        token: data.token, 
        user: data.user, 
        isAuthenticated: true, 
        loading: false 
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', data.token);
      set({ 
        token: data.token, 
        user: data.user, 
        isAuthenticated: true, 
        loading: false 
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    if (!localStorage.getItem('token')) return;
    set({ loading: true });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, isAuthenticated: true, loading: false });
    } catch (err) {
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  updateProfile: async (skills) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.put('/auth/profile', { skills });
      set({ user: data.user, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  }
}));

export default useAuthStore;
