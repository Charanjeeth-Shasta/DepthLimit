import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  // Password validation checks
// Real-time validation object
const passwordChecks = {
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[@$!%*?&]/.test(password),
}

// Show conditions as user types
{password && (
  <div className="space-y-2 text-xs">
    <div className={`${passwordChecks.length ? 'text-success' : 'text-danger'}`}>
      {passwordChecks.length ? '✓' : '✗'} At least 8 characters
    </div>
    {/* ... other checks ... */}
  </div>
)}

  const isPasswordValid = Object.values(passwordChecks).every(Boolean)
  const isPasswordMatch = password && password === confirmPassword

  const sanitizeName = (input) => {
    return input.replace(/<[^>]*>/g, '').trim()
  }

  const handleSignup = async () => {
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!email) {
      setError('Email is required')
      return
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements')
      return
    }

    if (!isPasswordMatch) {
      setError('Passwords do not match')
      return
    }

    try {
      const sanitizedName = sanitizeName(name)
      await register(sanitizedName, email, password)
      navigate('/login')
    } catch (err) {
      setError('Registration failed. Try again.')
    }
  }

  return (
    <div className="min-h-screen flex font-dm items-start">
      <div className="hidden lg:flex flex-col justify-between w-3/5 p-12 relative overflow-hidden sticky top-0 h-screen" style={{ background: 'var(--bg-elevated)' }}>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-accent-blue/10" />
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full border border-accent-blue/15" />
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-accent-teal/5" />

        <div className="font-syne font-bold text-2xl text-text-primary z-10">
          Depth<span className="text-accent-teal">Limit</span>
        </div>
        <div className="z-10">
          <h1 className="font-syne font-extrabold text-5xl text-text-primary leading-tight mb-4">Start your prep<br />today.</h1>
          <p className="text-text-secondary text-lg mb-10">Join thousands of engineers who landed their dream roles.</p>
          <div className="space-y-4">
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
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-bg-surface">
        <div className="w-full max-w-sm">
          <div className="font-syne font-bold text-2xl text-text-primary mb-8 lg:hidden">
            Depth<span className="text-accent-teal">Limit</span>
          </div>
          <h2 className="font-syne font-bold text-3xl text-text-primary mb-2">Create account</h2>
          <p className="text-text-secondary text-sm mb-8">Start your interview prep journey</p>

          <div className="space-y-4 mb-6">
            <input 
              type="text" 
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary"
            />
            
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary"
            />
            
            <div>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary"
              />
              
              {/* Password Requirements */}
              {password && (
                <div className="mt-3 space-y-2 text-xs">
                  <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-success' : 'text-danger'}`}>
                    <span className="text-lg">{passwordChecks.length ? '✓' : '✗'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-success' : 'text-danger'}`}>
                    <span className="text-lg">{passwordChecks.uppercase ? '✓' : '✗'}</span>
                    <span>At least one uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-success' : 'text-danger'}`}>
                    <span className="text-lg">{passwordChecks.number ? '✓' : '✗'}</span>
                    <span>At least one number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordChecks.special ? 'text-success' : 'text-danger'}`}>
                    <span className="text-lg">{passwordChecks.special ? '✓' : '✗'}</span>
                    <span>At least one special character (@$!%*?&)</span>
                  </div>
                </div>
              )}
            </div>
            
            <input 
              type="password" 
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary"
            />
          </div>

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <button 
            onClick={handleSignup}
            disabled={!isPasswordValid || !isPasswordMatch}
            className="w-full py-3 rounded-lg bg-accent-teal hover:bg-accent-teal-bright text-white font-dm font-medium text-sm transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create account
          </button>

          <p className="text-center text-text-tertiary text-xs mb-4">By signing up, you agree to our Terms of Service</p>
          <p className="text-center text-text-tertiary text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-accent-teal hover:text-accent-teal-bright transition-colors">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  )
}