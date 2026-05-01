import { useDashboardStats, useTasks } from '../hooks/useApi';
import useAuthStore from '../store/authStore';

const StatCard = ({ label, value, accent }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
    <p className="text-xs text-zinc-500 mono mb-2 uppercase tracking-wider">{label}</p>
    <p className={`text-3xl font-semibold ${accent || 'text-white'}`}>{value ?? '—'}</p>
  </div>
);

const statusColors = {
  pending: 'bg-yellow-900 text-yellow-300 border-yellow-800',
  'in-progress': 'bg-blue-900 text-blue-300 border-blue-800',
  done: 'bg-green-900 text-green-300 border-green-800',
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const now = new Date();
  const recentTasks = tasks?.slice(0, 8) || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="mono text-xs text-zinc-500 mb-1">OVERVIEW</p>
        <h1 className="text-xl font-semibold text-white">
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
      </div>

      {statsLoading ? (
        <p className="text-zinc-500 text-sm">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Tasks" value={stats?.total} />
          <StatCard label="In Progress" value={stats?.inProgress} accent="text-blue-400" />
          <StatCard label="Pending" value={stats?.pending} accent="text-yellow-400" />
          <StatCard label="Completed" value={stats?.done} accent="text-green-400" />
        </div>
      )}

      <div>
        <p className="mono text-xs text-zinc-500 mb-4 uppercase tracking-wider">Recent Tasks</p>

        {tasksLoading ? (
          <p className="text-zinc-500 text-sm">Loading tasks...</p>
        ) : recentTasks.length === 0 ? (
          <p className="text-zinc-600 text-sm">No tasks yet.</p>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < now &&
                task.status !== 'done';

              return (
                <div
                  key={task._id}
                  className={`flex items-center justify-between bg-zinc-900 border rounded-lg px-4 py-3 ${
                    isOverdue ? 'border-red-800' : 'border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border mono ${statusColors[task.status]}`}
                    >
                      {task.status}
                    </span>
                    <span className={`text-sm truncate ${isOverdue ? 'text-red-400' : 'text-zinc-200'}`}>
                      {task.title}
                    </span>
                    {isOverdue && (
                      <span className="text-xs text-red-500 mono">overdue</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0 ml-4">
                    <span>{task.project?.name}</span>
                    {task.assignedTo && <span>{task.assignedTo.name}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
