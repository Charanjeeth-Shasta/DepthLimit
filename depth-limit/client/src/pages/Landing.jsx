import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Target, BarChart3, ChevronRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-primary font-dm">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-bg-surface/80 backdrop-blur border-b border-bg-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-syne font-bold text-xl text-text-primary">
            Depth<span className="text-accent-teal">Limit</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-dm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-sm font-dm bg-accent-teal hover:bg-accent-teal-bright text-white rounded-lg transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-xs font-dm px-3 py-1.5 rounded-full mb-8 fade-up-1">
          <Zap size={12} />
          AI-powered adaptive interview practice
        </div>
        <h1 className="font-syne font-extrabold text-6xl text-text-primary leading-tight mb-6 fade-up-2">
          Practice Interviews That<br />
          <span className="text-accent-teal">Push Your Limits</span>
        </h1>
        <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-10 fade-up-3">
          DepthLimit adapts to every answer you give. It finds your knowledge ceiling, fills your gaps, and turns shaky concepts into strengths.
        </p>
        <div className="flex items-center justify-center gap-4 fade-up-4">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2 px-6 py-3.5 bg-accent-teal hover:bg-accent-teal-bright text-white font-dm font-medium rounded-lg transition-colors teal-glow-btn"
          >
            Start Practicing Free <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-3.5 border border-bg-border text-text-secondary hover:border-text-tertiary font-dm rounded-lg transition-colors"
          >
            Sign in <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: 'Thread Puller Mode',
              desc: 'The AI follows up on exactly what you said. Every answer leads to a deeper question. It will find your depth limit.',
              color: 'text-accent-teal',
              bg: 'bg-accent-teal/10',
            },
            {
              icon: BarChart3,
              title: 'Concept Mapper Mode',
              desc: 'Complete topic coverage. Skips what you already know, revisits what you don\'t. No blind spots left behind.',
              color: 'text-accent-blue',
              bg: 'bg-accent-blue/10',
            },
            {
              icon: Zap,
              title: 'Real NLP Scoring',
              desc: 'Not just AI opinions. Semantic similarity, concept coverage, depth, and confidence — all measured and shown.',
              color: 'text-success',
              bg: 'bg-success/10',
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-bg-surface border border-bg-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="font-syne font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-accent-teal rounded-2xl p-12 text-center text-white">
          <h2 className="font-syne font-extrabold text-4xl mb-4">Ready to find your limit?</h2>
          <p className="text-white/80 mb-8 font-dm">Free to start. No credit card required.</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3.5 bg-white text-accent-teal font-dm font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="font-syne font-bold text-text-primary">
            Depth<span className="text-accent-teal">Limit</span>
          </span>
          <p className="text-text-tertiary text-sm font-dm">© 2025 DepthLimit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}