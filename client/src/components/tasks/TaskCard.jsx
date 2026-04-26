import { HiOutlineUser, HiOutlineClock, HiOutlineTag, HiOutlineSparkles } from 'react-icons/hi';

const TaskCard = ({ task, onAiAssign, matchingTaskId, onFileUpload, uploadingTaskId, columnId }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case 'todo': return 'bg-gray-100 text-gray-500';
      case 'in-progress': return 'bg-indigo-100 text-indigo-600';
      case 'done': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:translate-y-[-4px] transition-all group relative overflow-hidden">
      {/* Accent Line */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${
        task.status === 'todo' ? 'bg-gray-200' : 
        task.status === 'in-progress' ? 'bg-indigo-500' : 'bg-green-500'
      }`} />

      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor()}`}>
          {task.status}
        </span>
        <div className="flex -space-x-2">
            {task.assignedTo ? (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs border-2 border-white">
                    {task.assignedTo.name.charAt(0)}
                </div>
            ) : (
                <button
                  onClick={() => onAiAssign(task._id)}
                  disabled={matchingTaskId === task._id}
                  className="text-xs px-2 py-1 rounded-lg 
                    bg-indigo-500/20 text-indigo-400 
                    hover:bg-indigo-500/30 transition-all
                    disabled:opacity-50"
                >
                  {matchingTaskId === task._id 
                    ? '🔄 Matching...' 
                    : '🤖 AI Match'}
                </button>
            )}
        </div>
      </div>

      <h4 className="text-lg font-black text-gray-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
        {task.title}
      </h4>
      <p className="text-sm text-gray-400 font-medium mb-4 line-clamp-2">
        {task.description || 'No description provided.'}
      </p>

      {task.assignedTo && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-indigo-500 
            flex items-center justify-center text-xs text-white">
            {task.assignedTo?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-400">
            {task.assignedTo?.name}
          </span>
        </div>
      )}

      {/* Upload button for inprogress tasks */}
      {columnId === 'inprogress' && (
        <label className="flex items-center gap-1 cursor-pointer
          text-xs px-2 py-1 rounded-lg w-full mb-4
          bg-green-500/20 text-green-400 
          hover:bg-green-500/30 transition-all">
          <input
            type="file"
            className="hidden"
            accept="*/*"
            onChange={(e) => onFileUpload(task._id, e.target.files[0])}
          />
          {uploadingTaskId === task._id 
            ? '⏳ Uploading...' 
            : '📤 Submit Work'}
        </label>
      )}

      {task.submittedFile && (
        <div className="mt-2 flex items-center gap-2 
          bg-green-500/10 rounded-lg px-2 py-1">
          <span className="text-xs">📎</span>
          <span className="text-xs text-green-400 truncate">
            {task.submittedFile.filename}
          </span>
        </div>
      )}

      <div className="space-y-3 pt-4 border-t border-gray-50">
        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <HiOutlineTag size={14} className="mr-2 text-indigo-300" />
            <span>Target Skill: <span className="text-gray-900">{task.skillRequired || 'General'}</span></span>
        </div>
        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <HiOutlineClock size={14} className="mr-2 text-indigo-300" />
            <span>Deadline: <span className="text-gray-900">{new Date(task.deadline).toLocaleDateString() || 'No date'}</span></span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
