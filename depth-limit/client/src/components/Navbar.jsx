import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-bg-surface border-b border-bg-border shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="font-syne font-bold text-xl text-text-primary"
        >
          Depth<span className="text-accent-teal">Limit</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-bg-elevated rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent-teal flex items-center justify-center text-white font-syne font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-dm text-text-secondary">{user?.name}</span>
            <ChevronDown size={14} className="text-text-tertiary" />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-bg-surface border border-bg-border rounded-xl shadow-xl z-50 overflow-hidden">
              {[
                { icon: User, label: 'Profile', path: '/profile' },
                { icon: Settings, label: 'Settings', path: '/settings' },
                { icon: LogOut, label: 'Sign out', path: '/login', danger: true },
              ].map(({ icon: Icon, label, path, danger }) => (
                <button
                  key={label}
                  onClick={() => { setOpen(false);
                     if (danger) { logout(); navigate(path); }
                     else navigate(path); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-dm hover:bg-bg-elevated transition-colors ${
                    danger ? 'text-danger' : 'text-text-secondary'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}