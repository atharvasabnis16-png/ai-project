import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineArrowRight,
  HiOutlineCode,
  HiOutlineDesktopComputer,
  HiOutlineSearch,
  HiOutlineDocumentText,
  HiOutlinePencilAlt,
  HiOutlineSparkles
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SKILLS_LIST = [
  { id: 'coding', name: 'Coding', icon: <HiOutlineCode size={24} /> },
  { id: 'design', name: 'Design', icon: <HiOutlineDesktopComputer size={24} /> },
  { id: 'research', name: 'Research', icon: <HiOutlineSearch size={24} /> },
  { id: 'writing', name: 'Writing', icon: <HiOutlineDocumentText size={24} /> },
  { id: 'ppt', name: 'PPT / Presentation', icon: <HiOutlinePencilAlt size={24} /> },
];

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [skills, setSkills] = useState(
    SKILLS_LIST.map(s => ({ name: s.id, confidence: 3, selected: false }))
  );

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

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

  const nextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
        return setError('All identity fields are required');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
        return setError('Password must be at least 6 characters');
    }
    setStep(2);
    setError('');
  };

  const handleFinalSubmit = async () => {
    try {
      setError('');
      setSubmitting(true);
      const selectedSkills = skills
        .filter(s => s.selected)
        .map(s => ({ name: s.name, confidence: s.confidence }));

      if (selectedSkills.length === 0) {
        setError('Please select at least one skill to continue');
        return;
      }

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skills: selectedSkills || skills
      });

      if (result && (result.token || result.success)) {
        toast.success('Account synchronized!');
        navigate('/dashboard');
      } else {
        setError(result?.message || 'Registration failed. Try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Register error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] flex items-center justify-center p-6 relative overflow-hidden font-inter text-gray-900">
      {/* Decorative Gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px]"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10 transition-all duration-700">
        <div className="hidden lg:block space-y-8 pr-10">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-indigo-600 font-black text-2xl italic border border-indigo-50">
            PI
          </div>
          <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-gray-800">
            {step === 1 ? (
                <>Collaborate with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Intelligence.</span></>
            ) : (
                <>Select your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dominant Skills.</span></>
            )}
          </h1>
          <p className="text-gray-500 font-bold text-lg leading-relaxed">
            {step === 1 
              ? "Join the elite circle of students using AI to master project management."
              : "Our AI matches your specific confidence levels to the most critical project nodes."}
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-4">
                {[1,2,3].map(i => (
                    <div key={i} className={`w-12 h-12 rounded-2xl border-4 border-white bg-indigo-${i*100} flex items-center justify-center font-black text-white text-xs`}>
                        {String.fromCharCode(64+i)}
                    </div>
                ))}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">+500 Students active</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-100/30 border border-white relative min-h-[600px] flex flex-col">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-2">{step === 1 ? 'Create Account' : 'Skill Profile'}</h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic opacity-60">Step {step} of 2: {step === 1 ? 'Basics' : 'Expertise'}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center space-x-3 animate-fadeIn">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={nextStep} className="space-y-4 flex-1">
              <div>
                <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Identity</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <HiOutlineUser size={20} />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white font-semibold transition-all outline-none text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Portal Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <HiOutlineMail size={20} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white font-semibold transition-all outline-none text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Key</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <HiOutlineLockClosed size={20} />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white font-semibold transition-all outline-none text-gray-900 placeholder-gray-400 bg-white"
                      placeholder="Min 6 chars"
                    />
                  </div>
                </div>
                <div>
                    <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                        <HiOutlineLockClosed size={20} />
                        </div>
                        <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white font-semibold transition-all outline-none text-gray-900 placeholder-gray-400 bg-white"
                        placeholder="Repeat"
                        />
                    </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transform transition-all active:scale-[0.98] mt-6 flex items-center justify-center space-x-3 text-lg"
              >
                <span>Continue to Skills</span>
                <HiOutlineArrowRight size={22} />
              </button>
            </form>
          ) : (
            <div className="space-y-6 flex-1 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4 pr-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {SKILLS_LIST.map((skill) => {
                  const skillData = skills.find(s => s.name === skill.id);
                  return (
                    <div 
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer group ${
                        skillData.selected 
                          ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-50' 
                          : 'bg-gray-50 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                        skillData.selected ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'
                      }`}>
                        {skill.icon}
                      </div>
                      <h3 className="font-black text-xs mb-3">{skill.name}</h3>
                      
                      {skillData.selected && (
                        <div className="space-y-2" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-between items-center text-[8px] font-black uppercase text-indigo-600">
                              <span>Skill Level</span>
                              <span>{skillData.confidence}/5</span>
                          </div>
                          <input 
                            type="range" min="1" max="5" 
                            value={skillData.confidence}
                            onChange={(e) => updateConfidence(skill.id, e.target.value)}
                            className="w-full h-1.5 bg-gray-100 rounded-full appearance-none accent-indigo-600 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 space-y-4">
                  <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="w-full h-16 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transform transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3 text-lg"
                  >
                    <HiOutlineSparkles className="text-indigo-400" />
                    <span>{submitting ? 'Initializing...' : 'Synthesize Account'}</span>
                  </button>
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full text-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                  >
                    Go Back
                  </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-500">
              Inside already?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
