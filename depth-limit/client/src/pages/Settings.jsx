import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Settings() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [defaultMode, setDefaultMode] = useState('thread-puller')
  const [defaultCount, setDefaultCount] = useState(15)
  const [saved, setSaved] = useState(false)
  
  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    try {
      await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      })
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      return
    }

    try {
      await api.delete('/api/auth/delete-account')
      logout()
      navigate('/login')
    } catch (err) {
      alert('Failed to delete account: ' + (err.response?.data?.message || 'Try again'))
    }
  }

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-accent-teal' : 'bg-bg-border'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? 'left-6' : 'left-1'}`} />
    </button>
  )

  return (
    <div className="page-bg min-h-screen">
      <div className="glow-bg" />
      <Navbar />
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-dm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="font-syne font-bold text-3xl text-text-primary mb-8 fade-up-1">Settings</h1>

        <div className="space-y-6">
          <div className="bg-bg-surface border border-bg-border rounded-xl p-8 fade-up-2">
            <h2 className="font-syne font-semibold text-lg text-text-primary mb-6">Interview Defaults</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-dm text-text-secondary mb-3">Default Mode</label>
                <div className="flex gap-3">
                  {[
                    { id: 'thread-puller', label: 'Thread Puller' },
                    { id: 'concept-mapper', label: 'Concept Mapper' },
                  ].map(({ id, label }) => (
                    <button key={id} onClick={() => setDefaultMode(id)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-dm border transition-colors ${defaultMode === id ? 'bg-accent-teal text-white border-accent-teal' : 'border-bg-border text-text-secondary hover:border-text-tertiary bg-bg-primary'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-dm text-text-secondary mb-3">Default Question Count</label>
                <div className="flex gap-3">
                  {[10, 15, 20].map((n) => (
                    <button key={n} onClick={() => setDefaultCount(n)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-mono border transition-colors ${defaultCount === n ? 'bg-accent-teal text-white border-accent-teal' : 'border-bg-border text-text-secondary hover:border-text-tertiary bg-bg-primary'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-surface border border-bg-border rounded-xl p-8 fade-up-3">
            <h2 className="font-syne font-semibold text-lg text-text-primary mb-6">Preferences</h2>
            <div className="space-y-5">
              {[
                { label: 'Email Notifications', desc: 'Get updates on your progress', value: notifications, onChange: setNotifications },
                { label: 'Auto-save Answers', desc: 'Save drafts as you type', value: autoSave, onChange: setAutoSave },
              ].map(({ label, desc, value, onChange }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <div className="font-dm font-medium text-text-primary text-sm">{label}</div>
                    <div className="text-text-tertiary text-xs font-dm mt-0.5">{desc}</div>
                  </div>
                  <Toggle value={value} onChange={onChange} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface border border-bg-border rounded-xl p-8 fade-up-4">
            <h2 className="font-syne font-semibold text-lg text-text-primary mb-6">Account</h2>
            <div className="space-y-3">
              <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-3 rounded-lg border border-bg-border hover:bg-bg-elevated transition-colors text-sm font-dm text-text-secondary">
                Edit Profile
              </button>
              <button onClick={() => setShowPasswordModal(true)} className="w-full text-left px-4 py-3 rounded-lg border border-bg-border hover:bg-bg-elevated transition-colors text-sm font-dm text-text-secondary">
                Change Password
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="w-full text-left px-4 py-3 rounded-lg border border-danger/20 hover:bg-danger/5 transition-colors text-sm font-dm text-danger">
                Delete Account
              </button>
            </div>
          </div>

          <button onClick={handleSave}
            className={`px-6 py-3 rounded-lg font-dm font-medium text-sm transition-colors fade-up-5 ${saved ? 'bg-success text-white' : 'bg-accent-teal hover:bg-accent-teal-bright text-white'}`}>
            {saved ? '✓ Settings Saved' : 'Save Settings'}
          </button>
        </div>
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-surface border border-bg-border rounded-xl p-8 max-w-sm w-full mx-4">
            <h3 className="font-syne font-bold text-lg text-text-primary mb-4">Change Password</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-dm text-text-secondary mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg font-dm text-sm text-text-primary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-dm text-text-secondary mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg font-dm text-sm text-text-primary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-dm text-text-secondary mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg font-dm text-sm text-text-primary border border-bg-border focus:border-accent-teal transition-colors bg-bg-primary" 
                />
              </div>
            </div>

            {passwordError && <p className="text-danger text-sm mb-4">{passwordError}</p>}

            <div className="flex gap-3">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-bg-border text-text-secondary hover:bg-bg-elevated transition-colors text-sm font-dm"
              >
                Cancel
              </button>
              <button 
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 rounded-lg bg-accent-teal hover:bg-accent-teal-bright text-white transition-colors text-sm font-dm"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-surface border border-bg-border rounded-xl p-8 max-w-sm w-full mx-4">
            <h3 className="font-syne font-bold text-lg text-danger mb-4">Delete Account</h3>
            <p className="text-text-secondary text-sm font-dm mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <p className="text-text-secondary text-sm font-dm mb-4">
              Type <span className="font-mono font-bold text-danger">DELETE</span> to confirm:
            </p>
            
            <input 
              type="text" 
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2 rounded-lg font-dm text-sm text-text-primary border border-bg-border focus:border-danger transition-colors bg-bg-primary mb-6" 
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-bg-border text-text-secondary hover:bg-bg-elevated transition-colors text-sm font-dm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
                className="flex-1 px-4 py-2 rounded-lg bg-danger text-white transition-colors text-sm font-dm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}