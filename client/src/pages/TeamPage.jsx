import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineBadgeCheck, HiOutlineUserGroup, HiOutlineShare } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TeamPage = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await api.get('/teams');
        // If team exists, it's usually returned as the first item or single object
        setTeam(data[0] || data); 
      } catch (err) {
        toast.error('Failed to sync team data');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const copyInviteCode = () => {
    if (team?.inviteCode) {
      navigator.clipboard.writeText(team.inviteCode);
      toast.success('Invite code copied to clipboard!');
    }
  };

  if (loading) return <div className="text-center py-20 font-black text-gray-300 uppercase animate-pulse">Establishing Connection...</div>;
  if (!team) return <div className="text-center py-20 font-black text-gray-400 capitalize">No team active. Please create or join one first.</div>;

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{team.name}</h1>
          <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mt-2 italic bg-indigo-50 px-3 py-1 rounded-full inline-block border border-indigo-100">
            Node ID: {team._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="flex bg-white p-2 rounded-3xl shadow-xl shadow-indigo-100/30 border border-gray-100 items-center space-x-4 pr-6 group">
            <div className="bg-indigo-600 px-6 py-3 rounded-2xl text-white">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5 text-indigo-200">Invite Code</p>
                <p className="text-xl font-mono font-black tracking-tight">{team.inviteCode}</p>
            </div>
            <button 
                onClick={copyInviteCode}
                className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all group-hover:text-indigo-600"
            >
                <HiOutlineShare size={20} />
            </button>
        </div>
      </div>

      <div className="relative p-10 rounded-[48px] bg-[#1a1a2e] text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-black mb-4">Project Intelligence Goal</h2>
              <p className="text-indigo-100/60 leading-relaxed font-medium text-lg italic">
                "{team.projectDescription || 'No description provided yet. Define your project goals in the workspace to align the AI models.'}"
              </p>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12">
            <HiOutlineUserGroup size={200} />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.members.map((member) => (
          <div key={member._id} className="bg-white rounded-[40px] shadow-lg shadow-indigo-100/20 border border-gray-50 overflow-hidden hover:shadow-2xl transition-all group">
            <div className="p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[24px] flex items-center justify-center shadow-lg shadow-indigo-500/20 border-4 border-white">
                  <span className="text-white font-black text-xl">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    <HiOutlineMail className="mr-1 text-indigo-300" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Cognitive Profile</h4>
                    <div className="flex flex-wrap gap-2">
                        {member.skills && member.skills.length > 0 ? (
                            member.skills.map((skill, i) => (
                                <div key={i} className="bg-gray-50 px-3 py-2 rounded-xl flex items-center space-x-2 border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-700 capitalize">{skill.name}</span>
                                    <div className="flex space-x-0.5">
                                        {[1,2,3,4,5].map(lvl => (
                                            <div key={lvl} className={`w-1 h-1 rounded-full ${lvl <= skill.confidence ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] font-bold text-gray-300 italic">No skills analyzed</p>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contribution Badges</h4>
                    <div className="flex items-center space-x-2">
                        {member._id === team.createdBy._id || member._id === team.createdBy ? (
                            <div className="bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg flex items-center space-x-2 border border-yellow-100">
                                <HiOutlineBadgeCheck size={14} />
                                <span className="text-[10px] font-black uppercase">Founder</span>
                            </div>
                        ) : (
                            <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center space-x-2 border border-blue-100">
                                <HiOutlineUserGroup size={14} />
                                <span className="text-[10px] font-black uppercase">Member</span>
                            </div>
                        )}
                        <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg flex items-center space-x-2 border border-green-100">
                            <span className="text-[10px] font-black uppercase italic">High Sync</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gray-50 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 transition-all border-t border-gray-50">
                View Detailed Intelligence
            </button>
          </div>
        ))}

        <div className="bg-[#f8f9fe] border-4 border-dashed border-gray-200 rounded-[48px] flex flex-col items-center justify-center p-12 text-center space-y-6 group cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
            <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center text-gray-300 group-hover:text-indigo-600 group-hover:shadow-xl transition-all shadow-indigo-100">
                <HiOutlinePlus size={32} />
            </div>
            <div>
                <h4 className="font-black text-xl text-gray-400 group-hover:text-indigo-600">Sync New Member</h4>
                <p className="text-xs font-medium text-gray-400 mt-2 px-6">Share the secret hub code above to onboard your peers into the project node.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

import { HiOutlinePlus } from 'react-icons/hi';
export default TeamPage;
