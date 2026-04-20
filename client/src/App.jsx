import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TeamPage from './pages/TeamPage';
import TaskBoardPage from './pages/TaskBoardPage';
import WorkspacePage from './pages/WorkspacePage';
import MeetingsPage from './pages/MeetingsPage';
import ReportsPage from './pages/ReportsPage';
import SkillProfilePage from './pages/SkillProfilePage';
import TeamSetupPage from './pages/TeamSetupPage';

// Placeholder Components for missing pages
const Placeholder = ({ name }) => (
  <div className="bg-white p-12 rounded-3xl shadow-xl shadow-indigo-100/20 border border-gray-100 flex flex-col items-center justify-center space-y-6">
    <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-3xl flex items-center justify-center animate-pulse">
        <span className="text-4xl font-bold">PI</span>
    </div>
    <div className="text-center">
        <h1 className="text-2xl font-black text-gray-800 mb-2">{name} Intelligence</h1>
        <p className="text-gray-500 font-medium">Preparing advanced analytics for this module...</p>
    </div>
    <div className="h-1.5 w-48 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 animate-loading-bar w-1/3"></div>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/tasks" element={<TaskBoardPage />} />
                <Route path="/workspace" element={<WorkspacePage />} />
                <Route path="/meetings" element={<MeetingsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/skill-profile" element={<SkillProfilePage />} />
                <Route path="/team-setup" element={<TeamSetupPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" toastOptions={{
          style: {
              borderRadius: '16px',
              background: '#1a1a2e',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 24px'
          }
      }} />
    </>
  );
}

export default App;
