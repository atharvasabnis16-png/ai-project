import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineCode, 
  HiOutlinePencilAlt, 
  HiOutlineSearch, 
  HiOutlineDocumentText, 
  HiOutlineDesktopComputer,
  HiOutlineSparkles
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const SKILLS_LIST = [
  { id: 'coding', name: 'Coding', icon: <HiOutlineCode size={24} /> },
  { id: 'design', name: 'Design', icon: <HiOutlineDesktopComputer size={24} /> },
  { id: 'research', name: 'Research', icon: <HiOutlineSearch size={24} /> },
  { id: 'writing', name: 'Writing', icon: <HiOutlineDocumentText size={24} /> },
  { id: 'ppt', name: 'PPT / Presentation', icon: <HiOutlinePencilAlt size={24} /> },
];

const SkillProfilePage = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState(
    SKILLS_LIST.map(s => ({ name: s.id, confidence: 3, selected: false }))
  );

  const toggleSkill = (id) => {
    setSkills(prev => prev.map(s => 
      s.name === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const updateConfidence = (id, value) => {
    setSkills(prev => prev.map(s => 
      s.name === id ? { ...s, confidence: parseInt(value) } : s
    ));
  };

  const handleSubmit = async () => {
    const selectedSkills = skills
      .filter(s => s.selected)
      .map(s => ({ name: s.name, confidence: s.confidence }));

    if (selectedSkills.length === 0) {
      return toast.error('Please select at least one skill');
    }

    const { success } = await updateProfile(selectedSkills);
    if (success) {
      toast.success('Profile complete!');
      navigate('/team-setup');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] flex items-center justify-center p-6 relative overflow-hidden font-inter text-gray-900">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
      
      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 font-black text-xs uppercase tracking-widest mb-4">
                <HiOutlineSparkles />
                <span>AI Skill Matcher</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Define Your Expertise</h1>
            <p className="text-gray-500 font-bold max-w-md mx-auto">
                Select your core skills and rate your confidence. Our AI will use this to assign you the perfect tasks.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {SKILLS_LIST.map((skill) => {
            const skillData = skills.find(s => s.name === skill.id);
            return (
              <div 
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer group ${
                  skillData.selected 
                    ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
                    : 'bg-white/50 border-transparent hover:border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  skillData.selected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                  {skill.icon}
                </div>
                <h3 className="font-black text-lg mb-4">{skill.name}</h3>
                
                {skillData.selected && (
                  <div className="space-y-4 animate-fadeIn" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Beginner</span>
                        <span className="text-indigo-600">Expert ({skillData.confidence})</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={skillData.confidence}
                      onChange={(e) => updateConfidence(skill.id, e.target.value)}
                      className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                )}
                {!skillData.selected && (
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Click to enable</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center space-y-6">
            <button 
                onClick={handleSubmit}
                className="px-12 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-2xl hover:bg-black transform transition-all active:scale-95 flex items-center space-x-4"
            >
                <span className="text-lg">Finalize Profile</span>
                <HiOutlineArrowRight size={22} className="text-indigo-400" />
            </button>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] opacity-60">Step 2 of 2 complete</p>
        </div>
      </div>
    </div>
  );
};

import { HiOutlineArrowRight } from 'react-icons/hi';
export default SkillProfilePage;
