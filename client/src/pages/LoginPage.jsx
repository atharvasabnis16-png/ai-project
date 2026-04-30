import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { 
        email, 
        password 
      });
      if (data.token) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Login failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] dark:bg-[#0f0f1a] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Decorative Gradients */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-md w-full relative z-10 transition-all duration-500 hover:translate-y-[-4px]">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/30 transform transition-transform hover:rotate-6">
            <span className="text-white font-black text-3xl italic">SS</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 font-semibold text-sm uppercase tracking-widest opacity-60">AI Project Platform</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-indigo-100/50 p-10 border border-white/50 dark:bg-[#1a1a2e] dark:border-indigo-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email Connection</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-gray-400">
                  <HiOutlineMail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white text-gray-900 font-semibold transition-all outline-none placeholder-gray-400 bg-white dark:bg-[#0f0f1a] dark:text-white dark:border-indigo-500/30"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-[xs] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Security Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-gray-400">
                  <HiOutlineLockClosed size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white text-gray-900 font-semibold transition-all outline-none placeholder-gray-400 bg-white dark:bg-[#0f0f1a] dark:text-white dark:border-indigo-500/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
              >
                <span>{loading ? 'Processing...' : 'Secure Login'}</span>
                {!loading && <HiOutlineArrowRight size={22} />}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-bold text-sm">
              New to the platform?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-purple-600 transition-colors border-b-2 border-indigo-100 pb-0.5 ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
