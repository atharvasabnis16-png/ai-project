import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineSparkles, 
  HiOutlineDocumentText, 
  HiOutlineClipboardList, 
  HiOutlineLightBulb,
  HiOutlineSave
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const WorkspacePage = () => {
  const { user } = useAuth();
  const [note, setNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/workspace/notes');
      setNote(data.note);
    } catch (err) {
      toast.error('Failed to sync team notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/workspace/notes', note);
      toast.success('Intelligence saved to hub');
    } catch (err) {
      toast.error('Sync failed');
    }
  };

  const handleAiAction = async (endpoint, label) => {
    if (!note.content) return toast.error('Empty data node. Add content first.');
    setAiLoading(true);
    setAiResult(null);
    try {
      const { data } = await api.post(`/ai/${endpoint}`, { content: note.content });
      setAiResult({ type: label, data });
      toast.success(`${label} Matrix Generated`);
    } catch (err) {
      toast.error('AI Neural Link Offline');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-black text-gray-300 uppercase animate-pulse">Accessing Shared Hub...</div>;

  return (
    <div className="h-full flex flex-col space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Smart Workspace</h1>
          <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60 italic">Collaborative Intelligence Sync</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-3 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95"
        >
          <HiOutlineSave size={20} className="text-indigo-400" />
          <span className="text-sm uppercase tracking-[0.2em]">Sync Hub</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
        {/* Editor Area */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="text-3xl font-black bg-transparent border-none outline-none text-gray-900 placeholder-gray-200 focus:placeholder-transparent transition-all"
            placeholder="Document Objective..."
          />
          
          <div className="flex-1 bg-white rounded-[40px] shadow-2xl shadow-indigo-100/30 border border-gray-100 flex flex-col relative overflow-hidden p-1">
            <textarea
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              className="w-full flex-1 p-10 resize-none border-none outline-none text-gray-700 leading-relaxed font-bold text-lg bg-white/50 z-10"
              placeholder="Begin brainstorming, taking notes, or outlining your strategy here..."
            />
            <div className="absolute bottom-6 right-10 z-20 flex items-center space-x-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Byte Count: {note.content.length}</span>
            </div>
          </div>
        </div>

        {/* AI Control Center */}
        <div className="space-y-8">
          <div className="bg-[#1a1a2e] rounded-[48px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <HiOutlineSparkles size={80} />
            </div>
            <h3 className="font-black text-xs uppercase tracking-[.3em] text-indigo-400 mb-8 flex items-center">
              <HiOutlineSparkles className="mr-3" />
              Intelligence Tools
            </h3>

            <div className="space-y-4 relative z-10">
              <button 
                onClick={() => handleAiAction('summarize', 'Summary')}
                disabled={aiLoading}
                className="w-full group flex items-center justify-between p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all disabled:opacity-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <HiOutlineDocumentText size={20} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">Summarize</span>
                </div>
                <HiOutlineSparkles className="text-white/20 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button 
                onClick={() => handleAiAction('action-points', 'Action Points')}
                disabled={aiLoading}
                className="w-full group flex items-center justify-between p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all disabled:opacity-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <HiOutlineClipboardList size={20} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest text-left">Extract Actions</span>
                </div>
                <HiOutlineSparkles className="text-white/20 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button 
                onClick={() => handleAiAction('cluster', 'Idea Clusters')}
                disabled={aiLoading}
                className="w-full group flex items-center justify-between p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all disabled:opacity-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <HiOutlineLightBulb size={20} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">Cluster Ideas</span>
                </div>
                <HiOutlineSparkles className="text-white/20 group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>

            {aiLoading && (
              <div className="mt-8 flex flex-col items-center justify-center space-y-4 py-4 border-t border-white/5 animate-fadeIn">
                 <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Neural Sync In Progress</span>
              </div>
            )}
          </div>

          {/* AI Result Viewport */}
          {aiResult && (
            <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100/20 border border-gray-100 p-8 animate-fadeIn relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[.3em]">
                   Matrix: {aiResult.type}
                </h4>
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
              </div>

              <div className="text-gray-600 text-sm font-bold leading-relaxed max-h-[400px] overflow-y-auto pr-4 custom-scrollbar whitespace-pre-wrap">
                {aiResult.type === 'Summary' && aiResult.data.summary}
                {aiResult.type === 'Action Points' && (
                  <ul className="space-y-3">
                    {aiResult.data.actionPoints?.map((task, i) => (
                      <li key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-2xl group/item">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                        <span className="text-gray-800 tracking-tight">{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {aiResult.type === 'Idea Clusters' && (
                  <div className="space-y-6">
                    {aiResult.data.clusters?.map((cluster, i) => (
                      <div key={i}>
                        <h5 className="font-black text-indigo-600 mb-2 underline decoration-2 underline-offset-4">{cluster.theme}</h5>
                        <ul className="space-y-1 pl-4 opacity-70">
                          {cluster.ideas.map((idea, j) => (
                            <li key={j}>• {idea}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
