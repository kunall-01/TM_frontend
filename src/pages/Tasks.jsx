import { useState } from 'react';
import { useTasks, useCreateTask, useUpdateTaskStatus, useProjects, useUsers } from '../hooks/useApi';
import useAuthStore from '../store/authStore';

const statusColors = {
  pending: 'bg-yellow-900 text-yellow-300 border-yellow-800',
  'in-progress': 'bg-blue-900 text-blue-300 border-blue-800',
  done: 'bg-green-900 text-green-300 border-green-800',
};

const statusOptions = ['pending', 'in-progress', 'done'];

export default function Tasks() {
  const { user } = useAuthStore();
  const [selectedProject, setSelectedProject] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    dueDate: '',
  });
  const [error, setError] = useState('');

  const { data: tasks, isLoading } = useTasks(selectedProject);
  const { data: projects } = useProjects();
  const { data: users } = useUsers();
  const createTask = useCreateTask();
  const updateStatus = useUpdateTaskStatus();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) {
      setError('Title and project are required');
      return;
    }
    try {
      await createTask.mutateAsync(form);
      setForm({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateStatus.mutateAsync({ id: taskId, status: newStatus });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const now = new Date();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="mono text-xs text-zinc-500 mb-1">WORK</p>
          <h1 className="text-xl font-semibold text-white">Tasks</h1>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded hover:bg-zinc-200 transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <p className="mono text-xs text-zinc-500 mb-4 uppercase tracking-wider">New Task</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Project</label>
                <select
                  name="projectId"
                  value={form.projectId}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                >
                  <option value="">Select project</option>
                  {projects?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Assign To</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                >
                  <option value="">Unassigned</option>
                  {users?.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                placeholder="Optional details"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={createTask.isPending}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-zinc-400">Filter by project:</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
        >
          <option value="">All Projects</option>
          {projects?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-zinc-500 text-sm">Loading tasks...</p>
      ) : tasks?.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <p className="text-sm">No tasks found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks?.map((task) => {
            const isOverdue =
              task.dueDate && new Date(task.dueDate) < now && task.status !== 'done';

            return (
              <div
                key={task._id}
                className={`bg-zinc-900 border rounded-lg px-4 py-4 ${
                  isOverdue ? 'border-red-800' : 'border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded border mono ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                      <span className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                        {task.title}
                      </span>
                      {isOverdue && (
                        <span className="text-xs text-red-500 mono">OVERDUE</span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-zinc-500 mt-1">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                      <span>{task.project?.name}</span>
                      {task.assignedTo && <span>→ {task.assignedTo.name}</span>}
                      {task.dueDate && (
                        <span className={isOverdue ? 'text-red-500' : ''}>
                          due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
