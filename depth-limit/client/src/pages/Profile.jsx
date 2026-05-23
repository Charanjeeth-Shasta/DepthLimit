import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Profile() {
  const navigate = useNavigate()
  const { user, refreshUserProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setError('')
      setLoading(true)
      
      if (!name.trim()) {
        setError('Name cannot be empty')
        return
      }
      
      if (name.length < 2 || name.length > 100) {
        setError('Name must be 2-100 characters')
        return
      }

      await api.put('/api/auth/profile', { name, email })
      
      // Refresh user data from context
      await refreshUserProfile()
      
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  const userInitial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <div className="page-bg min-h-screen">
      <div className="glow-bg" />
      <Navbar />
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-dm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="font-syne font-bold text-3xl text-text-primary mb-8 fade-up-1">Profile</h1>

        <div className="bg-bg-surface border border-bg-border rounded-xl p-8 mb-6 fade-up-2">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-accent-teal flex items-center justify-center text-white font-syne font-bold text-3xl">
                {userInitial}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-bg-surface border border-bg-border rounded-full flex items-center justify-center hover:bg-bg-elevated transition-colors">
                <Camera size={12} className="text-text-secondary" />
              </button>
            </div>
            <div>
              <div className="font-syne font-semibold text-text-primary text-xl">{name}</div>
              <div className="text-text-secondary text-sm font-dm">{email}</div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-dm text-text-secondary mb-1.5">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary" />
            </div>
            <div>
              <label className="block text-sm font-dm text-text-secondary mb-1.5">Email Address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary" />
            </div>
          </div>

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <button onClick={handleSave} disabled={loading}
            className={`px-6 py-2.5 rounded-lg font-dm font-medium text-sm transition-colors disabled:opacity-50 ${saved ? 'bg-success text-white' : 'bg-accent-teal hover:bg-accent-teal-bright text-white'}`}>
            {saved ? '✓ Saved' : loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  )
}