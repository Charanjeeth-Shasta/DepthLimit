import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Upload, X, ChevronRight } from 'lucide-react'
import StepIndicator from '../components/StepIndicator'
import api from '../services/api'

const levels = ['Fresher', 'Junior', 'Mid', 'Senior']

export default function Setup() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(0)
  const [selectedResume, setSelectedResume] = useState(location.state?.resumeId || null)
  const [uploadedResumeId, setUploadedResumeId] = useState(location.state?.resumeId || null)
  const [apiResumes, setApiResumes] = useState([])
  const [jdOption, setJdOption] = useState('manual')
  const [jobTitle, setJobTitle] = useState('')
  const [jdFileName, setJdFileName] = useState('')
  const [industry, setIndustry] = useState('Software Engineering')
  const [skills, setSkills] = useState(['React', 'Node.js', 'PostgreSQL', 'System Design'])
  const [skillInput, setSkillInput] = useState('')
  const [level, setLevel] = useState('Mid')
  const [mode, setMode] = useState(null)
  const [questionCount, setQuestionCount] = useState(15)
  const [generating, setGenerating] = useState(false)

  const handleFileUpload = async (file) => {
    const form = new FormData();
    form.append('resume', file);
    try {
      const { data } = await api.post('/api/resume/upload', form);
      setUploadedResumeId(data.resume._id);
      setSelectedResume(data.resume._id);
      setApiResumes(prev => [...prev, data.resume]);
    } catch (err) {
      alert('Failed to upload resume');
    }
  };

  const handleJDUpload = async (file) => {
    if (!file) return;
    
    setJdFileName(file.name);
    
    try {
      let jdText = '';
      
      // TXT files: read directly
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        jdText = await file.text();
      }
      // PDF files: need backend processing (send file as-is for now)
      else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For PDF, we'll send it to backend for processing
        // Store as null for now - backend will handle it
        jdText = null;
      }
      // DOCX files: need backend processing
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        // For DOCX, we'll send it to backend for processing
        jdText = null;
      }
      
      // Try to extract job title from text if available
      if (jdText) {
        const jobTitleMatch = jdText.match(/(?:Job Title|Position|Role)[:\s]+([^\n]+)/i);
        if (jobTitleMatch) {
          setJobTitle(jobTitleMatch[1].trim());
        }
      }
      
      // Store file content for later submission
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store as base64 for file upload
        const content = e.target.result;
        // We'll send this to backend when generating interview
        sessionStorage.setItem('jdFileContent', content);
        sessionStorage.setItem('jdFileName', file.name);
        if (jdText) {
          sessionStorage.setItem('jdContent', jdText);
        }
      };
      reader.readAsArrayBuffer(file);
      
    } catch (err) {
      console.log('JD file read error:', err);
    }
  };

  useEffect(() => {
    api.get('/api/resume/list').then(r => setApiResumes(r.data.resumes || [])).catch(() => {});
  }, []);

  return (
    <div className="page-bg min-h-screen">
      <div className="glow-bg" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-2">
          <span className="font-syne font-bold text-xl text-text-primary">
            Depth<span className="text-accent-teal">Limit</span>
          </span>
        </div>
        <div className="mt-8"><StepIndicator currentStep={step} /></div>

        {step === 0 && (
          <div className="fade-up-1">
            <h1 className="font-syne font-bold text-3xl text-text-primary mb-2">Upload your resume</h1>
            <p className="text-text-secondary font-dm mb-8">We'll tailor questions to your experience</p>
            <div className="border-2 border-dashed border-bg-border rounded-xl p-10 text-center mb-6 hover:border-accent-teal/50 transition-colors cursor-pointer bg-bg-surface">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.docx"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <Upload size={32} className="text-text-tertiary mx-auto mb-3" />
                <p className="font-dm text-text-secondary mb-1">Drag & drop your PDF or DOCX</p>
                <p className="text-accent-teal text-sm cursor-pointer hover:text-accent-teal-bright">or browse files</p>
                <p className="text-text-tertiary text-xs mt-2">PDF, DOCX up to 10MB</p>
              </label>
            </div>
            <h3 className="font-dm font-medium text-text-secondary text-sm mb-3">Or choose a saved resume</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {apiResumes.map((r) => (
                <button key={r._id} onClick={() => setSelectedResume(r._id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${selectedResume === r._id ? 'card-glow' : 'border-bg-border bg-bg-surface hover:border-text-tertiary'}`}>
                  <div className="font-dm text-sm text-text-primary truncate">{r.originalName}</div>
                  <div className="text-text-tertiary text-xs mt-1">{new Date(r.createdAt || '').toLocaleDateString()}</div>
                </button>
              ))}
            </div>
            <button disabled={!selectedResume} onClick={() => setStep(1)}
              className={`w-full py-3 rounded-lg font-dm font-medium text-sm flex items-center justify-center gap-2 transition-colors ${selectedResume ? 'bg-accent-teal hover:bg-accent-teal-bright text-white' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}>
              Next Step <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up-1">
            <h1 className="font-syne font-bold text-3xl text-text-primary mb-2">Describe the role</h1>
            <p className="text-text-secondary font-dm mb-8">Help us understand what you're applying for</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { id: 'upload', label: 'Upload Job Description', desc: 'Drop a JD file' },
                { id: 'manual', label: 'Describe Manually', desc: 'Enter role details yourself' },
              ].map(({ id, label, desc }) => (
                <button key={id} onClick={() => setJdOption(id)}
                  className={`p-5 rounded-xl border text-left transition-all duration-200 ${jdOption === id ? 'card-glow' : 'border-bg-border bg-bg-surface hover:border-text-tertiary'}`}>
                  <div className="font-dm font-medium text-text-primary text-sm mb-1">{label}</div>
                  <div className="text-text-tertiary text-xs">{desc}</div>
                </button>
              ))}
            </div>
            {jdOption === 'upload' && (
              <div className="border-2 border-dashed border-bg-border rounded-xl p-10 text-center mb-6 hover:border-accent-teal/50 transition-colors cursor-pointer bg-bg-surface">
                <input
                  type="file"
                  id="jd-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleJDUpload(e.target.files[0])}
                  className="hidden"
                />
                {jdFileName ? (
                  <div className="text-center">
                    <div className="text-accent-teal text-3xl mb-2">✓</div>
                    <p className="font-dm text-text-primary text-sm mb-1">File uploaded: {jdFileName}</p>
                    <p className="text-text-tertiary text-xs">You can now proceed or upload another file</p>
                    <label htmlFor="jd-upload" className="text-accent-teal text-xs cursor-pointer hover:text-accent-teal-bright mt-2 block">Upload different file</label>
                  </div>
                ) : (
                  <label htmlFor="jd-upload" className="cursor-pointer block">
                    <Upload size={32} className="text-text-tertiary mx-auto mb-3" />
                    <p className="font-dm text-text-secondary mb-1">Drag & drop your Job Description</p>
                    <p className="text-accent-teal text-sm cursor-pointer hover:text-accent-teal-bright">or browse files</p>
                    <p className="text-text-tertiary text-xs mt-2">PDF, DOCX, TXT up to 10MB</p>
                  </label>
                )}
              </div>
            )}
            {(jdOption === 'upload' || jdOption === 'manual') && (
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Job Title (e.g. Senior Backend Engineer)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-surface" />
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-secondary border border-bg-border focus:border-accent-teal transition-colors bg-bg-surface">
                  <option>Software Engineering</option>
                  <option>Data Science</option>
                  <option>Product Management</option>
                  <option>DevOps</option>
                </select>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((s, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-accent-teal/10 text-accent-teal text-xs px-3 py-1 rounded-full border border-accent-teal/20">
                        {s} <X size={10} className="cursor-pointer hover:opacity-70" onClick={(e) => {
                          e.stopPropagation();
                          setSkills(skills.filter((_, i) => i !== idx));
                        }} />
                      </span>
                    ))}
                  </div>
                  <input type="text" placeholder="Add skill and press Enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmed = skillInput.trim();
                        if (trimmed && !skills.includes(trimmed)) {
                          setSkills([...skills, trimmed]);
                          setSkillInput('');
                        }
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg font-dm text-sm text-text-primary placeholder-text-tertiary border border-bg-border focus:border-accent-teal transition-colors bg-bg-surface" />
                </div>
              </div>
            )}
            <div className="mb-8">
              <div className="font-dm text-sm text-text-secondary mb-3">Experience Level</div>
              <div className="flex gap-2">
                {levels.map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`flex-1 py-2 rounded-lg text-sm font-dm transition-colors ${level === l ? 'bg-accent-teal text-white' : 'bg-bg-surface border border-bg-border text-text-secondary hover:border-text-tertiary'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-6 py-3 rounded-lg border border-bg-border text-text-secondary font-dm text-sm hover:border-text-tertiary transition-colors">Back</button>
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg bg-accent-teal hover:bg-accent-teal-bright text-white font-dm font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up-1">
            <h1 className="font-syne font-bold text-3xl text-text-primary mb-2">Choose your interview style</h1>
            <p className="text-text-secondary font-dm mb-8">How do you want to be challenged?</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { id: 'thread-puller', title: 'Thread Puller', desc: 'The AI follows up on exactly what you say. One answer leads to the next question. It will find your depth limit.', tags: ['Depth-first', 'Adaptive', 'Challenging'], accentColor: '#0D9488' },
                { id: 'concept-mapper', title: 'Concept Mapper', desc: "The AI maps all required topics. Skips what you know, revisits what you don't. Complete topic coverage.", tags: ['Breadth-first', 'Comprehensive', 'Structured'], accentColor: '#2563EB' },
              ].map(({ id, title, desc, tags, accentColor }) => (
                <button key={id} onClick={() => setMode(id)}
                  className={`p-5 rounded-xl border text-left transition-all duration-200 border-l-4 ${mode === id ? 'card-glow' : 'border-bg-border bg-bg-surface hover:border-text-tertiary'}`}
                  style={{ borderLeftColor: accentColor }}>
                  <div className="font-syne font-semibold text-text-primary mb-2">{title}</div>
                  <div className="font-dm text-text-secondary text-xs mb-3 leading-relaxed">{desc}</div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-tertiary border border-bg-border">{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div className="mb-8">
              <div className="font-dm text-sm text-text-secondary mb-3">Number of Questions</div>
              <div className="flex gap-2">
                {[10, 15, 20].map((n) => (
                  <button key={n} onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-mono transition-colors ${questionCount === n ? 'bg-accent-teal text-white' : 'bg-bg-surface border border-bg-border text-text-secondary hover:border-text-tertiary'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border border-bg-border text-text-secondary font-dm text-sm hover:border-text-tertiary transition-colors">Back</button>
              <button disabled={!mode} onClick={async () => {
                setGenerating(true);
                try {
                  const resumeId = uploadedResumeId || selectedResume;
                  const { data } = await api.post('/api/interview/generate', {
                    resumeId,
                     jobTitle: jobTitle || 'Technical Interview',
                     difficulty: level.toLowerCase(),
                    mode: mode === 'thread-puller' ? 'standard' : 'advanced',
                    jdContent: sessionStorage.getItem('jdContent'),
                    questionCount: questionCount,
                  });
                  navigate(`/interview/${data.session._id}`, { state: { session: data } });
                } catch (err) {
                  alert('Failed to generate interview. Make sure the NLP service is running on port 8000.');
                  setGenerating(false);
                }
              }}
                className={`flex-1 py-3 rounded-lg font-dm font-medium text-sm transition-all ${mode ? 'bg-accent-teal hover:bg-accent-teal-bright text-white teal-glow-btn' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}
                disabled={generating}>
                {generating ? 'Generating...' : 'Begin Interview'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}