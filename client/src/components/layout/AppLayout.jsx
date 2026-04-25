import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

const AppLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 flex-col space-y-4 font-inter">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f9fe] dark:bg-[#0f0f1a]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <Topbar />
        <main className="p-10 flex-1 overflow-y-auto dark:bg-[#0f0f1a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
