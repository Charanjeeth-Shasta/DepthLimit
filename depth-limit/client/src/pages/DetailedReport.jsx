import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Flag, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import ScoreBadge from '../components/ScoreBadge'
import TopicPill from '../components/TopicPill'
import SignalBar from '../components/SignalBar'
import api from '../services/api'

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-bg-surface border border-bg-border rounded-xl p-6 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-accent-teal font-bold">Q{index + 1}</span>
          <TopicPill topic={q.topic || 'Technical'} />
          {q.flagged && <span className="flex items-center gap-1 text-warning text-xs font-dm"><Flag size={12} /> Flagged by you</span>}
        </div>
        <ScoreBadge score={q.score || 0} />
      </div>
      <div className="bg-bg-elevated rounded-lg p-4 mb-4">
        <p className="font-syne text-text-primary text-sm leading-relaxed">{q.question}</p>
      </div>
      <div className="mb-4">
        <div className="text-text-tertiary text-xs font-dm mb-1">Your Answer</div>
        <p className="text-text-secondary font-dm text-sm leading-relaxed">{q.answer || 'No answer provided'}</p>
      </div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-text-tertiary text-xs font-dm mb-3 hover:text-text-secondary transition-colors">
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Score Breakdown
      </button>
      {open && (
        <div>
          <div className="space-y-3 mb-5">
            <div>
              <div className="flex items-center gap-2 text-text-secondary text-xs font-dm mb-1">Score: {q.score} / 10</div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <SignalBar label="Score out of 10" value={(q.score || 0) / 10} />
          </div>
          {q.feedback && (
            <div className="space-y-3 border-t border-bg-border pt-3 mt-3">
              {q.feedback.strengths && (
                <div>
                  <div className="flex items-center gap-2 text-success text-xs font-dm mb-1"><CheckCircle size={14} /> Strengths</div>
                  <p className="text-text-secondary font-dm text-sm">{q.feedback.strengths}</p>
                </div>
              )}
              {q.feedback.weaknesses && (
                <div>
                  <div className="flex items-center gap-2 text-warning text-xs font-dm mb-1"><AlertTriangle size={14} /> Needs Work</div>
                  <p className="text-text-secondary font-dm text-sm">{q.feedback.weaknesses}</p>
                </div>
              )}
              {q.feedback.gaps && (
                <div>
                  <div className="flex items-center gap-2 text-danger text-xs font-dm mb-1"><XCircle size={14} /> Gaps Found</div>
                  <p className="text-text-secondary font-dm text-sm">{q.feedback.gaps}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DetailedReport() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/interview/${sessionId}`)
      .then(r => {
        setSession(r.data.session);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div className="page-bg min-h-screen flex items-center justify-center"><p className="text-text-secondary">Loading report...</p></div>;

  if (!session) return <div className="page-bg min-h-screen flex items-center justify-center"><p className="text-danger">Session not found</p></div>;

  const totalMinutes = Math.floor((new Date() - new Date(session.createdAt)) / 60000);

  return (
    <div className="page-bg min-h-screen">
      <div className="glow-bg" />
      <Navbar />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="text-text-tertiary text-xs font-dm mb-4 fade-up-1">
          <button onClick={() => navigate('/dashboard')} className="hover:text-text-secondary transition-colors">Dashboard</button>
          {' > '} Sessions {' > '} Detailed Report
        </div>
        <div className="flex items-start justify-between mb-6 fade-up-2">
          <div>
            <h1 className="font-syne font-bold text-3xl text-text-primary mb-1">{session.skills?.[0] || 'Technical'} — Interview</h1>
            <p className="text-text-secondary font-dm text-sm">{new Date(session.createdAt).toLocaleDateString()} · {totalMinutes} minutes</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-accent-teal text-white font-dm text-sm">Detailed Report</button>
            <button onClick={() => navigate(`/report/${sessionId}/summary`)} className="px-4 py-2 rounded-lg border border-bg-border text-text-secondary font-dm text-sm hover:border-text-tertiary transition-colors">Summary Report</button>
          </div>
        </div>
        <div className="fade-up-3">
          {session.answers?.map((q, i) => <QuestionCard key={i} q={q} index={i} />)}
        </div>
        <div className="mt-8 flex gap-4">
          <button onClick={() => navigate('/setup')} className="px-6 py-3 rounded-lg bg-accent-teal hover:bg-accent-teal-bright text-white font-dm font-medium text-sm transition-colors">Start New Interview</button>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg border border-bg-border text-text-secondary font-dm text-sm hover:border-text-tertiary transition-colors">Back to Dashboard</button>
        </div>
      </main>
    </div>
  )
}