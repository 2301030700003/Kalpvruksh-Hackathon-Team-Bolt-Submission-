import React, { useState, useEffect, useRef } from 'react';
import { FormSubmission, AttackPresetType, BreachIncident } from '../types';
import { ATTACK_PAYLOADS, AttackPayload } from '../data/payloads';
import PayloadSelectorModal from './PayloadSelectorModal';
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
  Info,
  ChevronDown,
  Clock,
  Trash2,
  Layers,
  Sparkles
} from 'lucide-react';

interface SecurityVisualizerProps {
  initialData?: {
    name: string;
    email: string;
    comment: string;
  };
  latestFormSubmission?: FormSubmission | null;
  submissions?: FormSubmission[];
  hasBreachOccurred?: boolean;
  onNavigateToForm?: () => void;
  onNavigateToExfiltrated?: () => void;
  onBreachDetected?: (breach: BreachIncident) => void;
}

export default function SecurityVisualizer({
  initialData,
  latestFormSubmission,
  submissions = [],
  hasBreachOccurred = false,
  onNavigateToForm,
  onNavigateToExfiltrated,
  onBreachDetected,
}: SecurityVisualizerProps) {
  const [name, setName] = useState(initialData?.name || 'Alex Mercer');
  const [email, setEmail] = useState(initialData?.email || 'alex@matrix.com');
  const [comment, setComment] = useState(
    initialData?.comment || 'Great application platform!'
  );

  // Animation states matching Race.html
  const [vulnStatusText, setVulnStatusText] = useState<string>('READY FOR LAUNCH');
  const [safeStatusText, setSafeStatusText] = useState<string>('READY FOR LAUNCH');
  const [vulnStatus, setVulnStatus] = useState<'READY' | 'INGESTING...' | 'BREACH' | 'SAFE'>('READY');
  const [safeStatus, setSafeStatus] = useState<'READY' | 'SANITIZING...' | 'NEUTRALIZED' | 'SAFE'>('READY');
  const [vulnIcon, setVulnIcon] = useState('💀');
  const [safeIcon, setSafeIcon] = useState('🛡️');
  const [vulnDetails, setVulnDetails] = useState("SELECT * FROM users WHERE name = ''");
  const [safeDetails, setSafeDetails] = useState('SELECT * FROM users WHERE name = ?');

  const [vulnExplain, setVulnExplain] = useState<{ label: string; text: string; codeTag?: string }>({
    label: 'What happens:',
    text: 'User input is spliced directly into application code. Sneaky quotes escape the search parameter and hijack database logic.',
  });
  const [safeExplain, setSafeExplain] = useState<{ label: string; text: string; codeTag?: string }>({
    label: 'What happens:',
    text: 'Input is isolated in a literal text parameter container. No matter what symbols are typed, they can never execute as code.',
  });

  const [renderOutput, setRenderOutput] = useState<{
    text: string;
    type: 'initial' | 'sqli' | 'xss' | 'safe';
  }>({
    text: '> Submission Feed Display: Submit form data to execute security analysis.',
    type: 'initial',
  });

  const [simulatedAttackType, setSimulatedAttackType] = useState<'sqli' | 'xss' | 'safe' | 'idle'>('idle');
  const [vulnCarLeft, setVulnCarLeft] = useState(0);
  const [safeCarLeft, setSafeCarLeft] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showXssModal, setShowXssModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'explanation'>('visualizer');

  // Payload library modal & selected payload details
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [selectedPayloadMeta, setSelectedPayloadMeta] = useState<AttackPayload | null>(null);
  const [timeDelayCountdown, setTimeDelayCountdown] = useState<number | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const carVulnRef = useRef<SVGSVGElement | null>(null);
  const carSafeRef = useRef<SVGSVGElement | null>(null);

  // If initialData changes or a new submission is received from the Google Form
  useEffect(() => {
    if (latestFormSubmission) {
      setName(latestFormSubmission.name);
      setEmail(latestFormSubmission.email);
      setComment(latestFormSubmission.feedback);
    }
  }, [latestFormSubmission]);

  const handleApplyPayload = (payloadItem: AttackPayload) => {
    setSelectedPayloadMeta(payloadItem);

    if (payloadItem.category === 'sqli') {
      setEmail(payloadItem.payload);
      setName(
        payloadItem.id === 'sqli_auth_4'
          ? 'admin'
          : payloadItem.isDestructive
          ? 'Attacker_Dropper'
          : payloadItem.isTimeDelay
          ? 'Attacker_TimeProbe'
          : 'Attacker_SQLi'
      );
      setComment(`Testing ${payloadItem.name} — ${payloadItem.practicalImpact}`);
      setSimulatedAttackType('sqli');
      setVulnDetails(`SELECT * FROM users WHERE name = '${payloadItem.payload}'`);
      setSafeDetails(`SELECT * FROM users WHERE name = ?  [Param: "${payloadItem.payload}"]`);
    } else {
      setComment(payloadItem.payload);
      setName(
        payloadItem.id.includes('cookie')
          ? 'Hacker_SessionStealer'
          : payloadItem.id.includes('obfuscated')
          ? 'Hacker_Evasion'
          : 'Pentester_XSS'
      );
      setEmail('hacker@evil.com');
      setSimulatedAttackType('xss');
      setVulnDetails(`element.innerHTML = "<div>${payloadItem.payload}</div>"`);
      setSafeDetails(`element.textContent = "${payloadItem.payload}"  [Escaped text literal]`);
    }
  };

  const loadPreset = (type: AttackPresetType) => {
    if (type === 'normal') {
      setName('Alex Mercer');
      setEmail('alex@company.com');
      setComment('Great platform, smooth experience!');
      setSimulatedAttackType('safe');
      setSelectedPayloadMeta(null);
      setVulnDetails("SELECT * FROM users WHERE name = 'alex@company.com'");
      setSafeDetails('SELECT * FROM users WHERE name = ?  [Param: "alex@company.com"]');
    } else if (type === 'sqli') {
      const p = ATTACK_PAYLOADS.find((item) => item.id === 'sqli_auth_1')!;
      handleApplyPayload(p);
    } else if (type === 'xss') {
      const p = ATTACK_PAYLOADS.find((item) => item.id === 'xss_script_basic')!;
      handleApplyPayload(p);
    }
  };

  const handleImportLatestForm = () => {
    if (latestFormSubmission) {
      setName(latestFormSubmission.name);
      setEmail(latestFormSubmission.email);
      setComment(latestFormSubmission.feedback);
      if (latestFormSubmission.hasSQLi) {
        setSimulatedAttackType('sqli');
      } else if (latestFormSubmission.hasXSS) {
        setSimulatedAttackType('xss');
      }
    }
  };

  const runSimulation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsSimulating(true);

    // Reset car elements & positions immediately (matching Race.html)
    if (carVulnRef.current) carVulnRef.current.style.left = '0%';
    if (carSafeRef.current) carSafeRef.current.style.left = '0%';
    setVulnCarLeft(0);
    setSafeCarLeft(0);

    setVulnStatusText('EXECUTING RAW QUERY...');
    setSafeStatusText('SANITIZING PARAMETER...');
    setVulnStatus('INGESTING...');
    setSafeStatus('SANITIZING...');

    const isTimeDelay =
      email.includes('SLEEP(') ||
      email.includes('WAITFOR DELAY') ||
      email.includes('pg_sleep');

    const isDestructive = email.includes('DROP TABLE');
    const isUnion = email.includes('UNION SELECT');

    const hasSQLi =
      email.includes("' OR '1'='1") ||
      email.includes("' OR 1=1") ||
      email.includes("' OR '") ||
      email.includes("'; DROP") ||
      email.includes("'--") ||
      email.includes('" OR ""="') ||
      email.includes("admin'") ||
      isUnion ||
      isTimeDelay ||
      isDestructive;
    
    const hasXSS =
      comment.includes('<script') ||
      comment.includes('onerror=') ||
      comment.includes('onload=') ||
      comment.includes('onfocus=') ||
      comment.includes('javascript:') ||
      comment.includes('<svg') ||
      comment.includes('<img') ||
      comment.includes('<body') ||
      comment.includes('eval(') ||
      comment.includes('document.cookie');

    // Update query code boxes (matching Race.html)
    if (hasXSS) {
      setVulnDetails(`element.innerHTML = "<div>${comment}</div>"`);
      setSafeDetails(`element.textContent = "${comment}"  [Escaped HTML text]`);
    } else {
      setVulnDetails(`SELECT * FROM users WHERE name = '${email}'`);
      setSafeDetails(`SELECT * FROM users WHERE name = ?  [Param: "${email}"]`);
    }

    const isMalicious = hasSQLi || hasXSS;

    // Target positions: Vuln always reaches end (88%), Safe stops at Checkpoint (56%) if attack detected
    const targetVuln = 88;
    const targetSafe = isMalicious ? 56 : 88;

    const duration = isTimeDelay ? 3200 : 1500;
    const startTime = performance.now();

    if (isTimeDelay) {
      setTimeDelayCountdown(5);
      const timer = setInterval(() => {
        setTimeDelayCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 700);
      setTimeout(() => clearInterval(timer), 3500);
    } else {
      setTimeDelayCountdown(null);
    }

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentVuln = progress * targetVuln;
      const currentSafe = progress * targetSafe;

      // Update DOM style directly for silky 60fps movement (no React scheduler delay)
      if (carVulnRef.current) {
        carVulnRef.current.style.left = `${currentVuln}%`;
      }
      if (carSafeRef.current) {
        carSafeRef.current.style.left = `${currentSafe}%`;
      }

      setVulnCarLeft(currentVuln);
      setSafeCarLeft(currentSafe);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulating(false);
        setTimeDelayCountdown(null);
        evaluateOutcome(hasSQLi, hasXSS, comment, { isTimeDelay, isDestructive, isUnion });
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const evaluateOutcome = (
    hasSQLi: boolean,
    hasXSS: boolean,
    rawComment: string,
    flags?: { isTimeDelay?: boolean; isDestructive?: boolean; isUnion?: boolean }
  ) => {
    if (hasSQLi) {
      setVulnStatus('BREACH');
      setVulnStatusText('🚨 CRITICAL LEAK: DATABASE EXPOSED!');
      setVulnIcon('💥');
      setVulnExplain({
        label: 'Damage:',
        text: 'The single quote broke out of the parameter field. The database evaluated 1=1 as TRUE and dumped all user records!',
        codeTag: '1=1',
      });

      setSafeStatus('NEUTRALIZED');
      setSafeStatusText('🛡️ BLOCKED AT CHECKPOINT: PARAMETERIZED');
      setSafeIcon('🛑');
      setSafeExplain({
        label: 'Protection:',
        text: 'Parameter binding trapped the quote marks as simple literal text, stopping the SQL command hijack at the barrier.',
      });

      setSimulatedAttackType('sqli');

      let exploitText = "⚠️ DATABASE EXPLOIT: Raw query evaluated '1'='1' as TRUE. Private user records leaked!";
      if (flags?.isTimeDelay) {
        exploitText = "⏱️ TIME-BASED BLIND EXPLOIT: Injected SLEEP(5) halted backend database thread for 5.0s! Server latency verified vulnerability.";
        setVulnExplain({
          label: 'Damage:',
          text: 'The backend database thread was halted for 5 seconds by injected SLEEP query, confirming blind SQL injection through server response latency.',
          codeTag: 'SLEEP(5)',
        });
      } else if (flags?.isDestructive) {
        exploitText = "🚨 CRITICAL DDL EXPLOIT: Stacked query DROP TABLE users executed! Database table dropped in vulnerable mode.";
        setVulnExplain({
          label: 'Damage:',
          text: 'Stacked query execution dropped the users table! High-privileged database connection allowed destructive DDL operations.',
          codeTag: 'DROP TABLE',
        });
      } else if (flags?.isUnion) {
        exploitText = "📊 UNION QUERY EXPLOIT: Appended secondary query extracting 'users' passwords and system catalog schemas!";
        setVulnExplain({
          label: 'Damage:',
          text: "The attacker appended a second SELECT query to extract usernames, bcrypt password hashes, and schema definitions into the response.",
          codeTag: 'UNION SELECT',
        });
      }

      setRenderOutput({
        type: 'sqli',
        text: exploitText,
      });

      onBreachDetected?.({
        id: `breach_sqli_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        attackType: 'sqli',
        payload: { email, comment },
        title: flags?.isTimeDelay
          ? 'Time-Based Blind SQLi Incident'
          : flags?.isDestructive
          ? 'Destructive DDL SQLi Incident'
          : flags?.isUnion
          ? 'Union-Based Table Dump SQLi Incident'
          : 'SQL Injection Authentication Bypass Incident',
        summary: exploitText,
        subCategory: flags?.isTimeDelay ? 'Time-Based Blind' : flags?.isUnion ? 'Union-Based' : 'Auth Bypass',
      });
    } else if (hasXSS) {
      setVulnStatus('BREACH');
      setVulnStatusText('🚨 XSS EXECUTED: SCRIPT INJECTED!');
      setVulnIcon('☣️');
      setVulnExplain({
        label: 'Damage:',
        text: 'Unescaped HTML tags were rendered directly into the browser DOM, causing arbitrary JavaScript to execute.',
        codeTag: '<script>',
      });

      setSafeStatus('NEUTRALIZED');
      setSafeStatusText('🛡️ INTERCEPTED: CONTEXTUALLY ESCAPED');
      setSafeIcon('🛑');
      setSafeExplain({
        label: 'Protection:',
        text: 'HTML entities (<script>) were neutralized at the barrier, preventing DOM script execution.',
        codeTag: '<script>',
      });

      setSimulatedAttackType('xss');

      let xssText = '⚠️ DOM EXPLOIT: Unescaped comment executed script inside browser context!';
      if (rawComment.includes('onerror=') || rawComment.includes('<img')) {
        xssText = '☣️ EVENT HANDLER BYPASS: Filter evaded via <img onerror>. Executed immediately on image error!';
      } else if (rawComment.includes('onload=') || rawComment.includes('<svg')) {
        xssText = '☣️ EVENT HANDLER BYPASS: SVG/Body onload event handler triggered without user interaction!';
      } else if (rawComment.includes('document.cookie') || rawComment.includes('steal.js')) {
        xssText = '☣️ SESSION HIJACKING: Stole document.cookie & auth bearer tokens and exfiltrated to attacker!';
      } else if (rawComment.includes('eval(') || rawComment.includes('atob(')) {
        xssText = '☣️ OBFUSCATED EVAL BYPASS: Base64 payload decoded and executed dynamically to evade static filters!';
      }

      setRenderOutput({
        type: 'xss',
        text: xssText,
      });

      onBreachDetected?.({
        id: `breach_xss_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        attackType: 'xss',
        payload: { email, comment },
        title: 'Cross-Site Scripting (XSS) DOM Execution Incident',
        summary: xssText,
        subCategory: 'DOM Injection / Event Handler',
      });

      setShowXssModal(true);
    } else {
      setVulnStatus('SAFE');
      setVulnStatusText('⚠️ UNPROTECTED QUERY COMPLETED');
      setVulnIcon('⚠️');
      setVulnExplain({
        label: 'Warning:',
        text: 'Standard input passed through, but string concatenation leaves this path wide open to exploits.',
      });

      setSafeStatus('SAFE');
      setSafeStatusText('✅ SAFE INPUT PASSED TO ENDPOINT');
      setSafeIcon('🛡️');
      setSafeExplain({
        label: 'Safe:',
        text: 'Normal string verified and bound securely to query execution.',
      });

      setSimulatedAttackType('safe');
      setRenderOutput({
        type: 'safe',
        text: `✅ Submission Feed Display: "${rawComment}" (Rendered Safely)`,
      });
    }
  };

  const getVulnStatusText = () => vulnStatusText;
  const getSafeStatusText = () => safeStatusText;

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
            {onNavigateToExfiltrated && (
              <button
                type="button"
                onClick={onNavigateToExfiltrated}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border flex items-center gap-1.5 cursor-pointer ${
                  hasBreachOccurred
                    ? 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-500/60 animate-pulse'
                    : 'bg-[#12141d] hover:bg-[#181b29] text-[#9ca3af] border-[#1e2235]'
                }`}
                title="Open Page 3: Compromised Database & Exfiltrated Records"
              >
                <Database className={`w-3.5 h-3.5 ${hasBreachOccurred ? 'text-rose-400' : 'text-gray-400'}`} />
                <span>Page 3: Compromised DB</span>
                {hasBreachOccurred ? (
                  <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                    Breached
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">🔒</span>
                )}
              </button>
            )}
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
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#9ca3af]">
                  <span className="font-semibold text-white">Vectors:</span>
                  <button
                    type="button"
                    id="btn-preset-normal"
                    onClick={() => loadPreset('normal')}
                    className="bg-[#181b29] border border-[#1e2235] hover:bg-[#6366f1] hover:border-[#6366f1] text-[#f3f4f6] px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer font-medium"
                  >
                    Clean User
                  </button>

                  <span className="text-gray-600">|</span>

                  {/* SQLi Quick Vectors */}
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'sqli_auth_1')!)}
                    className="bg-[#181b29] border border-rose-900/40 hover:bg-rose-900/50 text-rose-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer"
                    title="Bypass: ' OR '1'='1"
                  >
                    SQLi: ' OR '1'='1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'sqli_union_users')!)}
                    className="bg-[#181b29] border border-rose-900/40 hover:bg-rose-900/50 text-rose-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer"
                    title="Union: Extract Users & Hashes"
                  >
                    SQLi: UNION
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'sqli_time_mysql')!)}
                    className="bg-[#181b29] border border-rose-900/40 hover:bg-rose-900/50 text-rose-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1"
                    title="Time-Based Blind: SLEEP(5)"
                  >
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>SQLi: SLEEP(5)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'sqli_drop_table')!)}
                    className="bg-red-950/40 border border-red-700/60 hover:bg-red-900/60 text-red-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1 font-bold"
                    title="Destructive: '; DROP TABLE users; --"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                    <span>DROP TABLE</span>
                  </button>

                  <span className="text-gray-600">|</span>

                  {/* XSS Quick Vectors */}
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'xss_script_basic')!)}
                    className="bg-[#181b29] border border-amber-900/40 hover:bg-amber-900/50 text-amber-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer"
                    title="Standard script tag"
                  >
                    XSS: &lt;script&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'xss_event_img')!)}
                    className="bg-[#181b29] border border-amber-900/40 hover:bg-amber-900/50 text-amber-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer"
                    title="Event Handler bypass"
                  >
                    XSS: &lt;img onerror&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'xss_attr_cookie_steal')!)}
                    className="bg-[#181b29] border border-amber-900/40 hover:bg-amber-900/50 text-amber-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer"
                    title="Cookie Stealer"
                  >
                    XSS: Cookie Steal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPayload(ATTACK_PAYLOADS.find(p => p.id === 'xss_obfuscated_base64')!)}
                    className="bg-[#181b29] border border-amber-900/40 hover:bg-amber-900/50 text-amber-300 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer"
                    title="Base64 Eval Bypass"
                  >
                    XSS: Base64
                  </button>
                </div>

                {/* Open Full 16-vector Modal */}
                <button
                  type="button"
                  onClick={() => setIsPayloadModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs bg-[#181b29] hover:bg-[#23273c] text-[#818cf8] border border-[#6366f1]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Browse 16 Payloads...</span>
                </button>
              </div>

              {/* Active Payload Details Banner */}
              {selectedPayloadMeta && (
                <div className="bg-[#181b29] border border-[#6366f1]/30 rounded-lg p-2.5 text-xs flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/40 px-1.5 py-0.2 rounded font-mono uppercase font-bold">
                        {selectedPayloadMeta.category.toUpperCase()} • {selectedPayloadMeta.subCategory}
                      </span>
                      <span className="font-semibold text-white">{selectedPayloadMeta.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {selectedPayloadMeta.description} — <strong className="text-rose-400">Impact:</strong> {selectedPayloadMeta.practicalImpact}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPayloadMeta(null)}
                    className="text-gray-500 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Time-Based Delay Countdown Indicator */}
              {timeDelayCountdown !== null && (
                <div className="bg-blue-950/40 border border-blue-500/40 rounded-lg p-2 text-xs text-blue-300 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                    <span>Simulating Backend Thread Sleep Delay: <strong>{timeDelayCountdown}s remaining</strong></span>
                  </div>
                  <span className="font-mono text-[10px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">
                    Vulnerable query thread suspended
                  </span>
                </div>
              )}

              {/* Execution Run Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  id="btn-submit-simulation"
                  disabled={isSimulating}
                  onClick={runSimulation}
                  className="w-full sm:w-auto bg-[#6366f1] hover:opacity-90 active:scale-95 text-white font-semibold text-[13px] px-6 py-2.5 rounded-lg shadow-[0_4px_12px_rgba(99,102,241,0.25)] transition-all cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2"
                >
                  {isSimulating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Racing Execution Engines...</span>
                    </>
                  ) : (
                    <span>Run Security Execution Simulation</span>
                  )}
                </button>
              </div>
            </div>

            {/* Race Pipeline Tracks matching Race.html */}
            <div className="flex flex-col gap-4">
              {/* Vulnerable Path Card */}
              <div className="bg-[#121424] border border-[#ff4757]/40 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center text-xs font-semibold mb-3">
                  <span className="bg-[#ff4757] text-black font-bold text-[11px] px-2.5 py-1 rounded tracking-wide uppercase">
                    🔴 VULNERABLE PATH
                  </span>
                  <span
                    id="vuln-status"
                    className={`font-mono text-xs tracking-wide ${
                      vulnStatus === 'BREACH'
                        ? 'text-[#ff4757] font-bold animate-pulse'
                        : 'text-[#ff4757]'
                    }`}
                  >
                    {vulnStatusText}
                  </span>
                </div>

                {/* Track */}
                <div className="relative h-9 my-3 flex items-center">
                  <div className="absolute left-0 right-[35px] top-1/2 -translate-y-1/2 border-b border-dashed border-white/20"></div>

                  {/* Checkpoint 1: Raw Input (30%) */}
                  <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-white/20">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-[#8c90b0] font-bold uppercase tracking-wider whitespace-nowrap">
                      Raw Input
                    </span>
                  </div>

                  {/* Checkpoint 2: String Concat (60%) */}
                  <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-white/20">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-[#8c90b0] font-bold uppercase tracking-wider whitespace-nowrap">
                      String Concat
                    </span>
                  </div>

                  {/* Finish Box */}
                  <div
                    id="vuln-icon"
                    className={`absolute right-0 w-7 h-7 rounded-md flex items-center justify-center text-sm bg-[rgba(255,71,87,0.15)] border border-[#ff4757] transition-all ${
                      vulnStatus === 'BREACH'
                        ? 'scale-125 border-rose-500 shadow-[0_0_12px_rgba(255,71,87,0.6)]'
                        : ''
                    }`}
                  >
                    {vulnIcon}
                  </div>

                  {/* Vulnerable Car SVG */}
                  <svg
                    ref={carVulnRef}
                    id="car-vuln"
                    className="absolute z-10"
                    style={{
                      left: `${vulnCarLeft}%`,
                      width: '24px',
                      height: '18px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#ff4757"
                      d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
                    />
                  </svg>
                </div>

                {/* Details Code Box */}
                <div
                  id="vuln-details"
                  className="bg-[#080914] border border-white/5 p-2 text-[11px] font-mono rounded-md mt-2 text-[#8c90b0] break-all"
                >
                  {vulnDetails}
                </div>

                {/* Normie Explanation */}
                <div
                  id="vuln-explain"
                  className="text-[12px] text-[#a0a4c5] mt-2 leading-relaxed"
                >
                  <strong className="text-white">{vulnExplain.label} </strong>
                  <span>{vulnExplain.text}</span>
                  {vulnExplain.codeTag && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold">
                      {vulnExplain.codeTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Secure Path Card */}
              <div className="bg-[#121424] border border-[#2ed573]/40 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center text-xs font-semibold mb-3">
                  <span className="bg-[#2ed573] text-black font-bold text-[11px] px-2.5 py-1 rounded tracking-wide uppercase">
                    🟢 SECURE PATH
                  </span>
                  <span
                    id="safe-status"
                    className={`font-mono text-xs tracking-wide ${
                      safeStatus === 'NEUTRALIZED'
                        ? 'text-[#2ed573] font-bold'
                        : 'text-[#2ed573]'
                    }`}
                  >
                    {safeStatusText}
                  </span>
                </div>

                {/* Track */}
                <div className="relative h-9 my-3 flex items-center">
                  <div className="absolute left-0 right-[35px] top-1/2 -translate-y-1/2 border-b border-dashed border-white/20"></div>

                  {/* Checkpoint 1: Raw Input (30%) */}
                  <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-white/20">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-[#8c90b0] font-bold uppercase tracking-wider whitespace-nowrap">
                      Raw Input
                    </span>
                  </div>

                  {/* Checkpoint 2: Parameterized (60%) */}
                  <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-white/20">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-[#8c90b0] font-bold uppercase tracking-wider whitespace-nowrap">
                      Parameterized
                    </span>
                  </div>

                  {/* Finish Box */}
                  <div
                    id="safe-icon"
                    className={`absolute right-0 w-7 h-7 rounded-md flex items-center justify-center text-sm bg-[rgba(46,213,115,0.15)] border border-[#2ed573] transition-all ${
                      safeStatus === 'NEUTRALIZED'
                        ? 'scale-125 border-emerald-400 shadow-[0_0_12px_rgba(46,213,115,0.6)]'
                        : ''
                    }`}
                  >
                    {safeIcon}
                  </div>

                  {/* Secure Car SVG */}
                  <svg
                    ref={carSafeRef}
                    id="car-safe"
                    className="absolute z-10"
                    style={{
                      left: `${safeCarLeft}%`,
                      width: '24px',
                      height: '18px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#2ed573"
                      d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
                    />
                  </svg>
                </div>

                {/* Details Code Box */}
                <div
                  id="safe-details"
                  className="bg-[#080914] border border-white/5 p-2 text-[11px] font-mono rounded-md mt-2 text-[#8c90b0] break-all"
                >
                  {safeDetails}
                </div>

                {/* Normie Explanation */}
                <div
                  id="safe-explain"
                  className="text-[12px] text-[#a0a4c5] mt-2 leading-relaxed"
                >
                  <strong className="text-white">{safeExplain.label} </strong>
                  <span>{safeExplain.text}</span>
                  {safeExplain.codeTag && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                      {safeExplain.codeTag}
                    </span>
                  )}
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

            {/* Breach Alert CTA pointing to Page 3 */}
            {vulnStatus === 'BREACH' && onNavigateToExfiltrated && (
              <div className="mt-4 p-4 bg-gradient-to-r from-rose-950/70 via-[#181b29] to-rose-950/70 border border-rose-500/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in shadow-[0_0_30px_rgba(239,68,68,0.25)]">
                <div className="flex items-center gap-3 text-xs text-rose-200">
                  <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                    <Database className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>Data Breach Confirmed</span>
                      <span className="text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.2 rounded font-bold uppercase">
                        Page 3 Unlocked
                      </span>
                    </div>
                    <p className="text-[12px] text-rose-300">
                      User records, password hashes, and active session tokens have been exfiltrated to the database vault.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onNavigateToExfiltrated}
                  className="shrink-0 flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <span>View Compromised DB (Page 3)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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
              {onNavigateToExfiltrated && (
                <button
                  type="button"
                  onClick={() => {
                    setShowXssModal(false);
                    onNavigateToExfiltrated();
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Inspect Compromised DB (Page 3)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowXssModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attack Payload Library Modal */}
      <PayloadSelectorModal
        isOpen={isPayloadModalOpen}
        onClose={() => setIsPayloadModalOpen(false)}
        onSelectPayload={handleApplyPayload}
        currentPageContext="visualizer"
      />
    </div>
  );
}
