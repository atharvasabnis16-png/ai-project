import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineUserGroup, HiOutlinePlusCircle, HiOutlineArrowRight } from 'react-icons/hi';

const TeamSetupPage = () => {
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/teams', { name: teamName });
      toast.success('Team created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/teams/join', { inviteCode });
      toast.success('Joined team!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid invite code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] flex items-center justify-center p-6 relative overflow-hidden font-inter text-gray-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-100/50 rounded-full blur-[140px] opacity-40"></div>
      
      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">Last Step: Team Formation</h1>
            <p className="text-gray-500 font-bold italic opacity-60 uppercase text-xs tracking-widest">Collaborative Intelligence Begins Here</p>
        </div>

        {!mode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              onClick={() => setMode('create')}
              className="bg-white p-10 rounded-[40px] border-2 border-transparent hover:border-indigo-600 shadow-xl shadow-indigo-100/20 cursor-pointer transition-all group flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <HiOutlinePlusCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">Create Team</h3>
                <p className="text-gray-400 text-sm font-medium">Start a new project and invite your peers.</p>
              </div>
            </div>

            <div 
              onClick={() => setMode('join')}
              className="bg-white p-10 rounded-[40px] border-2 border-transparent hover:border-purple-600 shadow-xl shadow-indigo-100/20 cursor-pointer transition-all group flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <HiOutlineUserGroup size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">Join Team</h3>
                <p className="text-gray-400 text-sm font-medium">Enter an existing invite code to sync.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-100/30 border border-white animate-fadeIn">
            <button 
                onClick={() => setMode(null)}
                className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 hover:text-indigo-600 transition-colors flex items-center"
            >
                ← Back to choices
            </button>
            
            {mode === 'create' ? (
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Team Connection Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="block w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white font-bold transition-all outline-none"
                    placeholder="e.g. Dream Team 2024"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 text-lg"
                >
                  <span>{loading ? 'Generating Hub...' : 'Found Team'}</span>
                  <HiOutlineArrowRight size={22} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-6">
                <div>
                  <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Secret Invite Code</label>
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="block w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 focus:bg-white font-bold transition-all outline-none uppercase tracking-widest text-center text-2xl"
                    placeholder="CODEHERE"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-600/30 hover:bg-purple-700 transition-all flex items-center justify-center space-x-3 text-lg"
                >
                  <span>{loading ? 'Syncing...' : 'Enter Hub'}</span>
                  <HiOutlineArrowRight size={22} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSetupPage;
