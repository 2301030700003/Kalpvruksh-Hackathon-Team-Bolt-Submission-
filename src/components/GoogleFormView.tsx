import React, { useState } from 'react';
import { FormSubmission, AttackPresetType } from '../types';
import { 
  CheckCircle2, 
  Send, 
  RotateCcw, 
  Plus, 
  FileText, 
  Type, 
  Image, 
  Video, 
  Split, 
  MoreVertical, 
  HelpCircle, 
  AlertCircle, 
  Sparkles,
  Shield, 
  Database,
  Code2,
  ExternalLink,
  ArrowRight,
  Eye,
  Settings,
  Star,
  Folder,
  Palette
} from 'lucide-react';

interface GoogleFormViewProps {
  onSubmitToVisualizer: (data: FormSubmission) => void;
  onSwitchToVisualizer: () => void;
  submissions: FormSubmission[];
}

export default function GoogleFormView({
  onSubmitToVisualizer,
  onSwitchToVisualizer,
  submissions,
}: GoogleFormViewProps) {
  // Form Tabs: 'questions' | 'responses' | 'settings'
  const [activeTab, setActiveTab] = useState<'questions' | 'responses' | 'settings'>('questions');

  // Active question card for Google Form styling (focused card shows left purple border & side toolbar)
  const [activeQuestionId, setActiveQuestionId] = useState<string>('q1');

  // Form Fields State
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex@matrix.com');
  const [feedback, setFeedback] = useState('Great application platform! User experience is smooth.');
  const [environment, setEnvironment] = useState('Production (Strict Parameterized Queries)');
  const [rating, setRating] = useState<number>(4);

  // Form submitted state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Theme color for form header
  const [themeColor, setThemeColor] = useState<string>('#673ab7'); // Classic Google Forms purple

  const handleFillPreset = (type: AttackPresetType) => {
    if (type === 'normal') {
      setName('Alex Mercer');
      setEmail('alex@company.com');
      setFeedback('Legitimate user submission. Everything working as expected.');
      setEnvironment('Production (Strict Parameterized Queries)');
      setRating(5);
    } else if (type === 'sqli') {
      setName('Attacker_SQLi');
      setEmail("' OR '1'='1");
      setFeedback('Payload targeting the authentication lookup database query.');
      setEnvironment('Legacy Staging (Vulnerable String Concatenation)');
      setRating(1);
    } else if (type === 'xss') {
      setName('Attacker_XSS');
      setEmail('hacker@exploit.net');
      setFeedback("<script>alert('XSS SESSION STOLEN!')</script>");
      setEnvironment('Legacy Staging (Vulnerable String Concatenation)');
      setRating(1);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      setActiveQuestionId('q1');
      return;
    }
    if (!email.trim()) {
      setValidationError('Please enter an account email or lookup query.');
      setActiveQuestionId('q2');
      return;
    }
    if (!feedback.trim()) {
      setValidationError('Please enter your feedback comment.');
      setActiveQuestionId('q3');
      return;
    }

    setValidationError(null);

    const hasSQLi =
      email.includes("' OR '1'='1") ||
      email.includes("' OR 1=1") ||
      email.includes("' OR '") ||
      email.includes("'; DROP") ||
      email.includes("'--");

    const hasXSS =
      feedback.includes('<script>') ||
      feedback.includes('onerror=') ||
      feedback.includes('javascript:') ||
      feedback.includes('<img');

    const newSubmission: FormSubmission = {
      id: `sub_${Date.now()}`,
      name,
      email,
      feedback,
      environment,
      rating,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      hasSQLi,
      hasXSS,
    };

    setLastSubmittedId(newSubmission.id);
    setIsSubmitted(true);
    onSubmitToVisualizer(newSubmission);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setFeedback('');
    setEnvironment('Production (Strict Parameterized Queries)');
    setRating(3);
    setIsSubmitted(false);
    setValidationError(null);
  };

  const sqliCount = submissions.filter((s) => s.hasSQLi).length;
  const xssCount = submissions.filter((s) => s.hasXSS).length;
  const cleanCount = submissions.filter((s) => !s.hasSQLi && !s.hasXSS).length;

  return (
    <div className="w-full min-h-screen bg-[#f0ebf8] text-[#202124] flex flex-col font-sans pb-16 select-text">
      
      {/* Google Forms Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          
          {/* Left: Form Icon & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#ede7f6] text-[#673ab7]">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-base leading-tight hover:bg-gray-100 px-2 py-0.5 rounded cursor-pointer transition-colors">
                  Kalpvuksh 2.0 Security Submission Form
                </span>
                <Folder className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 hidden sm:inline" />
                <Star className="w-4 h-4 text-gray-400 cursor-pointer hover:text-amber-500 hidden sm:inline" />
              </div>
              <span className="text-[11px] text-gray-500 px-2">
                All changes saved to Drive • Linked to T018 Pipeline
              </span>
            </div>
          </div>

          {/* Center: Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-form-questions"
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'questions'
                  ? 'border-[#673ab7] text-[#673ab7]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Questions
            </button>
            <button
              id="tab-form-responses"
              onClick={() => setActiveTab('responses')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'responses'
                  ? 'border-[#673ab7] text-[#673ab7]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Responses</span>
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-mono">
                {submissions.length}
              </span>
            </button>
            <button
              id="tab-form-settings"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer hidden md:block ${
                activeTab === 'settings'
                  ? 'border-[#673ab7] text-[#673ab7]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-quick-visualizer"
              onClick={onSwitchToVisualizer}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#12141d] hover:bg-[#1e2235] text-white px-3.5 py-1.5 rounded-md shadow-sm transition-all cursor-pointer"
              title="Open Security Visualizer Page"
            >
              <Shield className="w-3.5 h-3.5 text-[#6366f1]" />
              <span className="hidden sm:inline">Go to Visualizer</span>
              <ArrowRight className="w-3 h-3 text-[#6366f1]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[770px] w-full mx-auto px-3 sm:px-4 mt-4 flex flex-col gap-4">

        {/* Quick Test Vectors Header Banner */}
        <div className="bg-white border border-purple-200/80 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-purple-900">
            <Sparkles className="w-4 h-4 text-[#673ab7]" />
            <span>Test Payload Presets (1-Click Fill):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-form-fill-normal"
              onClick={() => handleFillPreset('normal')}
              className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Clean User
            </button>
            <button
              type="button"
              id="btn-form-fill-sqli"
              onClick={() => handleFillPreset('sqli')}
              className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              SQL Injection
            </button>
            <button
              type="button"
              id="btn-form-fill-xss"
              onClick={() => handleFillPreset('xss')}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              XSS Payload
            </button>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="bg-rose-50 border border-rose-300 text-rose-700 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* VIEW 1: QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <>
            {isSubmitted ? (
              /* Google Form Submission Confirmation Screen */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div
                  className="h-2.5 w-full"
                  style={{ backgroundColor: themeColor }}
                ></div>
                <div className="p-7 space-y-5">
                  <h1 className="text-2xl font-normal text-gray-900">
                    Kalpvuksh 2.0 Security Submission Form
                  </h1>
                  <p className="text-sm text-gray-700">
                    Your response has been recorded. The submission payload is now staged in the T018 execution pipeline.
                  </p>

                  <div className="bg-[#12141d] text-white p-4 rounded-xl border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 uppercase tracking-wider font-semibold">
                        Staged Payload Inspection
                      </span>
                      <span className="font-mono text-emerald-400">ID: {lastSubmittedId}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-[#090a0f] p-2 rounded border border-gray-800">
                        <span className="text-gray-500 block text-[10px]">Email Query Field:</span>
                        <span className="text-amber-300 break-all">{email}</span>
                      </div>
                      <div className="bg-[#090a0f] p-2 rounded border border-gray-800">
                        <span className="text-gray-500 block text-[10px]">Feedback Comment:</span>
                        <span className="text-rose-300 break-all">{feedback}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        id="btn-confirm-to-visualizer"
                        onClick={onSwitchToVisualizer}
                        className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Inspect in Security Visualizer Track &amp; Race Pipelines</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-[#673ab7] hover:underline font-medium cursor-pointer"
                    >
                      Submit another response
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('responses')}
                      className="text-gray-600 hover:text-gray-900 hover:underline cursor-pointer"
                    >
                      View all responses ({submissions.length})
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Google Form Input Cards Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Header Card */}
                <div
                  id="card-header"
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative"
                >
                  <div
                    className="h-2.5 w-full"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <div className="p-6 sm:p-7 space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight">
                      Kalpvuksh 2.0 Security Submission Form
                    </h1>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Submit feedback and user lookup data for vulnerability validation. Data submitted through this form will be analyzed by our dual-pipeline execution engine (Vulnerable String Concatenation vs. Parameterized Remediation).
                    </p>

                    <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-800">
                          2301030700003@silveroakuni.ac.in
                        </span>
                        <span className="text-[#673ab7] hover:underline cursor-pointer">
                          Switch account
                        </span>
                      </div>
                      <span className="text-rose-600 font-medium">* Indicates required question</span>
                    </div>
                  </div>
                </div>

                {/* Card 1: Full Name */}
                <div
                  id="card-q1"
                  onClick={() => setActiveQuestionId('q1')}
                  className={`bg-white rounded-lg shadow-sm border transition-all p-6 relative ${
                    activeQuestionId === 'q1'
                      ? 'border-gray-200 border-l-[5px] border-l-[#673ab7]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-4">
                    <label className="text-sm sm:text-base font-normal text-gray-900 block">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="form-input-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your answer"
                        className="w-full sm:w-2/3 border-b border-gray-300 pb-1.5 text-sm text-gray-900 focus:border-b-2 focus:border-[#673ab7] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Account Email / Lookup Query (SQLi Target) */}
                <div
                  id="card-q2"
                  onClick={() => setActiveQuestionId('q2')}
                  className={`bg-white rounded-lg shadow-sm border transition-all p-6 relative ${
                    activeQuestionId === 'q2'
                      ? 'border-gray-200 border-l-[5px] border-l-[#673ab7]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm sm:text-base font-normal text-gray-900 block">
                        Account Email / Database Lookup Field <span className="text-rose-600">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Target field for backend lookup query: <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded">SELECT * FROM submissions WHERE email = '...'</code>
                      </p>
                    </div>

                    <div className="relative pt-1">
                      <input
                        type="text"
                        id="form-input-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@matrix.com or ' OR '1'='1"
                        className="w-full sm:w-3/4 border-b border-gray-300 pb-1.5 text-sm text-gray-900 font-mono focus:border-b-2 focus:border-[#673ab7] outline-none transition-colors"
                      />
                    </div>

                    {email.includes("' OR") && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>SQL Injection string pattern detected in input field</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 3: Public Feedback / Comment (XSS Target) */}
                <div
                  id="card-q3"
                  onClick={() => setActiveQuestionId('q3')}
                  className={`bg-white rounded-lg shadow-sm border transition-all p-6 relative ${
                    activeQuestionId === 'q3'
                      ? 'border-gray-200 border-l-[5px] border-l-[#673ab7]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm sm:text-base font-normal text-gray-900 block">
                        Public Feedback / Comment <span className="text-rose-600">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Will be rendered into public submission feed (Target for unescaped DOM insertion)
                      </p>
                    </div>

                    <div className="relative pt-1">
                      <textarea
                        id="form-input-feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Your feedback or test script..."
                        rows={3}
                        className="w-full border-b border-gray-300 pb-1.5 text-sm text-gray-900 font-mono focus:border-b-2 focus:border-[#673ab7] outline-none transition-colors resize-none"
                      />
                    </div>

                    {feedback.includes('<script>') && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Cross-Site Scripting (XSS) HTML tag detected in comment</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 4: Security Pipeline Mode Preference */}
                <div
                  id="card-q4"
                  onClick={() => setActiveQuestionId('q4')}
                  className={`bg-white rounded-lg shadow-sm border transition-all p-6 relative ${
                    activeQuestionId === 'q4'
                      ? 'border-gray-200 border-l-[5px] border-l-[#673ab7]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-3">
                    <label className="text-sm sm:text-base font-normal text-gray-900 block">
                      Target Pipeline Architecture <span className="text-rose-600">*</span>
                    </label>

                    <div className="space-y-2 pt-1">
                      {[
                        'Production (Strict Parameterized Queries & Context Escaping)',
                        'Legacy Staging (Vulnerable String Concatenation & Unescaped DOM)',
                        'Dual Simulation (Compare Both Pipelines Side-by-Side)',
                      ].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-3 cursor-pointer py-1 text-sm text-gray-800"
                        >
                          <input
                            type="radio"
                            name="environment"
                            value={opt}
                            checked={environment === opt}
                            onChange={(e) => setEnvironment(e.target.value)}
                            className="w-4 h-4 text-[#673ab7] focus:ring-[#673ab7]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card 5: Rating Scale */}
                <div
                  id="card-q5"
                  onClick={() => setActiveQuestionId('q5')}
                  className={`bg-white rounded-lg shadow-sm border transition-all p-6 relative ${
                    activeQuestionId === 'q5'
                      ? 'border-gray-200 border-l-[5px] border-l-[#673ab7]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-4">
                    <label className="text-sm sm:text-base font-normal text-gray-900 block">
                      System Robustness Rating (1 = High Risk, 5 = Highly Secure)
                    </label>

                    <div className="flex items-center justify-between sm:justify-start sm:gap-6 pt-2 text-xs text-gray-600 overflow-x-auto">
                      <span className="text-gray-500 font-medium">Vulnerable</span>
                      <div className="flex items-center gap-3 sm:gap-5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className="flex flex-col items-center gap-1.5 cursor-pointer"
                          >
                            <span className="font-semibold text-gray-700">{val}</span>
                            <input
                              type="radio"
                              name="rating"
                              value={val}
                              checked={rating === val}
                              onChange={() => setRating(val)}
                              className="w-4 h-4 text-[#673ab7] focus:ring-[#673ab7]"
                            />
                          </label>
                        ))}
                      </div>
                      <span className="text-gray-500 font-medium">Fortified</span>
                    </div>
                  </div>
                </div>

                {/* Submit & Clear Action Bar */}
                <div className="flex items-center justify-between pt-2 pb-6">
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      id="btn-form-submit"
                      className="bg-[#673ab7] hover:bg-[#5e35b1] text-white font-medium text-sm px-6 py-2 rounded shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-[#673ab7] hover:bg-purple-50 text-sm font-medium px-4 py-2 rounded transition-colors cursor-pointer"
                    >
                      Clear form
                    </button>
                  </div>

                  <span className="text-xs text-gray-400 hidden sm:inline">
                    Never submit sensitive passwords through Google Forms.
                  </span>
                </div>
              </form>
            )}
          </>
        )}

        {/* VIEW 2: RESPONSES TAB */}
        {activeTab === 'responses' && (
          <div className="space-y-4">
            
            {/* Summary Statistics Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-normal text-gray-900">
                    {submissions.length} responses
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live database query audit &amp; payload telemetry
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSwitchToVisualizer}
                  className="bg-[#6366f1] text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#4f46e5] cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Open Visualizer</span>
                </button>
              </div>

              {/* Security Audit Metric Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg">
                  <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                    SQLi Payloads
                  </div>
                  <div className="text-2xl font-bold text-rose-600 mt-1">{sqliCount}</div>
                  <div className="text-[11px] text-rose-600/80 mt-0.5">
                    Concatenation risk flagged
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg">
                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    XSS Payloads
                  </div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">{xssCount}</div>
                  <div className="text-[11px] text-amber-600/80 mt-0.5">
                    Script tags detected
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg">
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Safe Submissions
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{cleanCount}</div>
                  <div className="text-[11px] text-emerald-600/80 mt-0.5">
                    Passed clean parsing
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Submissions Feed */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1">
                Submission Records Feed
              </h3>

              {submissions.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center text-gray-500 border border-gray-200">
                  No responses recorded yet. Fill out the form in the Questions tab to generate test data.
                </div>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3 transition-all hover:border-gray-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{sub.name}</span>
                        <span className="text-xs text-gray-400">• {sub.submittedAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.hasSQLi && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                            SQLi EXPLOIT
                          </span>
                        )}
                        {sub.hasXSS && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                            XSS EXPLOIT
                          </span>
                        )}
                        {!sub.hasSQLi && !sub.hasXSS && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                            CLEAN
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onSubmitToVisualizer(sub);
                            onSwitchToVisualizer();
                          }}
                          className="bg-[#12141d] hover:bg-[#6366f1] text-white text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 font-medium"
                        >
                          <span>Test in Visualizer</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                          Lookup Email Field:
                        </span>
                        <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono break-all inline-block mt-0.5">
                          {sub.email}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                          Feedback / Comment:
                        </span>
                        <code className="text-gray-800 bg-gray-50 px-1.5 py-0.5 rounded font-mono break-all inline-block mt-0.5">
                          {sub.feedback}
                        </code>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-100">
                      <span>Pipeline: {sub.environment}</span>
                      <span>Rating: {sub.rating || 4}/5</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-normal text-gray-900">Form Settings &amp; Security Configuration</h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure form behavior, theme, and backend pipeline integration.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-800">Theme Color Accent</div>
                  <div className="text-xs text-gray-500">Customize the Google Form header strip color</div>
                </div>
                <div className="flex items-center gap-2">
                  {['#673ab7', '#009688', '#1e88e5', '#e65100', '#c2185b'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setThemeColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        themeColor === c ? 'scale-125 border-gray-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-800">Auto-Forward to Security Pipeline</div>
                  <div className="text-xs text-gray-500">Automatically stage payloads into T018 Visualizer</div>
                </div>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800">Collect Email Addresses</div>
                  <div className="text-xs text-gray-500">Verified institutional responder credentials</div>
                </div>
                <span className="text-xs text-gray-500">Always on</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
