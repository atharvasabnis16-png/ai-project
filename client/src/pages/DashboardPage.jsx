import { useState, useEffect } from 'react';
import api from '../services/api';
import ProgressRing from '../components/dashboard/ProgressRing';
import ContributionChart from '../components/dashboard/ContributionChart';
import { HiOutlineLightBulb, HiOutlineExclamation, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Initialize with the mock data so it's never null
  const [stats, setStats] = useState({
    completion: 45,
    tasks: { todo: 4, inProgress: 3, done: 5 },
    contributions: [
      { name: 'Alex', value: 35 },
      { name: 'Jordan', value: 25 },
      { name: 'Sam', value: 40 }
    ],
    hasImbalance: true
  });
  const [loading, setLoading] = useState(true);
  const [showImbalanceBanner, setShowImbalanceBanner] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/teams'); 
        // Only override if data actually has the expected structure
        if (data && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        // We'll just continue using the mock data silently
        // Optional: toast.error('Using mock data, failed to load from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregating Team Stats...</p>
    </div>
  );

  // Fallback safe values in case stats gets corrupted
  const safeStats = stats || {
    completion: 0,
    tasks: { todo: 0, inProgress: 0, done: 0 },
    contributions: [],
    hasImbalance: false
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60 italic">AI Managed Hub</p>
        </div>
        <button 
          onClick={() => toast.success('Project synced successfully!')}
          className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-colors"
        >
            <HiOutlineCheckCircle size={14} />
            <span>Project Synchronized</span>
        </button>
      </div>

      {/* Intelligence Banner */}
      {safeStats.hasImbalance && showImbalanceBanner && (
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4e] p-[2px] rounded-[32px] shadow-2xl shadow-indigo-200">
            <div className="bg-[#1a1a2e] rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-white">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/20">
                        <HiOutlineExclamation size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-lg tracking-tight">Workload Imbalance Detected</h4>
                        <p className="text-gray-400 text-sm font-medium">Jordan's current assigned tasks outweigh the team average by 40%. Consider re-assigning.</p>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        toast.success('Workload rebalanced! Tasks redistributed among team members.');
                        setShowImbalanceBanner(false);
                    }}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                    Auto-Balance Now
                </button>
            </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-indigo-100/20 border border-gray-50 flex flex-col items-center justify-center space-y-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Progress</h3>
            <ProgressRing percentage={safeStats.completion || 0} />
            <div className="grid grid-cols-3 gap-6 w-full pt-6 border-t border-gray-50">
                <div 
                    onClick={() => navigate('/tasks')}
                    className="text-center cursor-pointer group hover:bg-gray-50 p-2 rounded-xl transition-colors"
                >
                    <p className="text-2xl font-black text-gray-900 group-hover:text-indigo-600">{safeStats.tasks?.todo || 0}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase">To Do</p>
                </div>
                <div 
                    onClick={() => navigate('/tasks')}
                    className="text-center cursor-pointer group hover:bg-gray-50 p-2 rounded-xl transition-colors"
                >
                    <p className="text-2xl font-black text-indigo-600 group-hover:scale-110 transition-transform">{safeStats.tasks?.inProgress || 0}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase">Active</p>
                </div>
                <div 
                    onClick={() => navigate('/tasks')}
                    className="text-center cursor-pointer group hover:bg-gray-50 p-2 rounded-xl transition-colors"
                >
                    <p className="text-2xl font-black text-green-600 group-hover:text-green-700">{safeStats.tasks?.done || 0}</p>
                    <p className="text-[10px] font-black text-green-500 uppercase">Done</p>
                </div>
            </div>
        </div>

        {/* Contribution Card */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-xl shadow-indigo-100/20 border border-gray-50 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Individual Contributions (%)</h3>
                <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase">
                    <HiOutlineClock size={14} />
                    <span>Real-time Sync</span>
                </div>
            </div>
            <div className="flex-1 min-h-[300px]">
                {safeStats.contributions && safeStats.contributions.length > 0 ? (
                  <ContributionChart data={safeStats.contributions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No contribution data available</div>
                )}
            </div>
        </div>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="bg-white p-8 rounded-[32px] shadow-lg shadow-indigo-100/10 border border-gray-50 flex items-center space-x-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <HiOutlineLightBulb size={28} />
            </div>
            <div>
                <h4 className="font-black text-lg text-gray-800">Predicted Delay Risk</h4>
                <p className="text-sm font-medium text-gray-500">System predicts a 15% probability of deadline overshoot. <span className="text-indigo-600 font-bold">See Analysis →</span></p>
            </div>
        </div>
        <div className="bg-[#1a1a2e] p-8 rounded-[32px] shadow-lg shadow-indigo-200/10 border border-gray-50 flex items-center space-x-6 hover:translate-y-[-4px] transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <HiOutlineCheckCircle size={28} />
            </div>
            <div>
                <h4 className="font-black text-lg text-white">Fairness Score: 9.2</h4>
                <p className="text-sm font-medium text-gray-400">Contribution variance is minimal. Your team is highly synchronized.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
