import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ReportsPage() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!user?.teamId) { setLoading(false); return; }
        const { data } = await api.get('/reports');
        if (data.success) setReport(data.report);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [user?.teamId]);

  if (!user?.teamId) {
    return (
      <div className="flex flex-col items-center 
        justify-center h-96 text-center">
        <p className="text-5xl mb-4">📊</p>
        <h3 className="text-xl font-bold text-white mb-2">
          No Team Yet
        </h3>
        <p className="text-gray-400">
          Join a team to see reports
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-indigo-400 animate-pulse">
          Loading reports...
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center 
        justify-center h-96 text-center">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-white font-semibold">
          No report data yet
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Start assigning tasks and scheduling meetings
        </p>
      </div>
    );
  }

  const getCompletionColor = (pct) => {
    if (pct >= 75) return 'from-green-500 to-emerald-500';
    if (pct >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getCompletionBadge = (pct) => {
    if (pct >= 75) return { 
      label: 'Excellent', color: 'text-green-400 bg-green-400/10' 
    };
    if (pct >= 40) return { 
      label: 'In Progress', color: 'text-yellow-400 bg-yellow-400/10' 
    };
    return { 
      label: 'Needs Work', color: 'text-red-400 bg-red-400/10' 
    };
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          📊 Team Reports
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {report.teamName} · Code: {report.teamCode}
        </p>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a2e] border border-indigo-500/20 
          rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-white">
            {report.totalMembers}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            👥 Members
          </p>
        </div>
        <div className="bg-[#1a1a2e] border border-indigo-500/20 
          rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-indigo-400">
            {report.totalTasks}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            📋 Total Tasks
          </p>
        </div>
        <div className="bg-[#1a1a2e] border border-indigo-500/20 
          rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">
            {report.completedTasks}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            ✅ Completed
          </p>
        </div>
        <div className="bg-[#1a1a2e] border border-indigo-500/20 
          rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">
            {report.totalMeetings}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            📅 Meetings
          </p>
        </div>
      </div>

      {/* Team Completion Bar */}
      <div className="bg-[#1a1a2e] border border-indigo-500/20 
        rounded-2xl p-5 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-bold">
            Overall Team Progress
          </h2>
          <span className="text-2xl font-bold text-white">
            {report.teamCompletion}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className={`bg-gradient-to-r 
              ${getCompletionColor(report.teamCompletion)} 
              h-4 rounded-full transition-all duration-700`}
            style={{ width: `${report.teamCompletion}%` }}
          />
        </div>
        <div className="flex justify-between text-xs 
          text-gray-400 mt-2">
          <span>{report.completedTasks} completed</span>
          <span>{report.totalTasks} total tasks</span>
        </div>
      </div>

      {/* Member Reports */}
      <h2 className="text-lg font-bold text-white mb-4">
        👤 Member Performance
      </h2>
      <div className="space-y-4">
        {(report.members || []).map((member) => {
          const badge = getCompletionBadge(member.completion);
          const isMe = member._id === user?._id;
          return (
            <div key={member._id}
              className={`bg-[#1a1a2e] rounded-2xl p-5
                border transition-all
                ${isMe 
                  ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' 
                  : 'border-indigo-500/20'}`}>
              
              {/* Member Header */}
              <div className="flex justify-between 
                items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full 
                    bg-gradient-to-br from-indigo-500 
                    to-purple-500 flex items-center 
                    justify-center text-white font-bold">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold 
                      flex items-center gap-2">
                      {member.name}
                      {isMe && (
                        <span className="text-xs bg-indigo-500/20 
                          text-indigo-300 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {member.email}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 
                  rounded-full font-semibold ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 
                gap-3 mb-4">
                <div className="bg-black/20 rounded-xl p-3 
                  text-center">
                  <p className="text-xl font-bold text-white">
                    {member.totalTasks}
                  </p>
                  <p className="text-xs text-gray-400">
                    Total Tasks
                  </p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 
                  text-center">
                  <p className="text-xl font-bold text-green-400">
                    {member.completedTasks}
                  </p>
                  <p className="text-xs text-gray-400">
                    Completed
                  </p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 
                  text-center">
                  <p className="text-xl font-bold text-indigo-400">
                    {member.meetingsAttended}
                  </p>
                  <p className="text-xs text-gray-400">
                    Meetings Attended
                  </p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 
                  text-center">
                  <p className="text-xl font-bold text-red-400">
                    {member.meetingsMissed}
                  </p>
                  <p className="text-xs text-gray-400">
                    Meetings Missed
                  </p>
                </div>
              </div>

              {/* Completion Bar */}
              <div>
                <div className="flex justify-between 
                  text-xs mb-1">
                  <span className="text-gray-400">
                    Task Completion
                  </span>
                  <span className="text-white font-bold">
                    {member.completion}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 
                  rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r 
                      ${getCompletionColor(member.completion)} 
                      h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${member.completion}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {member.completedTasks}/{member.totalTasks} tasks done
                </p>
              </div>

              {/* Skills */}
              {member.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.skills.map((skill, i) => (
                    <span key={i}
                      className="text-xs bg-indigo-500/10 
                        text-indigo-300 px-2 py-0.5 rounded-full">
                      {typeof skill === 'string' 
                        ? skill : skill.name || ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
