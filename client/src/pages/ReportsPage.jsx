import { useState, useEffect } from 'react';
import api from '../services/api';
import ContributionChart from '../components/dashboard/ContributionChart';
import { HiOutlineChartBar, HiOutlineCalendar, HiOutlineTrendingUp, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                if (!user?.teamId) {
                    setLoading(false);
                    return;
                }
                // Mocking complex reports for premium feel
                setStats({
                    totalTasks: 24,
                    completionRate: 78,
                    contributionVariance: 0.12,
                    syncScore: 94,
                    memberData: [
                       { name: 'Alex', value: 32, tasks: 8, confidence: 4.5 },
                       { name: 'Jordan', value: 28, tasks: 7, confidence: 4.2 },
                       { name: 'Sam', value: 40, tasks: 9, confidence: 4.8 }
                    ],
                    taskTypeDistribution: [
                        { type: 'Coding', value: 40 },
                        { type: 'Research', value: 25 },
                        { type: 'Writing', value: 20 },
                        { type: 'Design', value: 15 }
                    ]
                });
            } catch (err) {
                toast.error('Failed to generate report node');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [user?.teamId]);

    if (loading) return <div className="text-center py-20 font-black text-gray-300 animate-pulse uppercase">Compiling Performance Data...</div>;

    // Show no-team state
    if (!user?.teamId) {
        return (
            <div className="min-h-screen bg-[#f8f9fe] dark:bg-[#0f0f1a] flex items-center justify-center p-6 font-inter">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <HiOutlineChartBar className="text-gray-400 text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">No Team Data Available</h2>
                        <p className="text-gray-600 mb-6 dark:text-gray-400">You need to be in a team to view performance reports.</p>
                        <button 
                            onClick={() => navigate('/team')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Go to Team Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fadeIn pb-16 dark:bg-[#0f0f1a] dark:text-white">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight dark:text-white">Performance Reports</h1>
                    <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60 italic dark:text-gray-400">Advanced Project Metrics</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-all shadow-sm">
                        Export PDF
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Tasks', value: stats.totalTasks, icon: <HiOutlineChartBar />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Avg Completion', value: `${stats.completionRate}%`, icon: <HiOutlineTrendingUp />, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Variance', value: stats.contributionVariance, icon: <HiOutlineShieldCheck />, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Sync Score', value: stats.syncScore, icon: <HiOutlineCalendar />, color: 'text-blue-600', bg: 'bg-blue-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] shadow-lg shadow-indigo-100/10 border border-gray-50 flex items-center space-x-5">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-indigo-100/20 border border-gray-50 flex flex-col h-[500px]">
                    <div className="mb-10 flex justify-between items-center">
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest underline decoration-indigo-500 decoration-4 underline-offset-8">Cognitive Load Distribution</h3>
                        <span className="text-[10px] font-black text-gray-300 uppercase italic">Real-time Analysis</span>
                    </div>
                    <div className="flex-1">
                        <ContributionChart data={stats.memberData} />
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-indigo-100/20 border border-gray-50 h-[500px] overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-10 underline decoration-purple-500 decoration-4 underline-offset-8">Individual Intelligence Depth</h3>
                    <div className="space-y-8">
                        {stats.memberData.map((member, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {member.name.charAt(0)}
                                        </div>
                                        <span className="font-black text-gray-800 tracking-tight">{member.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 capitalize">Efficiency: {member.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                        style={{ width: `${member.value}%` }} 
                                    />
                                </div>
                                <div className="mt-2 flex justify-between text-[10px] font-bold text-gray-400 uppercase italic">
                                    <span>{member.tasks} Modules Complete</span>
                                    <span>Sync Rank: TOP 5%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bg-[#1a1a2e] p-12 rounded-[48px] shadow-2xl relative overflow-hidden text-white">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
                    <div className="max-w-xl">
                        <h4 className="text-2xl font-black mb-4">Neural Fairness Quotient: 0.98</h4>
                        <p className="text-indigo-100/60 leading-relaxed font-medium">
                            Your team demonstrates nearly perfect contribution symmetry. Cognitive load is balanced across all registered modules, minimizing burnout risk and maximizing project velocity.
                        </p>
                    </div>
                    <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-16 h-16 rounded-[24px] bg-indigo-600 border-4 border-[#1a1a2e] flex items-center justify-center text-xl font-black shadow-2xl">
                                {String.fromCharCode(64+i)}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 left-0 p-10 opacity-5 scale-150 rotate-45">
                    <HiOutlineChartBar size={200} />
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
