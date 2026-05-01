import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="mono text-sm font-medium text-white tracking-wider">
            TEAMTASK
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isActive('/dashboard')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isActive('/projects')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/tasks"
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isActive('/tasks')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tasks
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">
            {user?.name}
            <span className="ml-2 mono text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {user?.role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
