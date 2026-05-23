import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Flag } from 'lucide-react'
import useTypingEffect from '../hooks/useTypingEffect'
import ModeBadge from '../components/ModeBadge'
import TopicPill from '../components/TopicPill'
import api from '../services/api'
import { mockQuestions } from '../services/mockData'

export default function Interview() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const location = useLocation()
  const sessionData = location.state?.session

  // Flatten questions from session
  // Backend now returns questions with skill metadata: { text, skill, type }
  const allQuestions = sessionData ? 
    (Array.isArray(sessionData.questions) 
      ? sessionData.questions  // Already flat array (stored in session)
      : [
          ...Object.values(sessionData.questions || {}).flat(),
          ...Object.values(sessionData.project_questions || {}).flat(),
        ].map(q => ({ text: q, skill: null })) // Convert old format for backwards compat
    ) : mockQuestions.map(q => ({ text: q.text, skill: 'Technical' }))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [flagged, setFlagged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const questionObj = allQuestions[currentIndex] || { text: 'No more questions.', skill: null }
  const questionText = typeof questionObj === 'string' ? questionObj : questionObj.text
  const currentSkill = typeof questionObj === 'string' ? null : questionObj.skill
  const total = allQuestions.length
  const progress = ((currentIndex + 1) / total) * 100
  const { displayed } = useTypingEffect(questionText, 20)

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post(`/api/interview/submit-answer/${sessionId}`, {
        question: questionText,
        answer,
      });
    } catch { /* non-fatal, continue */ }

    if (currentIndex >= allQuestions.length - 1) {
      setComplete(true)
      setTimeout(() => navigate(`/report/${sessionId}/detailed`), 2000)
    } else {
      setCurrentIndex(i => i + 1)
      setAnswer('')
      setFlagged(false)
      setLoading(false)
    }
  }

  if (complete) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center fade-up-1">
          <h1 className="font-syne font-extrabold text-6xl text-text-primary mb-4">Interview Complete</h1>
          <p className="text-text-secondary font-dm">Generating your report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <div className="h-1 bg-bg-border w-full fixed top-0 z-50">
        <div className="h-full bg-accent-teal transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-b border-bg-border bg-bg-surface mt-1">
        <span className="font-syne font-bold text-lg text-text-primary">
          Depth<span className="text-accent-teal">Limit</span>
        </span>
        <span className="font-mono text-text-secondary text-sm">Question {currentIndex + 1} of {total}</span>
        <div className="flex items-center gap-3">
          <ModeBadge mode="thread-puller" />
          <span className="font-mono text-text-tertiary text-sm">{formatTime(elapsed)}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          <div className="mb-4"><TopicPill topic={currentSkill || sessionData?.skills?.[0] || 'Technical'} /></div>

          <div className="bg-bg-surface border border-bg-border rounded-xl p-8 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-text-tertiary text-sm">Q{currentIndex + 1}</span>
            </div>
            <p className="font-syne text-xl text-text-primary leading-relaxed min-h-16">
              {displayed}<span className="animate-pulse text-accent-teal">|</span>
            </p>
          </div>

          <div className="relative mb-4">
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Take your time."
              className="w-full min-h-44 px-5 py-4 rounded-xl font-dm text-text-primary placeholder-text-tertiary bg-bg-surface border border-bg-border focus:border-accent-teal transition-all duration-200 resize-none text-sm leading-relaxed"
              style={{ boxShadow: answer.length > 0 ? '0 0 0 2px rgba(13,148,136,0.2)' : undefined }} />
            <span className="absolute bottom-3 right-4 font-mono text-xs text-text-tertiary">{answer.length} chars</span>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setFlagged(!flagged)}
              className={`flex items-center gap-2 text-sm font-dm px-4 py-2 rounded-lg border transition-colors ${flagged ? 'text-warning border-warning/30 bg-warning/10' : 'text-text-tertiary border-bg-border hover:border-text-tertiary'}`}>
              <Flag size={14} />{flagged ? 'Flagged' : 'Flag this question'}
            </button>
            <button onClick={handleSubmit} disabled={loading || !answer.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-dm font-medium text-sm transition-colors ${answer.trim() && !loading ? 'bg-accent-teal hover:bg-accent-teal-bright text-white' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}>
              {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit Answer →</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}