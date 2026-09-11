import React, { useState } from 'react';
import { FormSubmission, PlaygroundPage } from './types';
import GoogleFormView from './components/GoogleFormView';
import SecurityVisualizer from './components/SecurityVisualizer';
import { 
  FileText, 
  Shield, 
  Columns, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  RefreshCw,
  Info
} from 'lucide-react';

const INITIAL_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'sub_seed_1',
    name: 'Alex Mercer',
    email: 'alex@matrix.com',
    feedback: 'Great application platform! User experience is smooth.',
    environment: 'Production (Strict Parameterized Queries)',
    rating: 5,
    submittedAt: '10:45:12 AM',
    hasSQLi: false,
    hasXSS: false,
  },
  {
    id: 'sub_seed_2',
    name: 'Attacker_SQLi',
    email: "' OR '1'='1",
    feedback: 'Testing authentication bypass via unescaped WHERE clause.',
    environment: 'Legacy Staging (Vulnerable String Concatenation)',
    rating: 1,
    submittedAt: '10:48:30 AM',
    hasSQLi: true,
    hasXSS: false,
  },
  {
    id: 'sub_seed_3',
    name: 'Pentester_XSS',
    email: 'secops@cyber.org',
    feedback: "<script>alert('XSS SESSION STOLEN!')</script>",
    environment: 'Legacy Staging (Vulnerable String Concatenation)',
    rating: 2,
    submittedAt: '10:52:05 AM',
    hasSQLi: false,
    hasXSS: true,
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PlaygroundPage>('form');
  const [submissions, setSubmissions] = useState<FormSubmission[]>(INITIAL_SUBMISSIONS);
  const [activeSubmission, setActiveSubmission] = useState<FormSubmission | null>(
    INITIAL_SUBMISSIONS[0]
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleFormSubmit = (newSubmission: FormSubmission) => {
    setSubmissions((prev) => [newSubmission, ...prev]);
    setActiveSubmission(newSubmission);
    showToast('🚀 Response recorded & piped to Security Visualizer!');
  };

  const handleSelectSubmissionForVisualizer = (sub: FormSubmission) => {
    setActiveSubmission(sub);
    setCurrentPage('visualizer');
    showToast(`Loaded payload from "${sub.name}" into Security Visualizer`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-[#f3f4f6]">
      
      {/* Top Universal Playground Header */}
      <header className="bg-[#12141d] border-b border-[#1e2235] px-4 py-2.5 z-40 sticky top-0 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold text-sm tracking-wide text-white">
                Dual-Page Security Playground
              </span>
            </div>
            <span className="hidden md:inline text-xs text-[#9ca3af] border-l border-[#1e2235] pl-3">
              Google Form ↔ T018 Vulnerability Visualizer
            </span>
          </div>

          {/* Page Switcher Segmented Control */}
          <div className="flex items-center bg-[#090a0f] border border-[#1e2235] p-1 rounded-xl shadow-inner text-xs">
            <button
              id="nav-page-form"
              onClick={() => setCurrentPage('form')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                currentPage === 'form'
                  ? 'bg-[#673ab7] text-white shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Page 1: Google Form</span>
            </button>

            <button
              id="nav-page-visualizer"
              onClick={() => setCurrentPage('visualizer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                currentPage === 'visualizer'
                  ? 'bg-[#6366f1] text-white shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Page 2: Security Visualizer</span>
            </button>

            <button
              id="nav-page-split"
              onClick={() => setCurrentPage('split')}
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                currentPage === 'split'
                  ? 'bg-gradient-to-r from-[#673ab7] to-[#6366f1] text-white shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
              title="View Google Form and Security Visualizer side-by-side"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Screen</span>
            </button>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#9ca3af] hidden sm:inline">Active Payload:</span>
            <span className="bg-[#181b29] border border-[#1e2235] text-amber-300 font-mono text-[11px] px-2 py-0.5 rounded max-w-[140px] truncate">
              {activeSubmission?.email || 'alex@matrix.com'}
            </span>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#12141d] border border-[#6366f1] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Playground Content Container */}
      <main className="flex-1 w-full flex flex-col">
        {currentPage === 'form' && (
          <div className="w-full">
            <GoogleFormView
              onSubmitToVisualizer={handleFormSubmit}
              onSwitchToVisualizer={() => setCurrentPage('visualizer')}
              submissions={submissions}
            />
          </div>
        )}

        {currentPage === 'visualizer' && (
          <div className="w-full">
            <SecurityVisualizer
              initialData={{
                name: activeSubmission?.name || 'Alex Mercer',
                email: activeSubmission?.email || 'alex@matrix.com',
                comment: activeSubmission?.feedback || 'Great application platform!',
              }}
              latestFormSubmission={activeSubmission}
              onNavigateToForm={() => setCurrentPage('form')}
            />
          </div>
        )}

        {currentPage === 'split' && (
          <div className="w-full flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#1e2235] min-h-[calc(100vh-60px)]">
            {/* Left Column: Google Form */}
            <div className="w-full lg:w-1/2 overflow-y-auto max-h-[calc(100vh-60px)] bg-[#f0ebf8]">
              <div className="p-3 bg-[#673ab7] text-white text-xs font-semibold flex items-center justify-between sticky top-0 z-20">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Page 1: Google Form Playground
                </span>
                <span className="text-[11px] opacity-80">Submitting feeds Visualizer</span>
              </div>
              <GoogleFormView
                onSubmitToVisualizer={handleFormSubmit}
                onSwitchToVisualizer={() => setCurrentPage('visualizer')}
                submissions={submissions}
              />
            </div>

            {/* Right Column: Security Visualizer */}
            <div className="w-full lg:w-1/2 overflow-y-auto max-h-[calc(100vh-60px)] bg-[#090a0f]">
              <div className="p-3 bg-[#12141d] border-b border-[#1e2235] text-white text-xs font-semibold flex items-center justify-between sticky top-0 z-20">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#6366f1]" /> Page 2: T018 Security Visualizer (Problem P19)
                </span>
                <span className="text-[11px] text-emerald-400">Live Dual Pipeline</span>
              </div>
              <SecurityVisualizer
                initialData={{
                  name: activeSubmission?.name || 'Alex Mercer',
                  email: activeSubmission?.email || 'alex@matrix.com',
                  comment: activeSubmission?.feedback || 'Great application platform!',
                }}
                latestFormSubmission={activeSubmission}
                onNavigateToForm={() => setCurrentPage('form')}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
