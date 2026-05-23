import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import TopicPill from '../components/TopicPill'
import api from '../services/api'

function AnimatedScore({ target }) {
  const [score, setScore] = useState(0)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  useEffect(() => {
    let start = 0
    const step = (target / 1200) * 16
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setScore(target); clearInterval(timer) }
      else setScore(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return (
    <div className="flex flex-col items-center mb-10">
      <div className="relative w-40 h-40 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-border)" strokeWidth="8" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-5xl text-text-primary">{score}</span>
        </div>
      </div>
      <span className="text-text-secondary font-dm text-sm">Overall Score (0-100)</span>
    </div>
  )
}

export default function SummaryReport() {
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
  const overallScore = Math.round((session.totalScore / (session.answers?.length || 1)) * 10) || 0;
  const avgScore = session.totalScore || 0;

  // Aggregate feedback from all answers - deduplicate
  const allFeedback = (session.answers || []).reduce((acc, answer) => {
    if (answer.feedback) {
      if (answer.feedback.strengths) acc.strengths.add(answer.feedback.strengths);
      if (answer.feedback.weaknesses) acc.weaknesses.add(answer.feedback.weaknesses);
      if (answer.feedback.gaps) acc.gaps.add(answer.feedback.gaps);
    }
    return acc;
  }, { strengths: new Set(), weaknesses: new Set(), gaps: new Set() });

  // Convert sets to arrays
  const uniqueFeedback = {
    strengths: Array.from(allFeedback.strengths),
    weaknesses: Array.from(allFeedback.weaknesses),
    gaps: Array.from(allFeedback.gaps)
  };

  // Categorize skills by performance
  const skillsByScore = (session.answers || []).reduce((acc, q) => {
    const skill = q.topic || 'General';
    const score = q.score || 0;
    if (!acc[skill]) acc[skill] = [];
    acc[skill].push(score);
    return acc;
  }, {});

  const strong = Object.entries(skillsByScore)
    .filter(([_, scores]) => scores.reduce((a, b) => a + b, 0) / scores.length >= 7)
    .map(([skill]) => skill);

  const needsWork = Object.entries(skillsByScore)
    .filter(([_, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return avg >= 4 && avg < 7;
    })
    .map(([skill]) => skill);

  const gaps = Object.entries(skillsByScore)
    .filter(([_, scores]) => scores.reduce((a, b) => a + b, 0) / scores.length < 4)
    .map(([skill]) => skill);

  return (
    <div className="page-bg min-h-screen">
      <div className="glow-bg" />
      <Navbar />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="text-text-tertiary text-xs font-dm mb-4 fade-up-1">
          <button onClick={() => navigate('/dashboard')} className="hover:text-text-secondary transition-colors">Dashboard</button>
          {' > '} Sessions {' > '} Summary Report
        </div>
        <div className="flex items-start justify-between mb-8 fade-up-2">
          <div>
            <h1 className="font-syne font-bold text-3xl text-text-primary mb-1">{session.skills?.[0] || 'Technical'} Interview</h1>
            <p className="text-text-secondary font-dm text-sm">{new Date(session.createdAt).toLocaleDateString()} · {totalMinutes} minutes</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/report/${sessionId}/detailed`)} className="px-4 py-2 rounded-lg border border-bg-border text-text-secondary font-dm text-sm hover:border-text-tertiary transition-colors">Detailed Report</button>
            <button className="px-4 py-2 rounded-lg bg-accent-teal text-white font-dm text-sm">Summary Report</button>
          </div>
        </div>
        <div className="fade-up-3">
          <AnimatedScore target={overallScore} />
          <div className="mb-8">
            <h2 className="font-syne font-bold text-xl text-text-primary mb-4">Knowledge Map</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '✅ Strengths', items: uniqueFeedback.strengths, header: 'text-success' },
                { label: '⚠️ Needs Work', items: uniqueFeedback.weaknesses, header: 'text-warning' },
                { label: '❌ Gaps Found', items: uniqueFeedback.gaps, header: 'text-danger' },
              ].map(({ label, items, header }) => (
                <div key={label} className="bg-bg-surface border border-bg-border rounded-xl p-4">
                  <div className={`font-dm font-medium text-sm mb-3 ${header}`}>{label}</div>
                  <div className="space-y-2">
                    {items.length > 0 ? items.map((item, idx) => (
                      <p key={idx} className="text-text-secondary text-xs leading-relaxed">{item}</p>
                    )) : <p className="text-text-tertiary text-xs">None</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="font-syne font-bold text-xl text-text-primary mb-4">Session Statistics</h2>
            <div className="space-y-3">
              <div className="bg-bg-surface border border-bg-border border-l-4 rounded-xl p-4 flex items-start gap-3" style={{ borderLeftColor: '#DC2626' }}>
                <AlertTriangle size={16} className="text-danger shrink-0 mt-0.5" />
                <p className="font-dm text-text-secondary text-sm">Total Questions: {session.answers?.length || 0}</p>
              </div>
              <div className="bg-bg-surface border border-bg-border border-l-4 rounded-xl p-4 flex items-start gap-3" style={{ borderLeftColor: '#2563EB' }}>
                <TrendingUp size={16} className="text-accent-blue shrink-0 mt-0.5" />
                <p className="font-dm text-text-secondary text-sm">Average Score: {avgScore.toFixed(1)} / 10</p>
              </div>
            </div>
          </div>
          <div className="mb-10 bg-bg-surface border border-bg-border border-l-4 rounded-xl p-6 shadow-sm" style={{ borderLeftColor: '#0D9488' }}>
            <div className="text-accent-teal font-dm font-medium text-sm mb-4">Overall Feedback</div>
            <div className="space-y-4">
              {uniqueFeedback.strengths.length > 0 && (
                <div>
                  <p className="font-syne text-text-primary text-sm font-medium mb-2">Your Strengths:</p>
                  <ul className="space-y-1">
                    {uniqueFeedback.strengths.map((item, idx) => (
                      <li key={idx} className="font-dm text-text-secondary text-sm leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {uniqueFeedback.weaknesses.length > 0 && (
                <div>
                  <p className="font-syne text-text-primary text-sm font-medium mb-2">Areas for Improvement:</p>
                  <ul className="space-y-1">
                    {uniqueFeedback.weaknesses.map((item, idx) => (
                      <li key={idx} className="font-dm text-text-secondary text-sm leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {uniqueFeedback.gaps.length > 0 && (
                <div>
                  <p className="font-syne text-text-primary text-sm font-medium mb-2">Knowledge Gaps to Address:</p>
                  <ul className="space-y-1">
                    {uniqueFeedback.gaps.map((item, idx) => (
                      <li key={idx} className="font-dm text-text-secondary text-sm leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {uniqueFeedback.strengths.length === 0 && uniqueFeedback.weaknesses.length === 0 && uniqueFeedback.gaps.length === 0 && (
                <p className="font-dm text-text-secondary text-sm">No detailed feedback available yet.</p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/setup')} className="px-6 py-3 rounded-lg bg-accent-teal hover:bg-accent-teal-bright text-white font-dm font-medium text-sm transition-colors">Start New Interview</button>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg border border-bg-border text-text-secondary font-dm text-sm hover:border-text-tertiary transition-colors">Back to Dashboard</button>
          </div>
        </div>
      </main>
    </div>
  )
}