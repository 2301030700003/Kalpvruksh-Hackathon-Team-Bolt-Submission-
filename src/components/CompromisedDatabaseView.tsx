import React, { useState } from 'react';
import { FormSubmission, BreachIncident } from '../types';
import ExfiltratedRecordsTable from './ExfiltratedRecordsTable';
import { 
  Database, 
  Shield, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  RotateCcw, 
  Terminal, 
  Sparkles,
  Zap,
  Activity,
  Flame,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface CompromisedDatabaseViewProps {
  hasBreach?: boolean;
  latestBreach: BreachIncident | null;
  breachHistory?: BreachIncident[];
  submissions: FormSubmission[];
  onNavigateToForm: () => void;
  onNavigateToVisualizer: () => void;
  onResetBreach: () => void;
  onSimulateAttack?: (type: 'sqli' | 'xss') => void;
  onTriggerSimulatedAttack?: (type: 'sqli' | 'xss') => void;
}

export default function CompromisedDatabaseView({
  hasBreach: explicitHasBreach,
  latestBreach,
  breachHistory = [],
  submissions,
  onNavigateToForm,
  onNavigateToVisualizer,
  onResetBreach,
  onSimulateAttack,
  onTriggerSimulatedAttack,
}: CompromisedDatabaseViewProps) {
  const [showRemediationInfo, setShowRemediationInfo] = useState(false);
  const hasBreach = explicitHasBreach ?? Boolean(latestBreach);

  const handleSimulate = (type: 'sqli' | 'xss') => {
    if (onSimulateAttack) {
      onSimulateAttack(type);
    } else if (onTriggerSimulatedAttack) {
      onTriggerSimulatedAttack(type);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#12141d] border border-[#1e2235] p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            hasBreach 
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' 
              : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
          }`}>
            {hasBreach ? (
              <Flame className="w-6 h-6 animate-pulse" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-wide">
                Page 3: Database &amp; User Records Vault
              </h1>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                hasBreach
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
              }`}>
                {hasBreach ? 'BREACH DETECTED • RECORDS EXPOSED' : 'SECURE • ENCLAVE LOCKED'}
              </span>
            </div>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              Practical demonstration: inspect exfiltrated user records, session tokens, and passwords only when an attack succeeds.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {hasBreach ? (
            <button
              type="button"
              onClick={onResetBreach}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-md"
              title="Apply patch and re-seal the database"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Patch DB &amp; Re-lock Vault</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSimulate('sqli')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/50 hover:bg-rose-900/60 border border-rose-700/50 text-rose-300 transition-all cursor-pointer"
              >
                <Zap className="w-3 h-3 text-rose-400" />
                <span>Simulate SQLi Breach</span>
              </button>
              <button
                type="button"
                onClick={() => handleSimulate('xss')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/50 text-amber-300 transition-all cursor-pointer"
              >
                <Terminal className="w-3 h-3 text-amber-400" />
                <span>Simulate XSS Breach</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Rendering Based on Attack Status */}
      {!hasBreach ? (
        /* SAFE STATE: No Attack Detected Yet */
        <div className="bg-[#12141d] border border-[#1e2235] rounded-xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-lg font-bold text-white">
              Database Vault Is Locked — Zero Breaches Detected
            </h2>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              This page holds all private submissions, user accounts, password hashes, and active session tokens.
              In accordance with zero-trust architecture, <strong className="text-white">user records and exfiltration telemetry are completely hidden</strong> until a valid SQL Injection or Cross-Site Scripting exploit compromises the data layer.
            </p>
          </div>

          {/* Educational Comparison Box */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
            <div className="bg-[#090a0f] border border-emerald-900/40 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Why It's Currently Protected</span>
              </div>
              <ul className="text-[11px] text-gray-400 space-y-1 list-disc list-inside">
                <li>Strict parameterized queries bind user inputs as data literals</li>
                <li>HTML entity escaping neutralizes malicious scripts before DOM rendering</li>
                <li>Sensitive tables cannot be joined or dumped without authentication</li>
              </ul>
            </div>

            <div className="bg-[#090a0f] border border-rose-900/40 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <Flame className="w-4 h-4" />
                <span>How to Unlock This Page</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Execute an attack payload from Page 1 (Google Form) or Page 2 (Security Visualizer). Once the vulnerability triggers, this page will automatically unlock and reveal the live breached database!
              </p>
            </div>
          </div>

          {/* Action Launchers */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onNavigateToVisualizer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Go to Security Visualizer (Page 2)</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToForm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#673ab7] hover:bg-[#5e35b1] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Go to Google Form (Page 1)</span>
            </button>
          </div>
        </div>
      ) : (
        /* BREACHED STATE: Attack Detected -> Reveal Compromised Database */
        <div className="space-y-6">
          
          {/* Active Incident Alert Banner */}
          <div className="bg-gradient-to-r from-rose-950/70 via-[#181b29] to-rose-950/70 border-2 border-rose-500 rounded-xl p-5 shadow-[0_0_40px_rgba(239,68,68,0.25)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-6 h-6 text-rose-500 animate-bounce" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>⚠️ {latestBreach?.title || 'Data Exfiltration Active'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white">
                      {latestBreach?.attackType.toUpperCase() || 'EXPLOIT'}
                    </span>
                  </h2>
                  <p className="text-xs text-rose-300">
                    {latestBreach?.summary || 'Attacker bypassed security boundaries and compromised the submission records database.'}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-gray-400 font-mono">
                <div>Incident Time: <span className="text-white">{latestBreach?.timestamp || new Date().toLocaleTimeString()}</span></div>
                <div>Status: <span className="text-rose-400 font-bold">Unauthenticated Leakage</span></div>
              </div>
            </div>

            {/* Active Payload Inspect */}
            {latestBreach?.payload && (
              <div className="bg-[#090a0f] p-3 rounded-lg border border-rose-900/60 font-mono text-xs text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="truncate max-w-full">
                  <span className="text-gray-400 text-[10px] uppercase block sm:inline mr-2">Injected Payload:</span>
                  <code className="text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">
                    {latestBreach.attackType === 'sqli' ? latestBreach.payload.email : latestBreach.payload.comment}
                  </code>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">
                  Target: {latestBreach.attackType === 'sqli' ? 'WHERE email = ...' : 'innerHTML / feedback DOM'}
                </span>
              </div>
            )}
          </div>

          {/* The Live Records Table & Telemetry Chart Component */}
          <ExfiltratedRecordsTable
            attackType={latestBreach?.attackType || 'sqli'}
            submissions={submissions}
            activePayload={latestBreach?.payload}
            onNavigateToForm={onNavigateToForm}
          />
        </div>
      )}

    </div>
  );
}
