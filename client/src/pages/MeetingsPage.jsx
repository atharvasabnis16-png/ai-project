import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [form, setForm] = useState({ 
    title: '', date: '', time: '', meetLink: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [teamData, setTeamData] = useState(null);

  const isLeader = 
  String(teamData?.leader?._id || teamData?.leader || '') === 
  String(user?._id || '');

  useEffect(() => {
    fetchMeetings();
    fetchTeam();
  }, [user?.teamId]);

  const fetchTeam = async () => {
    try {
      if (!user?.teamId) return;
      const { data } = await api.get('/teams/my-team');
      if (data.team || data) {
        setTeamData(data.team || data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeetings = async () => {
    try {
      if (!user?.teamId) { setLoading(false); return; }
      const { data } = await api.get('/meetings');
      if (data.success) {
        setMeetings(Array.isArray(data.meetings) 
          ? data.meetings : []);
      }
    } catch (err) {
      console.error(err);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    try {
      if (!form.title || !form.date || 
          !form.time || !form.meetLink) {
        alert('Please fill all fields');
        return;
      }
      setSubmitting(true);
      const dateTime = new Date(`${form.date}T${form.time}`);
      const { data } = await api.post('/meetings/schedule', {
        title: form.title,
        date: dateTime,
        meetLink: form.meetLink
      });
      if (data.success) {
        setMeetings(prev => [...prev, data.meeting]);
        setShowScheduleModal(false);
        setForm({ title: '', date: '', time: '', meetLink: '' });
      }
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAttendance = async (meetingId, status) => {
    try {
      await api.put('/meetings/attendance', { meetingId, status });
      fetchMeetings();
    } catch (err) {
      console.error(err);
    }
  };

  const now = new Date();
  const upcoming = meetings.filter(m => new Date(m.date) > now);
  const past = meetings.filter(m => new Date(m.date) <= now);

  const getMeetLink = (link) => {
    if (!link) return '#';
    if (link.startsWith('http')) return link;
    return `https://meet.google.com/${link}`;
  };

  const formatDate = (date) => new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getMyAttendance = (meeting) => {
    const record = meeting.attendees?.find(
      a => a.user === user?._id || a.user?._id === user?._id
    );
    return record?.status || 'pending';
  };

  if (!user?.teamId) {
    return (
      <div className="flex flex-col items-center 
        justify-center h-96 text-center">
        <p className="text-5xl mb-4">📅</p>
        <h3 className="text-xl font-bold text-white mb-2">
          No Team Yet
        </h3>
        <p className="text-gray-400">
          Join a team to see meetings
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            📅 Meetings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        {isLeader && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-gradient-to-r 
              from-indigo-500 to-purple-500 
              text-white rounded-xl font-semibold
              hover:opacity-90 transition-all">
            + Schedule Meeting
          </button>
        )}
        {!isLeader && (
          <p className="text-xs text-gray-500 italic">
            Only team lead can schedule meetings
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-indigo-400 animate-pulse">
            Loading meetings...
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming Meetings */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 
              flex items-center gap-2">
              🟢 Upcoming Meetings
            </h2>
            {upcoming.length === 0 ? (
              <div className="bg-[#1a1a2e] border border-indigo-500/20 
                rounded-2xl p-8 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-white font-semibold">
                  No meetings scheduled yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {isLeader 
                    ? 'Click "Schedule Meeting" to add one'
                    : 'Contact your team lead to schedule a meeting'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map(meeting => (
                  <div key={meeting._id}
                    className="bg-[#1a1a2e] border 
                      border-indigo-500/20 rounded-2xl p-5">
                    <div className="flex justify-between 
                      items-start">
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {meeting.title}
                        </h3>
                        <p className="text-indigo-400 text-sm mt-1">
                          🕐 {formatDate(meeting.date)}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Scheduled by {meeting.scheduledBy?.name}
                        </p>
                      </div>
                      <a
                        href={getMeetLink(meeting.meetLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500/20 
                          text-green-400 rounded-xl text-sm 
                          font-semibold hover:bg-green-500/30 
                          transition-all flex items-center gap-2">
                        🎥 Join Meeting
                      </a>
                    </div>
                    <div className="mt-3 p-3 bg-black/20 
                      rounded-xl">
                      <p className="text-xs text-gray-400">
                        Meet Link:
                      </p>
                      <p className="text-xs text-indigo-300 
                        break-all mt-1">
                        {meeting.meetLink}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Meetings Log */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 
              flex items-center gap-2">
              📋 Meeting Log
            </h2>
            {past.length === 0 ? (
              <div className="bg-[#1a1a2e] border border-indigo-500/20 
                rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-sm">
                  No past meetings yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {past.map(meeting => {
                  const myStatus = getMyAttendance(meeting);
                  return (
                    <div key={meeting._id}
                      className="bg-[#1a1a2e] border 
                        border-indigo-500/10 rounded-2xl p-4">
                      <div className="flex justify-between 
                        items-center">
                        <div>
                          <h3 className="text-white font-semibold">
                            {meeting.title}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {formatDate(meeting.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {myStatus === 'attended' && (
                            <span className="px-3 py-1 
                              bg-green-500/20 text-green-400 
                              rounded-full text-xs font-semibold">
                              ✅ Attended
                            </span>
                          )}
                          {myStatus === 'missed' && (
                            <span className="px-3 py-1 
                              bg-red-500/20 text-red-400 
                              rounded-full text-xs font-semibold">
                              ❌ Missed
                            </span>
                          )}
                          {myStatus === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMarkAttendance(
                                  meeting._id, 'attended'
                                )}
                                className="px-3 py-1 bg-green-500/20 
                                  text-green-400 rounded-full 
                                  text-xs hover:bg-green-500/30">
                                ✅ Attended
                              </button>
                              <button
                                onClick={() => handleMarkAttendance(
                                  meeting._id, 'missed'
                                )}
                                className="px-3 py-1 bg-red-500/20 
                                  text-red-400 rounded-full 
                                  text-xs hover:bg-red-500/30">
                                ❌ Missed
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 
          backdrop-blur-sm z-50 flex items-center 
          justify-center p-4">
          <div className="bg-[#1a1a2e] border border-indigo-500/30 
            rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-bold text-xl mb-6">
              📅 Schedule a Meeting
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Standup"
                  value={form.title}
                  onChange={e => setForm({
                    ...form, title: e.target.value
                  })}
                  className="w-full mt-1 bg-black/30 border 
                    border-indigo-500/30 rounded-xl px-4 py-2 
                    text-white placeholder-gray-500 
                    focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({
                    ...form, date: e.target.value
                  })}
                  className="w-full mt-1 bg-black/30 border 
                    border-indigo-500/30 rounded-xl px-4 py-2 
                    text-white focus:outline-none 
                    focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">
                  Time
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm({
                    ...form, time: e.target.value
                  })}
                  className="w-full mt-1 bg-black/30 border 
                    border-indigo-500/30 rounded-xl px-4 py-2 
                    text-white focus:outline-none 
                    focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">
                  Google Meet Link or Code
                </label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={form.meetLink}
                  onChange={e => setForm({
                    ...form, meetLink: e.target.value
                  })}
                  className="w-full mt-1 bg-black/30 border 
                    border-indigo-500/30 rounded-xl px-4 py-2 
                    text-white placeholder-gray-500 
                    focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2 border border-gray-600 
                  text-gray-400 rounded-xl hover:border-gray-400 
                  transition-all">
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={submitting}
                className="flex-1 py-2 bg-gradient-to-r 
                  from-indigo-500 to-purple-500 text-white 
                  rounded-xl font-semibold hover:opacity-90 
                  disabled:opacity-50 transition-all">
                {submitting ? 'Scheduling...' : 'Schedule →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
