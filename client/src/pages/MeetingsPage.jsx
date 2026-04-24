import { useState, useEffect } from 'react';
import api from '../services/api';
import { HiOutlineChatAlt2, HiOutlinePlus, HiOutlineSparkles, HiOutlineCalendar, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MeetingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', transcript: '', date: new Date().toISOString().split('T')[0] });
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, [user?.teamId]);

  const fetchMeetings = async () => {
    try {
      if (!user?.teamId) {
        setLoading(false);
        return;
      }
      const { data } = await api.get('/meetings');
      setMeetings(data);
    } catch (err) {
      console.error(err);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (e) => {
    e.preventDefault();
    try {
      await api.post('/meetings', newMeeting);
      toast.success('Meeting logged');
      setShowModal(false);
      setNewMeeting({ title: '', transcript: '', date: new Date().toISOString().split('T')[0] });
      fetchMeetings();
    } catch (err) {
      toast.error('Failed to log');
    }
  };

  const analyzeMeeting = async (id) => {
    setAnalyzing(true);
    setAnalysis(null);
    toast.loading('AI Processing Voice-to-Intel...', { duration: 2000 });
    try {
      const { data } = await api.post(`/meetings/${id}/analyze`);
      setAnalysis({ id, ...data });
      toast.success('Meeting Analyzed');
    } catch (err) {
      toast.error('Analysis Link Offline');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-black text-gray-300 animate-pulse">Accessing Transcript Hub...</div>;
  
  // Show empty state if no team
  if (!user?.teamId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h3 className="text-2xl font-black text-gray-800 mb-4">You're not in a team yet</h3>
        <p className="text-gray-500 font-medium mb-8 text-center max-w-md">
          Create or join a team to access this feature.
        </p>
        <button 
          onClick={() => navigate('/team')}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transform transition-all active:scale-[0.98]"
        >
          Go to Team Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Meeting Intelligence</h1>
          <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60 italic">Voice & Decision Analytics</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl flex items-center space-x-3 shadow-xl hover:bg-black transition-all active:scale-95"
        >
            <HiOutlinePlus size={20} className="text-indigo-400" />
            <span className="text-sm uppercase tracking-[0.2em]">Log Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
        {/* Meeting List */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-4 custom-scrollbar">
          {meetings.length === 0 ? (
            <div className="bg-white p-10 rounded-[40px] border-2 border-dashed border-gray-100 text-center opacity-40">
                <HiOutlineChatAlt2 size={48} className="mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Sessions Logged</p>
            </div>
          ) : (
            meetings.map(m => (
              <div 
                key={m._id} 
                onClick={() => analyzeMeeting(m._id)}
                className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all group ${
                  analysis?.id === m._id ? 'bg-white border-indigo-600 shadow-xl ring-4 ring-indigo-50' : 'bg-white border-transparent hover:border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <HiOutlineCalendar size={20} />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(m.date).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="font-black text-gray-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">{m.title}</h3>
                <p className="text-xs font-medium text-gray-400 mt-2 line-clamp-2 italic">"{m.transcript.slice(0, 100)}..."</p>
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <HiOutlineSparkles className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase text-indigo-600">Analyze with AI</span>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Analysis Result */}
        <div className="lg:col-span-2">
            {!analysis && !analyzing ? (
                <div className="h-full bg-white rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-20 text-center opacity-40">
                    <HiOutlineSparkles size={64} className="mb-6 text-indigo-200" />
                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Neural Link Idle</h3>
                    <p className="text-sm font-medium text-gray-300 mt-2">Select a session on the left to activate the Meeting Intelligence Engine.</p>
                </div>
            ) : analyzing ? (
                <div className="h-full bg-white rounded-[48px] border border-gray-50 flex flex-col items-center justify-center p-20 text-center shadow-2xl">
                    <div className="relative">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full animate-ping opacity-25" />
                        <HiOutlineSparkles size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-indigo-600 uppercase tracking-[.3em] mt-8">Synthesizing Intel</h3>
                    <p className="text-sm font-medium text-gray-400 mt-2">Claude is analyzing your transcript for key decisions and tasks...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[48px] shadow-2xl border border-gray-50 p-12 space-y-10 animate-fadeIn h-full overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start pt-2">
                        <div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[.4em] mb-2 block">Meeting Analytics</span>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-8">Insight Matrix</h2>
                        </div>
                        <div className="flex items-center space-x-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full text-xs border border-green-100">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                             <span>Live Analysis</span>
                        </div>
                    </div>

                    <section>
                        <h4 className="flex items-center text-sm font-black text-gray-800 uppercase tracking-widest mb-6">
                            <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-3"><HiOutlineChatAlt2 /></span>
                            Executive Summary
                        </h4>
                        <p className="text-gray-600 font-bold leading-relaxed italic bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                            {analysis.summary}
                        </p>Section
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <section>
                            <h4 className="flex items-center text-sm font-black text-gray-800 uppercase tracking-widest mb-6">
                                <span className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mr-3"><HiOutlineCheckCircle /></span>
                                Key Decisions
                            </h4>
                            <ul className="space-y-3">
                                {analysis.decisions?.map((d, i) => (
                                    <li key={i} className="flex items-start space-x-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-sm font-bold text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                                        <span>{d}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section>
                            <h4 className="flex items-center text-sm font-black text-gray-800 uppercase tracking-widest mb-6">
                                <span className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mr-3"><HiOutlinePlus /></span>
                                Action Tasked
                            </h4>
                            <ul className="space-y-3">
                                {analysis.actionPoints?.map((a, i) => (
                                    <li key={i} className="flex items-start space-x-3 p-4 bg-green-50/50 rounded-2xl border border-green-100/50 text-sm font-bold text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                                        <span>{a}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Log Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-[#1a1a2e]/40">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl p-12 relative animate-fadeIn">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Log Meeting Hub</h2>
            <form onSubmit={createMeeting} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Session Title</label>
                    <input 
                    type="text" required value={newMeeting.title} 
                    onChange={e => setNewMeeting({...newMeeting, title: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Weekly Sync #1"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Sync Date</label>
                    <input 
                    type="date" required value={newMeeting.date}
                    onChange={e => setNewMeeting({...newMeeting, date: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 transition-all outline-none font-bold text-gray-900 bg-white"
                    />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Session Transcript (Full Text)</label>
                <textarea 
                  required value={newMeeting.transcript}
                  onChange={e => setNewMeeting({...newMeeting, transcript: e.target.value})}
                  className="w-full h-48 px-6 py-4 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all resize-none text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="Paste meeting notes or voice-to-text here..."
                />
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button type="submit" className="flex-1 h-16 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95">Verify & Store</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-8 h-16 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { HiOutlineCheckCircle } from 'react-icons/hi';
export default MeetingsPage;
