import MultiStepForm from './components/MultiStepForm'
import { useFormPersistence } from './hooks/useFormPersistence'

function AppContent() {
  useFormPersistence()
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <header
        className="text-white px-6 py-5"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', boxShadow: '0 2px 12px rgba(29,78,216,0.3)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="rgba(255,255,255,0.15)" />
              <path d="M8 13C8 11.343 9.343 10 11 10H25C26.657 10 28 11.343 28 13V23C28 24.657 26.657 26 25 26H11C9.343 26 8 24.657 8 23V13Z" stroke="white" strokeWidth="2" />
              <path d="M8 15H28" stroke="white" strokeWidth="2" />
              <path d="M12 20H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 23H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="23" cy="21.5" r="2" stroke="white" strokeWidth="1.5" />
            </svg>
            <span className="text-[22px] font-bold tracking-tight">LoanEase</span>
          </div>
          <div className="w-px h-8 bg-white/30 mx-2" />
          <span className="text-sm opacity-85">Quick &amp; Secure Loan Application</span>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6">
        <MultiStepForm />
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-4 text-sm">
        © 2024 LoanEase Financial Services. All rights reserved.&nbsp;|&nbsp;Secured by 256-bit SSL
      </footer>
    </div>
  )
}

export default function App() {
  return <AppContent />
}
