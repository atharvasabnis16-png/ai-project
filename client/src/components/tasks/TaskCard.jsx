import { HiOutlineUser, HiOutlineClock, HiOutlineTag, HiOutlineSparkles } from 'react-icons/hi';

const TaskCard = ({ task, onAiAssign }) => {
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
            {task.assignee ? (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs border-2 border-white">
                    {task.assignee.name.charAt(0)}
                </div>
            ) : (
                <button 
                  onClick={() => onAiAssign(task._id)}
                  className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all border border-gray-100"
                  title="AI Assignment"
                >
                    <HiOutlineSparkles size={16} />
                </button>
            )}
        </div>
      </div>

      <h4 className="text-lg font-black text-gray-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
        {task.title}
      </h4>
      <p className="text-sm text-gray-400 font-medium mb-6 line-clamp-2">
        {task.description || 'No description provided.'}
      </p>

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
