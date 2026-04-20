import { create } from 'zustand';
import api from '../services/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/tasks');
      set({ tasks: data.tasks, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      set({ tasks: [data.task, ...get().tasks] });
      return { success: true, task: data.task };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, updates);
      set({
        tasks: get().tasks.map(t => t._id === taskId ? data.task : t)
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      set({
        tasks: get().tasks.filter(t => t._id !== taskId)
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  aiAssignTask: async (taskId) => {
    try {
      const { data } = await api.post('/tasks/ai-assign', { taskId });
      set({
        tasks: get().tasks.map(t => t._id === taskId ? data.task : t)
      });
      return { success: true, assignment: data.assignment };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  aiSuggestTasks: async () => {
    set({ loading: true });
    try {
      const { data } = await api.post('/tasks/ai-suggest');
      set({ loading: false });
      return { success: true, suggestions: data.tasks };
    } catch (err) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message };
    }
  }
}));

export default useTaskStore;
