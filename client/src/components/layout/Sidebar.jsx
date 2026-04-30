import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineUserGroup, 
  HiOutlineClipboardList, 
  HiOutlineDocumentText, 
  HiOutlineChatAlt2,
  HiOutlineChartBar,
  HiOutlineLogout
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <HiOutlineHome size={22} /> },
    { name: 'Tasks', path: '/tasks', icon: <HiOutlineClipboardList size={22} /> },
    { name: 'Team', path: '/team', icon: <HiOutlineUserGroup size={22} /> },
    { name: 'Workspace', path: '/workspace', icon: <HiOutlineDocumentText size={22} /> },
    { name: 'Meetings', path: '/meetings', icon: <HiOutlineChatAlt2 size={22} /> },
    { name: 'Reports', path: '/reports', icon: <HiOutlineChartBar size={22} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#1a1a2e] h-screen flex flex-col text-white fixed left-0 top-0 z-50 shadow-2xl transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-xl italic leading-none">SS</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-indigo-100">
            SkillSync
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-4 p-3.5 rounded-xl transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-700/40'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-indigo-400 transition-colors'}`}>
              {item.icon}
            </span>
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 bg-[#16162a]">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-4 p-3.5 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <HiOutlineLogout size={22} />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
