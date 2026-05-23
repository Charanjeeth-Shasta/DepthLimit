import { Check } from 'lucide-react'

const steps = ['Resume', 'Job Role', 'Interview Type']

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => {
        const isComplete = i < currentStep
        const isActive = i === currentStep
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono transition-all duration-300 ${
                  isComplete
                    ? 'bg-accent-teal text-white'
                    : isActive
                    ? 'bg-accent-teal text-white ring-2 ring-accent-teal/30 ring-offset-2 ring-offset-bg-primary'
                    : 'bg-bg-elevated border border-bg-border text-text-tertiary'
                }`}
              >
                {isComplete ? <Check size={14} /> : <span>{i + 1}</span>}
              </div>
              <span className={`text-xs mt-1.5 font-dm ${isActive ? 'text-text-primary' : 'text-text-tertiary'}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-20 h-px mx-2 mb-5 transition-all duration-500 ${
                  i < currentStep ? 'bg-accent-teal' : 'bg-bg-border'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}