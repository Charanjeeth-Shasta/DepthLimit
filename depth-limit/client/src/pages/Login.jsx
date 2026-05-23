import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return (
    <div className="min-h-screen flex font-dm">
      <div
        className="hidden lg:flex flex-col justify-between w-3/5 p-12 relative overflow-hidden"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-accent-teal/10" />
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full border border-accent-teal/15" />
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-accent-teal/5" />

        <div className="font-syne font-bold text-2xl text-text-primary z-10">
          Depth<span className="text-accent-teal">Limit</span>
        </div>

        <div className="z-10">
          <h1 className="font-syne font-extrabold text-5xl text-text-primary leading-tight mb-4">
            Master Every<br />Interview.
          </h1>
          <p className="text-text-secondary text-lg mb-10">
            Adaptive AI that thinks like your interviewer.
          </p>
          <div className="space-y-4 mb-12">
            {[
              { color: 'bg-accent-teal', text: 'Thread Puller — follows your answers, finds your limits' },
              { color: 'bg-accent-blue', text: 'Concept Mapper — covers every topic, no gaps' },
              { color: 'bg-success', text: 'Real NLP scoring — not just AI opinions' },
            ].map(({ color, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                <span className="text-text-secondary text-sm">{text}</span>
              </div>
            ))}
          </div>
          <blockquote className="text-text-tertiary text-sm italic border-l-2 border-bg-border pl-4">
            "DepthLimit helped me land my dream role. The adaptive questioning is no joke."
            <br /><span className="not-italic font-medium mt-1 block">— Priya S., SDE-2 at Google</span>
          </blockquote>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-bg-surface">
        <div className="w-full max-w-sm">
          <div className="font-syne font-bold text-2xl text-text-primary mb-8 lg:hidden">
            Depth<span className="text-accent-teal">Limit</span>
          </div>
          <h2 className="font-syne font-bold text-3xl text-text-primary mb-2">Welcome back</h2>
          <p className="text-text-secondary text-sm mb-8">Sign in to continue your prep</p>

          <div className="space-y-4 mb-6">
            <input type="email" placeholder="Email address"
              className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary" />
            <input type="password" placeholder="Password"
              className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary" />
          </div>

          <button onClick={async () => {
            try {
              const email = document.querySelector('input[type="email"]').value;
              const password = document.querySelector('input[type="password"]').value;
              await login(email, password);
              navigate('/dashboard');
            } catch {
              alert('Invalid email or password');
            }
          }}
            className="w-full py-3 rounded-lg bg-accent-teal hover:bg-accent-teal-bright text-white font-dm font-medium text-sm transition-colors mb-4">
            Sign in
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-bg-border" />
            <span className="text-text-tertiary text-xs">or</span>
            <div className="flex-1 h-px bg-bg-border" />
          </div>

          <button className="w-full py-3 rounded-lg border border-bg-border hover:border-text-tertiary text-text-secondary font-dm text-sm flex items-center justify-center gap-2 transition-colors mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-text-tertiary text-sm">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-accent-teal hover:text-accent-teal-bright transition-colors">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  )
}