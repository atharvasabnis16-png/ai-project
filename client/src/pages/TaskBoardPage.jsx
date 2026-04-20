import { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/tasks/TaskCard';
import { HiOutlinePlus, HiOutlineSparkles, HiOutlineCollection, HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TaskBoardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', skillRequired: 'coding', deadline: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      toast.error('Failed to sync tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task operational');
      setShowModal(false);
      setNewTask({ title: '', description: '', skillRequired: 'coding', deadline: '' });
      fetchTasks();
    } catch (err) {
      toast.error('Construction failed');
    }
  };

  const handleAiAssign = async (taskId) => {
    toast.loading('AI Analyzing Best-Fit...', { duration: 1500 });
    try {
      await api.post(`/tasks/${taskId}/ai-assign`);
      toast.success('Optimized matching complete');
      fetchTasks();
    } catch (err) {
      toast.error('AI Match Logic Offline');
    }
  };

  const columns = [
    { id: 'todo', name: 'Open Pipeline', color: 'bg-gray-100' },
    { id: 'in-progress', name: 'Active Execution', color: 'bg-indigo-600' },
    { id: 'done', name: 'Verified Data', color: 'bg-green-500' }
  ];

  if (loading) return <div className="text-center py-20 font-black text-gray-400 uppercase tracking-widest animate-pulse">Establishing Pipeline...</div>;

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Project Pipeline</h1>
          <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60 italic">Intelligent Task Board</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="bg-white border border-gray-100 px-4 py-2.5 rounded-2xl flex items-center space-x-3 shadow-sm focus-within:ring-2 ring-indigo-50 transition-all">
                <HiOutlineSearch className="text-gray-300" />
                <input type="text" placeholder="Filter tasks..." className="bg-transparent border-none outline-none text-xs font-bold placeholder-gray-300" />
            </div>
            <button 
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl flex items-center space-x-3 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
            >
                <HiOutlinePlus size={20} />
                <span className="text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-indigo-300">Assemble Task</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.id} className="bg-gray-50/50 rounded-[40px] p-6 border-2 border-dashed border-gray-100 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${col.color}`} />
                    <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest">{col.name}</h3>
                </div>
                <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-400 shadow-sm">
                    {tasks.filter(t => t.status === col.id).length}
                </span>
            </div>

            <div className="space-y-6 flex-1">
              {tasks.filter(t => t.status === col.id).length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <HiOutlineCollection size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Active Nodes</p>
                </div>
              ) : (
                tasks.filter(t => t.status === col.id).map(task => (
                  <TaskCard key={task._id} task={task} onAiAssign={handleAiAssign} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-[#1a1a2e]/40">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative animate-fadeIn">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Assemble New Task</h2>
            <form onSubmit={createTask} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Objective Title</label>
                <input 
                  type="text" required value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all"
                  placeholder="e.g. Architect Research Module"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Intel Component</label>
                  <select 
                    value={newTask.skillRequired}
                    onChange={e => setNewTask({...newTask, skillRequired: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 transition-all outline-none font-bold"
                  >
                    <option value="coding">Coding</option>
                    <option value="design">Design</option>
                    <option value="research">Research</option>
                    <option value="writing">Writing</option>
                    <option value="ppt">Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Deadline Sync</label>
                  <input 
                    type="date" required value={newTask.deadline}
                    onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 transition-all outline-none font-bold"
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button type="submit" className="flex-1 h-16 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95">Initiate Task</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-8 h-16 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoardPage;
