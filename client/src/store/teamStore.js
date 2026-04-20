import { create } from 'zustand';
import api from '../services/api';

const useTeamStore = create((set) => ({
  team: null,
  loading: false,
  error: null,

  createTeam: async (teamData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/teams', teamData);
      set({ team: data.team, loading: false });
      return { success: true, team: data.team };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create team';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  joinTeam: async (inviteCode) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/teams/join', { inviteCode });
      set({ team: data.team, loading: false });
      return { success: true, team: data.team };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to join team';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  fetchTeam: async (teamId) => {
    if (!teamId) return;
    set({ loading: true });
    try {
      const { data } = await api.get(`/teams/${teamId}`);
      set({ team: data.team, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  }
}));

export default useTeamStore;
