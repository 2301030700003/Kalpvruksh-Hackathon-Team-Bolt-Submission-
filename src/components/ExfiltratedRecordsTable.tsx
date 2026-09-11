import React, { useState } from 'react';
import { FormSubmission } from '../types';
import { 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Search, 
  Terminal, 
  UserCheck, 
  ExternalLink,
  Zap,
  Radio,
  FileCode,
  Users
} from 'lucide-react';

interface ExfiltratedRecordsTableProps {
  attackType: 'sqli' | 'xss' | 'safe' | 'idle';
  submissions: FormSubmission[];
  activePayload?: {
    email: string;
    comment: string;
  };
  onNavigateToForm?: () => void;
}

export default function ExfiltratedRecordsTable({
  attackType,
  submissions,
  activePayload,
  onNavigateToForm,
}: ExfiltratedRecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FormSubmission | null>(null);

  const isBreach = attackType === 'sqli' || attackType === 'xss';
  const isSQLi = attackType === 'sqli';
  const isXSS = attackType === 'xss';
  const isSafe = attackType === 'safe';

  // In SQLi, 100% of all submitted database records are dumped
  // In XSS, all client-side submitted records and cookies are harvested
  // In Safe mode, only the specifically matched record (or 0) is returned
  const displayedRecords = submissions.filter((sub) => {
    if (isSafe && activePayload?.email) {
      // In safe lookup, only return records matching the email
      return sub.email.toLowerCase() === activePayload.email.toLowerCase();
    }
    // In SQLi or XSS, all rows are exposed!
    return true;
  }).filter((sub) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      sub.name.toLowerCase().includes(term) ||
      sub.email.toLowerCase().includes(term) ||
      (sub.role && sub.role.toLowerCase().includes(term)) ||
      sub.feedback.toLowerCase().includes(term)
    );
  });

  const handleCopyToken = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const handleCopyAllJson = () => {
    navigator.clipboard.writeText(JSON.stringify(displayedRecords, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const totalRecordsInDb = submissions.length;
  const leakedCount = isBreach ? submissions.length : isSafe ? (displayedRecords.length) : 0;
  const leakPercentage = totalRecordsInDb > 0 ? Math.round((leakedCount / totalRecordsInDb) * 100) : 0;

  return (
    <div className="w-full bg-[#12141d] border border-[#1e2235] rounded-xl p-5 sm:p-6 shadow-2xl space-y-6">
      
      {/* Header & Attack Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2235] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#6366f1]" />
            <h3 className="text-base font-bold text-white tracking-wide">
              {isSQLi && '🚨 SQL INJECTION PRACTICAL EXPLOIT: FULL DATABASE DUMP'}
              {isXSS && '☣️ CROSS-SITE SCRIPTING PRACTICAL EXPLOIT: DOM & SESSION HARVEST'}
              {isSafe && '🟢 SECURE PARAMETERIZED QUERY: CONFINED RECORD RETRIEVAL'}
              {attackType === 'idle' && '🛡️ DATABASE RECORDS & EXPOSURE MONITOR'}
            </h3>
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            {isSQLi && (
              <span>
                Raw SQL concatenation evaluated <code className="text-rose-400 font-mono font-bold">'1'='1'</code> as TRUE. The database returned <strong>all {totalRecordsInDb} registered user submission records</strong>!
              </span>
            )}
            {isXSS && (
              <span>
                Unescaped script executed in the DOM. Attacker harvested <strong>all client-visible submissions and active session tokens</strong>!
              </span>
            )}
            {isSafe && (
              <span>
                Parameterized query treated input strictly as literal text. Only authorized matched records returned without leaking other users' data.
              </span>
            )}
            {attackType === 'idle' && (
              <span>
                Live database registry containing all user submissions from Page 1 (Google Form) and presets. Run an attack to see how data is leaked.
              </span>
            )}
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          {isBreach ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/40 text-rose-400 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>DATA EXFILTRATED ({leakPercentage}%)</span>
            </span>
          ) : isSafe ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DATA ISOLATED &amp; SAFE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#181b29] border border-[#1e2235] text-gray-400">
              <Radio className="w-3.5 h-3.5 text-[#6366f1]" />
              <span>Awaiting Simulation</span>
            </span>
          )}
        </div>
      </div>

      {/* Exposure Telemetry & Comparison Chart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* Metric 1: Exposed Records */}
        <div className="bg-[#090a0f] border border-[#1e2235] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Users In Database
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{totalRecordsInDb}</span>
            <span className="text-xs text-gray-400 font-mono">Total Submitted</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Registered via Google Form or seeds
          </div>
        </div>

        {/* Metric 2: Leak Ratio */}
        <div className={`bg-[#090a0f] border p-3.5 rounded-lg flex flex-col justify-between ${
          isBreach ? 'border-rose-900/50 bg-rose-950/10' : 'border-[#1e2235]'
        }`}>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Leaked to Client
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${
              isBreach ? 'text-rose-400' : isSafe ? 'text-emerald-400' : 'text-gray-300'
            }`}>
              {isBreach ? `${leakedCount} / ${totalRecordsInDb}` : isSafe ? `${displayedRecords.length} / ${totalRecordsInDb}` : '0 Leaked'}
            </span>
            <span className="text-xs font-mono font-bold">
              {isBreach ? `${leakPercentage}%` : isSafe ? 'Protected' : '0%'}
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            {isSQLi ? 'Dumped via WHERE 1=1' : isXSS ? 'Harvested via DOM Hook' : 'Secured via Prepared Statement'}
          </div>
        </div>

        {/* Metric 3: Stolen Credentials */}
        <div className={`bg-[#090a0f] border p-3.5 rounded-lg flex flex-col justify-between ${
          isBreach ? 'border-amber-900/50 bg-amber-950/10' : 'border-[#1e2235]'
        }`}>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Exposed Auth Tokens
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${
              isBreach ? 'text-amber-400' : 'text-gray-300'
            }`}>
              {isBreach ? leakedCount : 0}
            </span>
            <span className="text-xs text-amber-300 font-mono">Sessions</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            {isBreach ? 'Cookies & bearer tokens compromised' : 'Zero auth credentials leaked'}
          </div>
        </div>

        {/* Metric 4: Pipeline Execution Outcome */}
        <div className="bg-[#090a0f] border border-[#1e2235] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Exploit Mechanics
          </span>
          <div className="mt-1.5 text-xs">
            {isSQLi && (
              <span className="text-rose-400 font-mono font-bold block">
                ' OR '1'='1' = ALWAYS TRUE
              </span>
            )}
            {isXSS && (
              <span className="text-amber-400 font-mono font-bold block">
                document.cookie EXFILTRATION
              </span>
            )}
            {isSafe && (
              <span className="text-emerald-400 font-mono font-bold block">
                PARAMETERIZED BINDING
              </span>
            )}
            {attackType === 'idle' && (
              <span className="text-gray-400 font-mono block">
                STANDBY FOR SIMULATION
              </span>
            )}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            {isBreach ? 'Confidentiality Compromised' : 'Confidentiality Preserved'}
          </div>
        </div>
      </div>

      {/* Visual Comparison Chart: Vulnerable vs Parameterized Data Exposure */}
      <div className="bg-[#090a0f] border border-[#1e2235] rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-gray-300">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-[#6366f1]" />
            Practical Data Exposure Comparison Chart
          </span>
          <span className="text-gray-500 font-normal">
            Visualizing the exact impact of SQLi / XSS on database confidentiality
          </span>
        </div>

        <div className="space-y-2.5 pt-1 text-xs">
          {/* Bar 1: Vulnerable Pipeline */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-rose-400 font-medium">
                🔴 Vulnerable Pipeline (Raw Concatenation / Unescaped DOM)
              </span>
              <span className="font-mono font-bold text-rose-400">
                {isBreach ? '100% of User Records Dumped' : 'Vulnerable to 100% Leak'}
              </span>
            </div>
            <div className="h-4 w-full bg-[#181b29] rounded-full overflow-hidden flex border border-rose-950">
              <div 
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-700 relative"
                style={{ width: isBreach ? '100%' : '90%' }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold tracking-wider">
                  ALL {totalRecordsInDb} USERS EXPOSED
                </span>
              </div>
            </div>
          </div>

          {/* Bar 2: Secure Pipeline */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-emerald-400 font-medium">
                🟢 Secure Pipeline (Parameterized Query: WHERE email = ? &amp; Sanitization)
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {isSafe ? '0% Data Leaked (Only exact match returned)' : '0% Unauthorized Leak'}
              </span>
            </div>
            <div className="h-4 w-full bg-[#181b29] rounded-full overflow-hidden flex border border-emerald-950">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 relative"
                style={{ width: isSafe ? '15%' : '0%' }}
              >
                <span className="absolute inset-0 flex items-center px-2 text-[9px] text-white font-bold">
                  {isSafe ? '1 Match' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaked User Records Table Header Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6366f1]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {isSQLi ? 'Dumped User Table (From Database Engine)' : isXSS ? 'Harvested User Sessions & Feed Table' : 'Registered Users Database Table'}
            </h4>
            <span className="bg-[#181b29] text-gray-400 border border-[#1e2235] text-[11px] px-2 py-0.5 rounded-full font-mono">
              {displayedRecords.length} records shown
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user, role, email..."
                className="w-full bg-[#090a0f] border border-[#1e2235] text-white text-xs pl-8 pr-3 py-1.5 rounded-lg focus:border-[#6366f1] outline-none"
              />
            </div>

            {/* Toggle Passwords Unmask */}
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-1.5 text-xs bg-[#181b29] hover:bg-[#23273c] text-gray-300 border border-[#1e2235] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Toggle simulated plaintext password decryption"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
              <span className="hidden sm:inline">{showPasswords ? 'Hide Plain Passwords' : 'Crack / Show Passwords'}</span>
            </button>

            {/* Copy JSON */}
            <button
              type="button"
              onClick={handleCopyAllJson}
              className="flex items-center gap-1.5 text-xs bg-[#181b29] hover:bg-[#23273c] text-gray-300 border border-[#1e2235] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Copy dumped records as JSON payload"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              <span className="hidden sm:inline">{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            {/* Add User via Google Form Shortcut */}
            {onNavigateToForm && (
              <button
                type="button"
                onClick={onNavigateToForm}
                className="flex items-center gap-1 text-xs bg-[#673ab7] hover:bg-[#5e35b1] text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Submit a new user from Google Form to see them added to this table"
              >
                <span>+ Add User in Form</span>
              </button>
            )}
          </div>
        </div>

        {/* Database Table */}
        <div className="overflow-x-auto rounded-xl border border-[#1e2235] bg-[#090a0f]">
          <table className="w-full text-left text-xs text-gray-300 border-collapse">
            <thead className="bg-[#181b29] text-[11px] uppercase tracking-wider text-gray-400 border-b border-[#1e2235]">
              <tr>
                <th className="py-3 px-3">User &amp; Role</th>
                <th className="py-3 px-3">Lookup Email</th>
                <th className="py-3 px-3">
                  {showPasswords ? 'Decrypted Password' : 'Exfiltrated Password Hash'}
                </th>
                <th className="py-3 px-3">Hijacked Session Token</th>
                <th className="py-3 px-3">Submitted Feedback / Comment</th>
                <th className="py-3 px-3">Status / Timestamp</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2235] font-mono">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500 font-sans">
                    No records found matching current query or filter.
                  </td>
                </tr>
              ) : (
                displayedRecords.map((record) => {
                  const isAttackerRecord = record.hasSQLi || record.hasXSS;

                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-[#12141d] transition-colors ${
                        isBreach
                          ? 'bg-rose-950/5'
                          : ''
                      }`}
                    >
                      {/* Name & Role */}
                      <td className="py-3 px-3 font-sans">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#181b29] border border-[#1e2235] flex items-center justify-center font-bold text-xs text-[#6366f1]">
                            {record.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{record.name}</span>
                              {isAttackerRecord && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-mono font-bold">
                                  ATTACKER
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {record.role || 'Application User'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3 text-amber-300">
                        <span className="bg-[#12141d] px-1.5 py-0.5 rounded border border-[#1e2235] break-all inline-block">
                          {record.email}
                        </span>
                      </td>

                      {/* Password Hash / Plain */}
                      <td className="py-3 px-3 text-rose-300">
                        {showPasswords ? (
                          <span className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-800">
                            {record.plainPasswordSimulated || 'SecretP@ss2026!'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px] truncate max-w-[140px] inline-block" title={record.passwordHash}>
                            {record.passwordHash || `$2b$12$e9K2...${record.id.slice(-4)}`}
                          </span>
                        )}
                      </td>

                      {/* Session Token */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] px-1.5 py-0.5 rounded truncate max-w-[130px] ${
                            isBreach ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 font-bold' : 'text-gray-400 bg-[#12141d]'
                          }`}>
                            {record.sessionToken || `sess_${record.id}_token`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyToken(record.id, record.sessionToken || `sess_${record.id}_token`)}
                            className="text-gray-500 hover:text-white p-1 rounded hover:bg-[#181b29] transition-colors"
                            title="Copy session token"
                          >
                            {copiedTokenId === record.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Feedback Comment */}
                      <td className="py-3 px-3 font-sans text-gray-300 max-w-[180px] truncate" title={record.feedback}>
                        {record.feedback}
                      </td>

                      {/* Timestamp & IP */}
                      <td className="py-3 px-3 font-sans text-gray-400 text-[11px]">
                        <div>{record.submittedAt}</div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {record.ipAddress || '192.168.1.42'}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(record)}
                          className="text-xs text-[#6366f1] hover:text-[#818cf8] hover:underline cursor-pointer"
                        >
                          Inspect Record
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected User Modal / Detail Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141d] border border-[#1e2235] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex justify-between items-start border-b border-[#1e2235] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#181b29] border border-[#1e2235] flex items-center justify-center font-bold text-sm text-[#6366f1]">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedUser.name}</h4>
                  <span className="text-gray-400 text-[11px]">{selectedUser.role || 'Member'} • ID: {selectedUser.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white text-base font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="bg-[#090a0f] p-3 rounded-lg border border-[#1e2235] space-y-1.5">
                <div className="text-gray-500 uppercase text-[10px]">Exfiltrated Credentials</div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-amber-300">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Password Hash:</span>
                  <span className="text-rose-400 break-all">{selectedUser.passwordHash || '$2b$12$e9K2...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Session Cookie:</span>
                  <span className="text-emerald-400 break-all">{selectedUser.sessionToken || 'sess_default'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Assigned IP:</span>
                  <span className="text-gray-300">{selectedUser.ipAddress || '192.168.1.101'}</span>
                </div>
              </div>

              <div className="bg-[#090a0f] p-3 rounded-lg border border-[#1e2235] space-y-1">
                <div className="text-gray-500 uppercase text-[10px]">Submitted Feedback</div>
                <p className="text-gray-200 font-sans text-xs">{selectedUser.feedback}</p>
              </div>

              <div className="bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg text-rose-300 space-y-1">
                <div className="font-bold flex items-center gap-1 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Practical Security Impact:
                </div>
                <p className="font-sans text-[11px] text-gray-300">
                  Because user data was queried using unescaped interpolation or rendered into DOM without escaping, an attacker possessing this record can forge cookies, impersonate {selectedUser.name}, and hijack their account privileges.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="bg-[#181b29] hover:bg-[#23273c] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Record Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
