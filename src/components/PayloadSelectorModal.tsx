import React, { useState } from 'react';
import { ATTACK_PAYLOADS, AttackPayload } from '../data/payloads';
import { 
  Terminal, 
  Database, 
  Code2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Layers, 
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PayloadSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPayload: (payload: AttackPayload) => void;
  currentPageContext?: 'form' | 'visualizer';
}

export default function PayloadSelectorModal({
  isOpen,
  onClose,
  onSelectPayload,
  currentPageContext = 'form',
}: PayloadSelectorModalProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'sqli' | 'xss'>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredPayloads = ATTACK_PAYLOADS.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (activeSubCategory !== 'all' && p.subCategory !== activeSubCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.payload.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.engineOrContext && p.engineOrContext.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const availableSubCategories = Array.from(
    new Set(
      ATTACK_PAYLOADS.filter((p) => activeCategory === 'all' || p.category === activeCategory).map(
        (p) => p.subCategory
      )
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#12141d] border border-[#1e2235] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1e2235] bg-[#181b29] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/30">
              <Terminal className="w-5 h-5 text-[#6366f1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Attack Payload Library &amp; Test Vectors
                </h3>
                <span className="text-[10px] bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  {ATTACK_PAYLOADS.length} Vectors Available
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Select any SQLi or XSS payload to load into {currentPageContext === 'form' ? 'the Google Form' : 'the Security Visualizer'}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#090a0f] border border-[#1e2235] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 border-b border-[#1e2235] bg-[#090a0f] space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Category Tabs */}
            <div className="flex items-center bg-[#181b29] p-1 rounded-xl border border-[#1e2235] text-xs w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveSubCategory('all');
                }}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[#6366f1] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Vectors ({ATTACK_PAYLOADS.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('sqli');
                  setActiveSubCategory('all');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === 'sqli'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL Injection ({ATTACK_PAYLOADS.filter(p => p.category === 'sqli').length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('xss');
                  setActiveSubCategory('all');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === 'xss'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Cross-Site Scripting ({ATTACK_PAYLOADS.filter(p => p.category === 'xss').length})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search payloads or keywords..."
                className="w-full bg-[#181b29] border border-[#1e2235] text-xs text-white pl-8 pr-3 py-1.5 rounded-xl outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>

          {/* Sub-Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubCategory('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeSubCategory === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-[#181b29] text-gray-400 border border-[#1e2235] hover:text-gray-200'
              }`}
            >
              All Types
            </button>
            {availableSubCategories.map((subCat) => (
              <button
                key={subCat}
                type="button"
                onClick={() => setActiveSubCategory(subCat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeSubCategory === subCat
                    ? 'bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/50'
                    : 'bg-[#181b29] text-gray-400 border border-[#1e2235] hover:text-gray-200'
                }`}
              >
                {subCat}
              </button>
            ))}
          </div>
        </div>

        {/* Payload Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#090a0f]">
          {filteredPayloads.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              No payloads matched your search or category filter.
            </div>
          ) : (
            filteredPayloads.map((item) => {
              const isSQLi = item.category === 'sqli';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPayload(item);
                    onClose();
                  }}
                  className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer group ${
                    isSQLi 
                      ? 'border-[#1e2235] bg-[#12141d] hover:border-rose-500/50 hover:bg-rose-950/10' 
                      : 'border-[#1e2235] bg-[#12141d] hover:border-amber-500/50 hover:bg-amber-950/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    
                    {/* Title & Category Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                        isSQLi 
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.category.toUpperCase()} • {item.subCategory}
                      </span>

                      {item.isTimeDelay && (
                        <span className="flex items-center gap-1 text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                          <Clock className="w-3 h-3" />
                          {item.delaySeconds}s Latency Delay
                        </span>
                      )}

                      {item.isDestructive && (
                        <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-mono font-bold">
                          <Trash2 className="w-3 h-3" />
                          Destructive DROP
                        </span>
                      )}

                      {item.extractedTables && (
                        <span className="flex items-center gap-1 text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                          <Layers className="w-3 h-3" />
                          Table Schema Leak
                        </span>
                      )}
                    </div>

                    {/* Target Field Pill & Target Engine */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                      <span>Injects into:</span>
                      <span className="bg-[#181b29] border border-[#1e2235] px-2 py-0.5 rounded text-white font-semibold">
                        {item.targetField === 'email' ? 'Lookup Email' : 'Feedback Textarea'}
                      </span>
                    </div>
                  </div>

                  {/* Name and Target Context */}
                  <div className="mt-2 flex items-baseline justify-between">
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#818cf8] transition-colors">
                      {item.name}
                    </h4>
                    {item.engineOrContext && (
                      <span className="text-[11px] text-gray-400 font-mono">
                        Target: {item.engineOrContext}
                      </span>
                    )}
                  </div>

                  {/* Payload Code Box */}
                  <div className="mt-2.5 bg-[#090a0f] border border-[#1e2235] rounded-lg p-2.5 flex items-center justify-between gap-3 group-hover:border-[#6366f1]/40 transition-colors">
                    <code className="font-mono text-xs text-amber-300 break-all select-all">
                      {item.payload}
                    </code>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleCopy(item.id, item.payload, e)}
                        className="p-1.5 text-gray-400 hover:text-white rounded bg-[#181b29] border border-[#1e2235] hover:bg-[#23273c] transition-colors cursor-pointer"
                        title="Copy payload string"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectPayload(item);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Load</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Impact & Mechanics Explanation */}
                  <div className="mt-2 text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-gray-300">{item.description}</span>
                    <span className="text-rose-400/90 font-medium text-[11px]">
                      Impact: {item.practicalImpact}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1e2235] bg-[#181b29] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6366f1]" />
            <span>Clicking <strong>Load</strong> automatically populates the payload into the application form and configures the attack vector.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#090a0f] border border-[#1e2235] hover:bg-[#12141d] text-white rounded-lg transition-colors cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
