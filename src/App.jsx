import { FormProvider } from './context/FormContext.jsx'
import MultiStepForm from './components/MultiStepForm.jsx'

export default function App() {
  return (
    <FormProvider>
      <div className="app-wrapper">
        <header className="app-header">
          <div className="header-inner">
            <div className="header-logo">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="rgba(255,255,255,0.15)" />
                <path
                  d="M8 13C8 11.343 9.343 10 11 10H25C26.657 10 28 11.343 28 13V23C28 24.657 26.657 26 25 26H11C9.343 26 8 24.657 8 23V13Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path d="M8 15H28" stroke="white" strokeWidth="2" />
                <path d="M12 20H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 23H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="23" cy="21.5" r="2" stroke="white" strokeWidth="1.5" />
              </svg>
              <span className="header-logo-text">LoanEase</span>
            </div>
            <div className="header-divider" />
            <span className="header-tagline">Quick &amp; Secure Loan Application</span>
          </div>
        </header>
        <main className="app-main">
          <MultiStepForm />
        </main>
        <footer className="app-footer">
          © 2024 LoanEase Financial Services. All rights reserved. &nbsp;|&nbsp; Secured by 256-bit SSL
        </footer>
      </div>
    </FormProvider>
  )
}
