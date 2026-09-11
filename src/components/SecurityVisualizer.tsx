import React, { useState, useEffect, useRef } from 'react';
import { FormSubmission, AttackPresetType } from '../types';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Database, 
  Code2, 
  RotateCcw, 
  ArrowRight, 
  FileText, 
  Lock, 
  Zap,
  Info
} from 'lucide-react';

interface SecurityVisualizerProps {
  initialData?: {
    name: string;
    email: string;
    comment: string;
  };
  latestFormSubmission?: FormSubmission | null;
  onNavigateToForm?: () => void;
}

export default function SecurityVisualizer({
  initialData,
  latestFormSubmission,
  onNavigateToForm,
}: SecurityVisualizerProps) {
  const [name, setName] = useState(initialData?.name || 'Alex Mercer');
  const [email, setEmail] = useState(initialData?.email || 'alex@matrix.com');
  const [comment, setComment] = useState(
    initialData?.comment || 'Great application platform!'
  );

  // Animation states
  const [vulnStatus, setVulnStatus] = useState<'READY' | 'INGESTING...' | 'BREACH' | 'SAFE'>('READY');
  const [safeStatus, setSafeStatus] = useState<'READY' | 'SANITIZING...' | 'NEUTRALIZED' | 'SAFE'>('READY');
  const [vulnIcon, setVulnIcon] = useState('💥');
  const [safeIcon, setSafeIcon] = useState('🛡️');
  const [vulnDetails, setVulnDetails] = useState('> Awaiting Form Submission...');
  const [safeDetails, setSafeDetails] = useState('> Awaiting Form Submission...');
  const [renderOutput, setRenderOutput] = useState<{
    text: string;
    type: 'initial' | 'sqli' | 'xss' | 'safe';
  }>({
    text: '> Submission Feed Display: Submit form data to execute security analysis.',
    type: 'initial',
  });

  const [vulnCarLeft, setVulnCarLeft] = useState(0);
  const [safeCarLeft, setSafeCarLeft] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showXssModal, setShowXssModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'explanation'>('visualizer');

  const animationFrameRef = useRef<number | null>(null);

  // If initialData changes or a new submission is received from the Google Form
  useEffect(() => {
    if (latestFormSubmission) {
      setName(latestFormSubmission.name);
      setEmail(latestFormSubmission.email);
      setComment(latestFormSubmission.feedback);
    }
  }, [latestFormSubmission]);

  const loadPreset = (type: AttackPresetType) => {
    if (type === 'normal') {
      setName('Alex Mercer');
      setEmail('alex@company.com');
      setComment('Great platform, smooth experience!');
    } else if (type === 'sqli') {
      setName('Attacker');
      setEmail("' OR '1'='1");
      setComment('Extracting user database via unescaped string concatenation...');
    } else if (type === 'xss') {
      setName('Hacker');
      setEmail('hacker@evil.com');
      setComment("<script>alert('XSS SESSION STOLEN!')</script>");
    }
  };

  const handleImportLatestForm = () => {
    if (latestFormSubmission) {
      setName(latestFormSubmission.name);
      setEmail(latestFormSubmission.email);
      setComment(latestFormSubmission.feedback);
    }
  };

  const runSimulation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsSimulating(true);
    setVulnCarLeft(0);
    setSafeCarLeft(0);
    setVulnStatus('INGESTING...');
    setSafeStatus('SANITIZING...');

    const hasSQLi =
      email.includes("' OR '1'='1") ||
      email.includes("' OR 1=1") ||
      email.includes("' OR '") ||
      email.includes("'; DROP") ||
      email.includes("'--");
    
    const hasXSS =
      comment.includes('<script>') ||
      comment.includes('onerror=') ||
      comment.includes('javascript:') ||
      comment.includes('<img');

    setVulnDetails(`> QUERY: SELECT * FROM submissions WHERE email = '${email}'`);
    setSafeDetails(`> QUERY: SELECT * FROM submissions WHERE email = ? [Param: "${email}"]`);

    const isMalicious = hasSQLi || hasXSS;
    const targetVuln = 88;
    const targetSafe = isMalicious ? 56 : 88;

    const startTime = performance.now();
    const duration = 1200;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setVulnCarLeft(progress * targetVuln);
      setSafeCarLeft(progress * targetSafe);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulating(false);
        evaluateOutcome(hasSQLi, hasXSS, comment);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const evaluateOutcome = (hasSQLi: boolean, hasXSS: boolean, rawComment: string) => {
    if (hasSQLi) {
      setVulnStatus('BREACH');
      setVulnIcon('💥');
      setSafeStatus('NEUTRALIZED');
      setSafeIcon('🛑');
      setRenderOutput({
        type: 'sqli',
        text: "⚠️ DATABASE EXPLOIT: Raw query evaluated '1'='1' as TRUE. Private user records leaked!",
      });
    } else if (hasXSS) {
      setVulnStatus('BREACH');
      setVulnIcon('☣️');
      setSafeStatus('NEUTRALIZED');
      setSafeIcon('🛑');
      setRenderOutput({
        type: 'xss',
        text: '⚠️ DOM EXPLOIT: Unescaped comment executed script inside browser context!',
      });
      // Show interactive in-app XSS exploit modal demonstration
      setShowXssModal(true);
    } else {
      setVulnStatus('SAFE');
      setVulnIcon('⚠️');
      setSafeStatus('SAFE');
      setSafeIcon('🛡️');
      setRenderOutput({
        type: 'safe',
        text: `✅ Submission Feed Display: "${rawComment}" (Rendered Safely)`,
      });
    }
  };

  const getVulnStatusText = () => {
    switch (vulnStatus) {
      case 'INGESTING...':
        return 'INGESTING...';
      case 'BREACH':
        return '🚨 BREACH DETECTED: EXPLOIT SUCCESSFUL';
      case 'SAFE':
        return '⚠️ UNPROTECTED PASSED';
      default:
        return 'READY';
    }
  };

  const getSafeStatusText = () => {
    switch (safeStatus) {
      case 'SANITIZING...':
        return 'SANITIZING...';
      case 'NEUTRALIZED':
        return '🛡️ NEUTRALIZED: BOUND AS LITERAL STRING';
      case 'SAFE':
        return '✅ SAFE EXECUTION COMPLETED';
      default:
        return 'READY';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#090a0f] text-[#f3f4f6] flex flex-col items-center p-4 sm:p-6 select-text">
      <div className="w-full max-w-[860px] flex flex-col gap-5">
        
        {/* Top Navigation Bar from index4 */}
        <div className="flex flex-wrap justify-between items-center bg-[#12141d] border border-[#1e2235] px-5 py-3 rounded-xl text-[13px] gap-3">
          <div className="flex items-center gap-2.5 font-bold tracking-[0.5px]">
            <span className="text-amber-400">⚡</span>
            <span>KALPVUKSH 2.0</span>
            <span className="bg-[rgba(99,102,241,0.15)] text-[#6366f1] border border-[#6366f1] text-[10px] px-1.5 py-0.5 rounded font-mono">
              T018 TEAM BOLT
            </span>
          </div>

          <div className="flex items-center gap-3">
            {latestFormSubmission && (
              <button
                id="btn-import-form"
                onClick={handleImportLatestForm}
                className="flex items-center gap-1.5 text-xs bg-[#181b29] hover:bg-[#6366f1]/20 text-[#9ca3af] hover:text-[#f3f4f6] border border-[#1e2235] px-2.5 py-1 rounded-md transition-colors"
                title="Load payload from recent Google Form submission"
              >
                <FileText className="w-3.5 h-3.5 text-[#6366f1]" />
                <span>Import Google Form Payload</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981] shadow-[0_0_8px_#10b981]"></span>
              </span>
              <span>Security Engine Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs between Visualizer & Deep Explanation */}
        <div className="flex items-center justify-between border-b border-[#1e2235] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'visualizer'
                  ? 'bg-[#6366f1] text-white shadow-sm'
                  : 'text-[#9ca3af] hover:text-white bg-[#12141d]'
              }`}
            >
              🛡️ Visualizer Track
            </button>
            <button
              onClick={() => setActiveTab('explanation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'explanation'
                  ? 'bg-[#6366f1] text-white shadow-sm'
                  : 'text-[#9ca3af] hover:text-white bg-[#12141d]'
              }`}
            >
              📖 Execution Architecture & Fixes
            </button>
          </div>

          {onNavigateToForm && (
            <button
              onClick={onNavigateToForm}
              className="text-xs text-[#9ca3af] hover:text-[#6366f1] flex items-center gap-1 transition-colors"
            >
              <span>Switch to Google Form View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activeTab === 'explanation' ? (
          /* Technical Deep Dive Panel */
          <div className="bg-[#12141d] border border-[#1e2235] rounded-xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#6366f1]" />
                  SQLi & XSS Vulnerability & Remediation Mechanics
                </h2>
                <p className="text-xs text-[#9ca3af] mt-1">
                  How unescaped string operations compromise web applications and how parameterized queries protect them.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('visualizer')}
                className="text-xs text-[#6366f1] hover:underline"
              >
                Back to Simulator
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SQLi Card */}
              <div className="bg-[#090a0f] border border-[#1e2235] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  SQL Injection (SQLi)
                </div>
                <div className="text-xs text-[#9ca3af] space-y-2">
                  <p>
                    <strong className="text-white">Vulnerable pattern:</strong> Using dynamic string concatenation (e.g., <code className="text-rose-300">`SELECT * FROM users WHERE email = '${"${email}"}'`</code>).
                  </p>
                  <p>
                    When an attacker enters <code className="text-amber-300 bg-amber-950/30 px-1 py-0.5 rounded">' OR '1'='1</code>, the SQL parser evaluates the statement as:
                  </p>
                  <pre className="bg-[#12141d] p-2 rounded text-[11px] text-rose-300 overflow-x-auto border border-rose-900/30 font-mono">
                    SELECT * FROM submissions WHERE email = '' OR '1'='1'
                  </pre>
                  <p>
                    Because <code className="text-amber-300">'1'='1'</code> is always true, the WHERE clause evaluates to TRUE for all rows, dumping the entire table.
                  </p>
                  <div className="pt-2 border-t border-[#1e2235]">
                    <strong className="text-emerald-400 flex items-center gap-1.5 mb-1">
                      <Lock className="w-3.5 h-3.5" /> Remediation: Parameterized Queries
                    </strong>
                    <pre className="bg-[#12141d] p-2 rounded text-[11px] text-emerald-300 overflow-x-auto border border-emerald-900/30 font-mono">
                      db.query('SELECT * FROM submissions WHERE email = ?', [email])
                    </pre>
                    <p className="mt-1">
                      The database driver treats the parameter strictly as literal data, preventing syntax alteration.
                    </p>
                  </div>
                </div>
              </div>

              {/* XSS Card */}
              <div className="bg-[#090a0f] border border-[#1e2235] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  Cross-Site Scripting (XSS)
                </div>
                <div className="text-xs text-[#9ca3af] space-y-2">
                  <p>
                    <strong className="text-white">Vulnerable pattern:</strong> Rendering raw untrusted input directly into DOM via <code className="text-rose-300">innerHTML</code> or unescaped HTML templates.
                  </p>
                  <p>
                    When an attacker inserts:
                  </p>
                  <pre className="bg-[#12141d] p-2 rounded text-[11px] text-rose-300 overflow-x-auto border border-rose-900/30 font-mono">
                    &lt;script&gt;alert('XSS SESSION STOLEN!')&lt;/script&gt;
                  </pre>
                  <p>
                    The browser parses the tags as executable script instructions, allowing arbitrary JavaScript execution with access to cookies, localStorage, and session tokens.
                  </p>
                  <div className="pt-2 border-t border-[#1e2235]">
                    <strong className="text-emerald-400 flex items-center gap-1.5 mb-1">
                      <Lock className="w-3.5 h-3.5" /> Remediation: Context-Aware Escaping
                    </strong>
                    <pre className="bg-[#12141d] p-2 rounded text-[11px] text-emerald-300 overflow-x-auto border border-emerald-900/30 font-mono">
                      element.textContent = userComment; // or React JSX {'{comment}'}
                    </pre>
                    <p className="mt-1">
                      HTML characters are encoded (<code className="text-emerald-300">&amp;lt;script&amp;gt;</code>) and rendered harmlessly as plain text without execution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard Card from index4 */
          <div className="bg-[#12141d] border border-[#1e2235] rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2.5 text-base font-semibold mb-1.5">
              <span>🛡️</span>
              <span>Vulnerability &amp; Remediation Visualizer</span>
            </div>
            <div className="text-[#9ca3af] text-[13px] mb-5">
              Problem P19: Interactive SQL Injection &amp; Cross-Site Scripting Execution Model
            </div>

            {/* Form Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.5px]">
                  Full Name
                </label>
                <input
                  type="text"
                  id="nameInput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#090a0f] border border-[#1e2235] text-[#f3f4f6] p-3 rounded-lg text-[13px] outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/25"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.5px]">
                  Account Email / Lookup Field (SQLi Target)
                </label>
                <input
                  type="text"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#090a0f] border border-[#1e2235] text-[#f3f4f6] p-3 rounded-lg text-[13px] outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/25 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.5px]">
                  Public Feedback / Comment (XSS Target)
                </label>
                <textarea
                  id="commentInput"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-[#090a0f] border border-[#1e2235] text-[#f3f4f6] p-3 rounded-lg text-[13px] outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/25 h-[65px] resize-none font-mono"
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-5 gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#9ca3af]">
                <span>Quick Attack Vectors:</span>
                <button
                  type="button"
                  id="btn-preset-normal"
                  onClick={() => loadPreset('normal')}
                  className="bg-[#181b29] border border-[#1e2235] hover:bg-[#6366f1] hover:border-[#6366f1] text-[#f3f4f6] px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer"
                >
                  Legit User
                </button>
                <button
                  type="button"
                  id="btn-preset-sqli"
                  onClick={() => loadPreset('sqli')}
                  className="bg-[#181b29] border border-[#1e2235] hover:bg-rose-600 hover:border-rose-600 text-[#f3f4f6] px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer"
                >
                  SQLi In Email
                </button>
                <button
                  type="button"
                  id="btn-preset-xss"
                  onClick={() => loadPreset('xss')}
                  className="bg-[#181b29] border border-[#1e2235] hover:bg-amber-600 hover:border-amber-600 text-[#f3f4f6] px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer"
                >
                  XSS In Feedback
                </button>
              </div>

              <button
                type="button"
                id="btn-submit-simulation"
                disabled={isSimulating}
                onClick={runSimulation}
                className="bg-[#6366f1] hover:opacity-90 active:scale-95 text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-[0_4px_12px_rgba(99,102,241,0.25)] transition-all cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Racing Pipelines...</span>
                  </>
                ) : (
                  <span>Run Execution Simulation</span>
                )}
              </button>
            </div>

            {/* Race Pipeline Tracks */}
            <div className="flex flex-col gap-3">
              {/* Vulnerable Path */}
              <div className="bg-[#090a0f] border border-[#1e2235] p-3.5 rounded-lg border-l-4 border-l-[#ef4444]">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-[#ef4444] flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#ef4444]"></span>
                    🔴 VULNERABLE PIPELINE (String Concatenation &amp; Unescaped DOM)
                  </span>
                  <span
                    id="vuln-status"
                    className={`font-mono ${
                      vulnStatus === 'BREACH'
                        ? 'text-[#ef4444] font-bold animate-pulse'
                        : 'text-[#ef4444]'
                    }`}
                  >
                    {getVulnStatusText()}
                  </span>
                </div>

                <div className="relative h-7 my-2 flex items-center">
                  <div className="absolute left-0 right-[30px] top-1/2 -translate-y-1/2 border-b border-dashed border-[#1e2235]"></div>
                  
                  {/* Vulnerable Finish Box */}
                  <div
                    id="vuln-icon"
                    className={`absolute right-0 w-6 h-6 rounded-md flex items-center justify-center text-xs bg-[#181b29] border border-[#1e2235] transition-transform ${
                      vulnStatus === 'BREACH' ? 'scale-125 border-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''
                    }`}
                  >
                    {vulnIcon}
                  </div>

                  {/* Vulnerable Car SVG */}
                  <svg
                    id="car-vuln"
                    className="absolute w-5 h-3.5 top-1/2 -translate-y-1/2 z-10 fill-[#ef4444] transition-all duration-75"
                    style={{ left: `${vulnCarLeft}%` }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                </div>

                <div
                  id="vuln-details"
                  className="bg-[#12141d] border border-[#1e2235] p-2 text-[11px] font-mono rounded-md mt-1.5 text-[#9ca3af] break-all"
                >
                  {vulnDetails}
                </div>
              </div>

              {/* Secure Path */}
              <div className="bg-[#090a0f] border border-[#1e2235] p-3.5 rounded-lg border-l-4 border-l-[#10b981]">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-[#10b981] flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#10b981]"></span>
                    🟢 SECURE PIPELINE (Parameterized Query &amp; Context Escaping)
                  </span>
                  <span
                    id="safe-status"
                    className={`font-mono ${
                      safeStatus === 'NEUTRALIZED'
                        ? 'text-amber-400 font-bold'
                        : 'text-[#10b981]'
                    }`}
                  >
                    {getSafeStatusText()}
                  </span>
                </div>

                <div className="relative h-7 my-2 flex items-center">
                  <div className="absolute left-0 right-[30px] top-1/2 -translate-y-1/2 border-b border-dashed border-[#1e2235]"></div>
                  
                  {/* Secure Finish Box */}
                  <div
                    id="safe-icon"
                    className={`absolute right-0 w-6 h-6 rounded-md flex items-center justify-center text-xs bg-[#181b29] border border-[#1e2235] transition-transform ${
                      safeStatus === 'NEUTRALIZED' ? 'scale-125 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''
                    }`}
                  >
                    {safeIcon}
                  </div>

                  {/* Secure Car SVG */}
                  <svg
                    id="car-safe"
                    className="absolute w-5 h-3.5 top-1/2 -translate-y-1/2 z-10 fill-[#10b981] transition-all duration-75"
                    style={{ left: `${safeCarLeft}%` }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                </div>

                <div
                  id="safe-details"
                  className="bg-[#12141d] border border-[#1e2235] p-2 text-[11px] font-mono rounded-md mt-1.5 text-[#9ca3af] break-all"
                >
                  {safeDetails}
                </div>
              </div>
            </div>

            {/* Output Display Banner */}
            <div
              id="renderOutput"
              className={`mt-4 rounded-lg p-4 text-sm font-semibold min-h-[52px] flex items-center transition-all duration-300 border ${
                renderOutput.type === 'sqli' || renderOutput.type === 'xss'
                  ? 'border-[#ef4444] bg-[rgba(239,68,68,0.08)] shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse text-[#ef4444]'
                  : renderOutput.type === 'safe'
                  ? 'border-[#10b981] bg-[rgba(16,185,129,0.08)] text-[#10b981]'
                  : 'bg-[#090a0f] border-[#1e2235] text-[#9ca3af]'
              }`}
            >
              {renderOutput.text}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Simulated XSS Exploit Modal */}
      {showXssModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141d] border-2 border-rose-500 rounded-xl max-w-md w-full p-5 shadow-[0_0_40px_rgba(239,68,68,0.4)] space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-lg bg-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  ⚠️ XSS Execution Triggered
                </h3>
                <p className="text-xs text-rose-300">Simulated JavaScript Alert Payload</p>
              </div>
            </div>

            <div className="bg-[#090a0f] p-3 rounded-lg border border-rose-900/50 font-mono text-xs text-rose-200">
              <div className="text-gray-400 text-[10px] uppercase mb-1">Payload Executed:</div>
              {comment}
            </div>

            <div className="text-xs text-[#9ca3af] space-y-1 bg-[#181b29] p-3 rounded-lg border border-[#1e2235]">
              <div className="font-semibold text-white flex items-center gap-1">
                <span>💥 Simulated Compromise Impact:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-300">
                <li><code className="text-amber-300">document.cookie</code> access: Session token hijacked</li>
                <li>Attacker can forge requests on victim's behalf</li>
                <li>Unescaped DOM injection executed directly in browser thread</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowXssModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Acknowledge Alert &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
