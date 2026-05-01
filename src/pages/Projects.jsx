import { useState } from 'react';
import { useProjects, useCreateProject, useUsers } from '../hooks/useApi';
import useAuthStore from '../store/authStore';

export default function Projects() {
  const { user } = useAuthStore();
  const { data: projects, isLoading } = useProjects();
  const { data: users } = useUsers();
  const createProject = useCreateProject();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', memberIds: [] });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleMember = (id) => {
    setForm((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(id)
        ? prev.memberIds.filter((m) => m !== id)
        : [...prev.memberIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }
    try {
      await createProject.mutateAsync(form);
      setForm({ name: '', description: '', memberIds: [] });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="mono text-xs text-zinc-500 mb-1">WORKSPACE</p>
          <h1 className="text-xl font-semibold text-white">Projects</h1>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded hover:bg-zinc-200 transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <p className="mono text-xs text-zinc-500 mb-4 uppercase tracking-wider">New Project</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Project Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="e.g. Website Redesign"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                placeholder="Optional"
              />
            </div>

            {users && users.length > 0 && (
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Add Members</label>
                <div className="flex flex-wrap gap-2">
                  {users.map((u) => (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => toggleMember(u._id)}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        form.memberIds.includes(u._id)
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={createProject.isPending}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-zinc-500 text-sm">Loading projects...</p>
      ) : projects?.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <p className="text-sm">No projects yet.</p>
          {user?.role === 'admin' && (
            <p className="text-xs mt-1">Create your first project above.</p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <div
              key={project._id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors"
            >
              <h3 className="text-white font-medium mb-1">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{project.description}</p>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                <span className="text-xs text-zinc-600">
                  by {project.createdBy?.name}
                </span>
                <span className="text-xs text-zinc-600 mono">
                  {project.members?.length} member{project.members?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
