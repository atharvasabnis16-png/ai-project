import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineBell, HiOutlineSearch, HiOutlineAdjustments, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const mockSearchResults = [
    { title: 'Project Specification', type: 'Note' },
    { title: 'Design Assets', type: 'Folder' },
    { title: 'Sarah Smith', type: 'Member' },
    { title: 'Task: Database Schema', type: 'Task' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative group">
        <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-2xl w-[400px] border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
          <HiOutlineSearch className="text-gray-400 mr-3" size={20} />
          <input 
            type="text" 
            placeholder="Search team assets..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(e.target.value.length > 0);
            }}
            onFocus={() => setShowSearch(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 font-medium"
          />
        </div>

        {showSearch && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-fadeIn">
            <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Search results for "{searchQuery}"</p>
            {mockSearchResults.map((result, i) => (
              <button key={i} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl flex items-center justify-between transition-colors">
                <span className="text-sm font-bold text-gray-700">{result.title}</span>
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">{result.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            >
              <HiOutlineBell size={24} />
              <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">2</span>
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 py-4 animate-fadeIn">
                <div className="px-6 pb-2 border-b border-gray-50 mb-2">
                  <h4 className="font-black text-gray-800 tracking-tight text-lg">Notifications</h4>
                </div>
                <div className="px-6 py-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                    <HiOutlineBell size={32} />
                  </div>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          <button className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl transition-all">
            <HiOutlineAdjustments size={24} />
          </button>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-4 pl-6 border-l border-gray-100 hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">{user?.name || 'Academic'}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
                {user?.teamId ? 'Team Active' : 'No Team'}
              </p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/20 border-2 border-white">
              {user?.name?.charAt(0) || 'P'}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-fadeIn">
              <Link 
                to="/team" 
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold text-gray-700"
                onClick={() => setShowUserMenu(false)}
              >
                <HiOutlineUser className="text-gray-400" size={18} />
                <span>Profile</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold text-red-500"
              >
                <HiOutlineLogout size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
