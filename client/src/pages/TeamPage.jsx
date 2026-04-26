import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineClipboardCopy, HiOutlineUsers, HiOutlineLink, HiOutlineUser, HiOutlineStar, HiOutlineLightningBolt, HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TeamPage = () => {
  const { user, refreshUser } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState({ name: '', projectName: '' });
  const [joinForm, setJoinForm] = useState({ code: '' });
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const { data } = await api.get('/teams/stats');
        if (data.success && data.team) {
          setTeamData(data.team);
        }
      } catch (err) {
        console.error('Team stats error:', err);
        // Don't crash - just show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchTeamStats();
  }, [user?.teamId]);

  const createTeam = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.projectName) {
      return toast.error('Please fill in all fields');
    }

    setCreating(true);
    try {
      const { data } = await api.post('/teams/create', createForm);
      if (data.success) {
        setTeamData(data.team);
        setGeneratedCode(data.team.code);
        toast.success('Team created successfully!');
        setCreateForm({ name: '', projectName: '' });
        await refreshUser(); // THIS IS KEY
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const joinTeam = async (e) => {
    e.preventDefault();
    if (!joinForm.code || joinForm.code.length !== 6) {
      return toast.error('Please enter a valid 6-digit team code');
    }

    setJoining(true);
    try {
      const { data } = await api.post('/teams/join', { code: joinForm.code });
      if (data.success) {
        setTeam(data.team);
        toast.success('Successfully joined team!');
        setJoinForm({ code: '' });
        await refreshUser(); // THIS IS KEY
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join team');
    } finally {
      setJoining(false);
    }
  };

  const leaveTeam = async () => {
    if (!confirm('Are you sure you want to leave the team?')) return;
    
    try {
      await api.post('/teams/leave');
      setTeamData(null);
      toast.success('Left team successfully');
      await refreshUser();
    } catch (error) {
      toast.error('Failed to leave team');
    }
  };

  const copyInviteCode = () => {
    if (teamData?.code) {
      navigator.clipboard.writeText(teamData.code);
      toast.success('Invite code copied to clipboard!');
    }
  };

  if (loading) return <div className="text-center py-20 font-black text-gray-300 uppercase animate-pulse">Establishing Connection...</div>;

  // SECTION A - No Team State
  if (!teamData) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          {/* Top Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl shadow-indigo-500/30 mb-8">
              <HiOutlineLightningBolt className="text-white text-4xl" />
            </div>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
              Start Your Project Journey
            </h1>
            <p className="text-gray-400 text-lg font-medium">
              Create a team or join existing one with a code
            </p>
          </div>

          {/* Two Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CREATE TEAM CARD */}
            <div className="bg-[#1a1a2e] border border-indigo-500/30 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <HiOutlineSparkles className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Create New Team</h2>
                  <p className="text-gray-400 font-medium">Start fresh, you'll be the team leader</p>
                </div>
              </div>

              {!generatedCode ? (
                <form onSubmit={createTeam} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full bg-[#0f0f1a] border border-indigo-500/30 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Team Alpha"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={createForm.projectName}
                      onChange={(e) => setCreateForm({ ...createForm, projectName: e.target.value })}
                      className="w-full bg-[#0f0f1a] border border-indigo-500/30 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. AI Healthcare Platform"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black rounded-xl hover:scale-[1.02] hover:brightness-[1.1] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Team →</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-indigo-500/10 border border-indigo-500 rounded-xl p-6 text-center">
                  <div className="text-green-400 text-2xl mb-4">✅ Team Created!</div>
                  <div className="text-white text-xl font-bold mb-2">{createForm.name}</div>
                  <div className="text-gray-400 text-sm mb-4">Your Invite Code:</div>
                  <div className="text-indigo-300 text-4xl font-mono font-black tracking-widest mb-6">
                    {generatedCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      toast.success('Code copied to clipboard!');
                    }}
                    className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <HiOutlineClipboardCopy size={20} />
                    <span>Copy Code</span>
                  </button>
                  <p className="text-gray-400 text-sm mt-4">Share this code with your teammates</p>
                </div>
              )}
            </div>

            {/* JOIN TEAM CARD */}
            <div className="bg-[#1a1a2e] border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <HiOutlineLink className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Join Existing Team</h2>
                  <p className="text-gray-400 font-medium">Enter the code shared by your team leader</p>
                </div>
              </div>

              <form onSubmit={joinTeam} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={joinForm.code}
                    onChange={(e) => setJoinForm({ code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) })}
                    className="w-full bg-[#0f0f1a] border border-purple-500/30 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-center text-2xl font-mono tracking-widest"
                    placeholder="Enter 6-digit code e.g. ABC123"
                    maxLength={6}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black rounded-xl hover:scale-[1.02] hover:brightness-[1.1] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {joining ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Join Team →</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SECTION B - Has Team State
  return (
    <div className="min-h-screen bg-[#0f0f1a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Safety checks */}
        {(() => {
          const members = teamData?.members || [];
          const teamName = teamData?.name || '';
          const teamCode = teamData?.code || '';
          const teamCompletion = teamData?.teamCompletion || 0;
          const totalTasks = teamData?.totalTasks || 0;
          return null;
        })()}
        {/* Team Stats Banner */}
        {teamData && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1a1a2e] border border-indigo-500/20 
              rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-white">
                {teamData.members?.length || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">Members</p>
            </div>
            <div className="bg-[#1a1a2e] border border-indigo-500/20 
              rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-indigo-400">
                {teamData.totalTasks || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">Total Tasks</p>
            </div>
            <div className="bg-[#1a1a2e] border border-indigo-500/20 
              rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-green-400">
                {teamData.teamCompletion || 0}%
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Team Completion
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            {teamData.name}
          </h1>
          <p className="text-indigo-400 text-xl font-medium mb-4">
            {teamData.projectName}
          </p>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500 px-4 py-2 rounded-full">
            <span className="text-indigo-300 font-medium">Code:</span>
            <span className="text-white font-mono font-bold">{teamData.code}</span>
            <button
              onClick={copyInviteCode}
              className="text-indigo-300 hover:text-white transition-colors"
            >
              <HiOutlineClipboardCopy size={16} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1a1a2e] border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <HiOutlineUsers className="text-indigo-400 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-black text-white">{teamData?.members?.length || 0}</div>
                <div className="text-gray-400 text-sm">Total Members</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <HiOutlineSparkles className="text-purple-400 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-black text-white">0</div>
                <div className="text-gray-400 text-sm">Active Tasks</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-400 rounded-full"></div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">0%</div>
                <div className="text-gray-400 text-sm">Completion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {teamData.members?.map((member) => (
            <div key={member._id} className="bg-[#1a1a2e] border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">
                    {String(member.name || '').charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{String(member.name || 'Unknown')}</h3>
                  <p className="text-gray-400 text-sm mb-3">{String(member.email || '')}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {teamData.leaderId === member._id ? (
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <HiOutlineStar size={12} />
                        <span>Leader</span>
                      </div>
                    ) : (
                      <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <HiOutlineUser size={12} />
                        <span>Member</span>
                      </div>
                    )}
                  </div>

                  {/* Active Tasks Badge */}
                  <div className="flex items-center gap-2 
                    bg-indigo-500/10 rounded-lg px-3 py-1">
                    <span className="text-indigo-400 text-sm">⚡</span>
                    <span className="text-white text-sm font-bold">
                      {Number(member.activeTasks || 0)}
                    </span>
                    <span className="text-gray-400 text-xs">active tasks</span>
                  </div>

                  {/* Completion Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Completion</span>
                      <span className="text-white font-bold">
                        {Number(member.completion || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 
                          to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${Number(member.completion || 0)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">
                        {Number(member.completedTasks || 0)}/{Number(member.totalTasks || 0)} tasks
                      </span>
                    </div>
                  </div>

                  {(member.skills || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(member.skills || []).map((skill, i) => (
                        <div
                          key={i}
                          className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full px-2 py-1 text-xs"
                        >
                          {typeof skill === 'string' ? skill : skill.name || ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Team Button */}
        <div className="text-center">
          <button
            onClick={leaveTeam}
            className="px-8 py-3 border border-red-500 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all font-medium"
          >
            Leave Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
