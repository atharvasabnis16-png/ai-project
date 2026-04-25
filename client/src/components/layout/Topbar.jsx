import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineBell, HiOutlineSearch, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import api from '../../services/api';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchTeamName = async () => {
      if (!user?.teamId) return;
      try {
        const { data } = await api.get('/teams/my-team');
        if (data.success && data.team) {
          setTeamName(data.team.name);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeamName();
  }, [user?.teamId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user?.teamId) return;
        const { data } = await api.get('/notifications');
        if (data.success) {
          setNotifications(data.notifications);
          const unread = data.notifications.filter(
            n => !n.readBy.includes(user._id)
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.teamId]);

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

  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
    if (user?.teamId) {
      await api.put(`/notifications/read/${user.teamId}`);
      setUnreadCount(0);
    }
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
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            className="flex-1 bg-transparent outline-none font-bold text-gray-900 placeholder-gray-400"
          />
        </div>

        {showSearch && searchQuery && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn z-50">
            {mockSearchResults.filter(r => 
              r.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((result, idx) => (
              <button key={idx} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors">
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
            <button onClick={handleBellClick} className="relative p-2">
              <HiOutlineBell className="w-6 h-6 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 
                  bg-red-500 text-white text-xs rounded-full 
                  flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 
                bg-[#1a1a2e] border border-indigo-500/20 
                rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-indigo-500/20">
                  <h3 className="font-bold text-white">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} 
                        className="p-4 border-b border-indigo-500/10
                          hover:bg-indigo-500/10 cursor-pointer">
                        <p className="text-sm text-white">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
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
                  {teamName || 'No Team'}
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
      </div>
    </header>
  );
};

export default Topbar;
