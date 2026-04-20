import { create } from 'zustand';
import api from '../services/api';

const useWorkspaceStore = create((set, get) => ({
  note: null,
  loading: false,
  aiLoading: false,
  error: null,

  fetchNote: async (teamId) => {
    if (!teamId) return;
    set({ loading: true });
    try {
      const { data } = await api.get(`/workspace/${teamId}`);
      set({ note: data.note, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  updateNote: async (teamId, noteData) => {
    try {
      const { data } = await api.put(`/workspace/${teamId}`, noteData);
      set({ note: data.note });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  summarize: async (content) => {
    set({ aiLoading: true });
    try {
      const { data } = await api.post('/workspace/summarize', { content });
      set({ aiLoading: false });
      return { success: true, summary: data.summary };
    } catch (err) {
      set({ aiLoading: false });
      return { success: false, message: err.response?.data?.message };
    }
  },

  extractActionPoints: async (content) => {
    set({ aiLoading: true });
    try {
      const { data } = await api.post('/workspace/action-points', { content });
      set({ aiLoading: false });
      return { success: true, actionPoints: data.actionPoints };
    } catch (err) {
      set({ aiLoading: false });
      return { success: false, message: err.response?.data?.message };
    }
  },

  clusterIdeas: async (content) => {
    set({ aiLoading: true });
    try {
      const { data } = await api.post('/workspace/cluster', { content });
      set({ aiLoading: false });
      return { success: true, clusters: data.clusters };
    } catch (err) {
      set({ aiLoading: false });
      return { success: false, message: err.response?.data?.message };
    }
  }
}));

export default useWorkspaceStore;
