import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, TrendingDown, Upload, Trash2, FileText, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ModeBadge from '../components/ModeBadge'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { mockStats, mockSessions, mockResumes, mockUser } from '../services/mockData'

function ScoreColor(score) {
  if (score >= 75) return 'text-success'
  if (score >= 50) return 'text-warning'
  return 'text-danger'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    api.get('/api/resume/list').then(r => setResumes(r.data.resumes || [])).catch(() => {});
    api.get('/api/interview/sessions').then(r => setSessions(r.data.sessions || [])).catch(() => {});
  }, []);

  return (
    <div className="page-bg min-h-screen">
      <div className="glow-bg" />
      <Navbar />
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10 fade-up-1">
          <div>
            <h1 className="font-syne font-bold text-3xl text-text-primary mb-1">
              Good morning, {user?.name?.split(' ')[0] || 'there'}.
            </h1>
            <p className="text-text-secondary font-dm">Ready for today's session?</p>
          </div>
          <button onClick={() => navigate('/setup')}
            className="flex items-center gap-2 px-5 py-3 bg-accent-teal hover:bg-accent-teal-bright text-white font-dm font-medium text-sm rounded-lg transition-colors">
            <Plus size={16} /> Start New Interview <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 fade-up-2">
          {[
            { label: 'Total Sessions', value: sessions.length, color: 'text-accent-teal', trend: '+2', up: true },
            { label: 'Average Score', value: sessions.length ? Math.round(sessions.reduce((a,s) => a + (s.totalScore||0), 0) / sessions.length) : 0, color: 'text-accent-blue', trend: '+3%', up: true },
            { label: 'Best Score', value: sessions.length ? Math.max(...sessions.map(s => s.totalScore||0)) : 0, color: 'text-success', trend: '+5%', up: true },
            { label: 'Topics Mastered', value: [...new Set(sessions.flatMap(s => s.skills||[]))].length, color: 'text-warning', trend: '-1', up: false },
          ].map(({ label, value, color, trend, up }) => (
            <div key={label} className="bg-bg-surface border border-bg-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className={`font-mono font-bold text-4xl ${color} mb-1`}>{value}</div>
              <div className="text-text-secondary text-sm font-dm mb-3">{label}</div>
              <div className={`flex items-center gap-1 text-xs font-dm ${up ? 'text-success' : 'text-danger'}`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend} this week
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10 fade-up-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-xl text-text-primary">Recent Sessions</h2>
            <button className="text-accent-teal hover:text-accent-teal-bright text-sm font-dm transition-colors">View all</button>
          </div>
          <div className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden">
            {sessions.map((session, i) => (
              <div key={session._id}
                className={`flex items-center justify-between px-6 py-4 hover:bg-bg-elevated transition-colors ${i < sessions.length - 1 ? 'border-b border-bg-border' : ''}`}>
                <div className="flex-1">
                  <div className="font-dm font-medium text-text-primary text-sm">{session.jobTitle || 'Technical Interview'}</div>
                  <div className="text-text-tertiary text-xs mt-0.5">{new Date(session.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <ModeBadge mode={session.mode} />
                  <span className={`font-mono font-bold text-sm ${ScoreColor(session.totalScore)}`}>{session.totalScore}</span>
                  <button onClick={() => navigate(`/report/${session._id}/detailed`)}
                    className="text-xs font-dm text-text-secondary border border-bg-border hover:border-text-tertiary px-3 py-1.5 rounded-lg transition-colors">
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up-4">
          <h2 className="font-syne font-semibold text-xl text-text-primary mb-4">Your Resumes</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-bg-surface border border-bg-border rounded-xl p-4 min-w-52 flex-shrink-0 hover:border-accent-teal/50 transition-colors">
                <FileText size={20} className="text-accent-teal mb-3" />
                <div className="font-dm text-sm text-text-primary mb-1 truncate">{resume.originalName}</div>
                <div className="text-text-tertiary text-xs mb-3">{new Date(resume.createdAt).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/setup', { state: { resumeId: resume._id } })} className="text-xs font-dm text-accent-teal border border-accent-teal/30 hover:bg-accent-teal/10 px-3 py-1 rounded-lg transition-colors">Use</button>
                  <button onClick={async () => { if (confirm('Delete this resume?')) { await api.delete(`/api/resume/${resume._id}`); setResumes(resumes.filter(r => r._id !== resume._id)); } }} className="p-1 text-text-tertiary hover:text-danger transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            <button onClick={() => document.getElementById('dashboard-resume-upload').click()} className="border-2 border-dashed border-bg-border rounded-xl p-4 min-w-52 flex-shrink-0 flex flex-col items-center justify-center gap-2 hover:border-accent-teal/50 transition-colors text-text-tertiary hover:text-accent-teal">
              <Upload size={20} />
              <span className="text-sm font-dm">Upload Resume</span>
            </button>
            <input type="file" id="dashboard-resume-upload" accept=".pdf,.docx" onChange={(e) => { if (e.target.files?.[0]) { const form = new FormData(); form.append('resume', e.target.files[0]); api.post('/api/resume/upload', form).then(r => setResumes([...resumes, r.data.resume])).catch(() => alert('Failed to upload resume')); } }} className="hidden" />
          </div>
        </div>
      </main>
    </div>
  )
}