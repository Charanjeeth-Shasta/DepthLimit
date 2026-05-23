import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import Navbar from '../components/Navbar'
import { mockUser, mockStats } from '../services/mockData'

export default function Profile() {
  const navigate = useNavigate()
  const [name, setName] = useState(mockUser.name)
  const [email, setEmail] = useState(mockUser.email)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
                {mockUser.initial}
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

          <button onClick={handleSave}
            className={`px-6 py-2.5 rounded-lg font-dm font-medium text-sm transition-colors ${saved ? 'bg-success text-white' : 'bg-accent-teal hover:bg-accent-teal-bright text-white'}`}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-bg-surface border border-bg-border rounded-xl p-8 fade-up-3">
          <h2 className="font-syne font-semibold text-xl text-text-primary mb-6">Your Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Sessions', value: mockStats.totalSessions, color: 'text-accent-teal' },
              { label: 'Average Score', value: mockStats.avgScore, color: 'text-accent-blue' },
              { label: 'Best Score', value: mockStats.bestScore, color: 'text-success' },
              { label: 'Topics Mastered', value: mockStats.topicsMastered, color: 'text-warning' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-elevated rounded-xl p-5">
                <div className={`font-mono font-bold text-3xl ${color} mb-1`}>{value}</div>
                <div className="text-text-secondary text-sm font-dm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}