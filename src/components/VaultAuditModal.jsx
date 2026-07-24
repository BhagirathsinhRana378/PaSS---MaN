import React from 'react';
import { IconX, IconShieldCheck, IconShieldAlert, IconAlertTriangle, IconKey } from './Icons.jsx';

const VaultAuditModal = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  // Compute security metrics
  let totalPasswords = 0;
  let weakPasswords = [];
  let reusedPasswordsMap = {};
  let unencryptedCount = 0;

  items.forEach((item) => {
    if (item.password) {
      totalPasswords++;
      if (item.password.length < 8) {
        weakPasswords.push(item);
      }
      reusedPasswordsMap[item.password] = (reusedPasswordsMap[item.password] || 0) + 1;
    }
  });

  const reusedCount = Object.values(reusedPasswordsMap).filter((c) => c > 1).length;

  // Overall Health Grade
  let score = 100;
  if (weakPasswords.length > 0) score -= weakPasswords.length * 15;
  if (reusedCount > 0) score -= reusedCount * 20;
  score = Math.max(10, Math.min(100, score));

  let healthColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  let healthLabel = 'EXCELLENT';
  if (score < 50) {
    healthColor = 'text-red-400 border-red-500/40 bg-red-500/10';
    healthLabel = 'CRITICAL RISK';
  } else if (score < 80) {
    healthColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    healthLabel = 'NEEDS ATTENTION';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0b101b] border border-cyan-500/30 text-slate-100 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-cyan-400 font-extrabold text-lg">
            <IconShieldCheck className="w-6 h-6 text-cyan-400" />
            <span className="font-display-heading tracking-wide">Vault Security Audit</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Health Score Box */}
        <div className={`p-4 rounded-xl border flex items-center justify-between mb-6 ${healthColor}`}>
          <div>
            <div className="text-xs uppercase font-mono tracking-widest font-bold opacity-80">Overall Health Score</div>
            <div className="text-3xl font-extrabold font-display-heading tracking-tight mt-1">{score} / 100</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider bg-black/40">
            {healthLabel}
          </div>
        </div>

        {/* Findings Summary */}
        <div className="space-y-4 mb-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Total Vault Items Analyzed</span>
            <span className="font-mono font-bold text-slate-100">{items.length} items</span>
          </div>

          {weakPasswords.length > 0 ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <IconShieldAlert className="w-4 h-4" />
                <span>{weakPasswords.length} Weak Passwords Found</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 font-mono text-[11px] space-y-1 pl-1">
                {weakPasswords.map((w) => (
                  <li key={w.id}>{w.title || w.site || 'Untitled'} (less than 8 chars)</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <IconShieldCheck className="w-4 h-4 shrink-0" />
              <span>No weak passwords detected (All passwords are 8+ characters).</span>
            </div>
          )}

          {reusedCount > 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <IconAlertTriangle className="w-4 h-4" />
                <span>{reusedCount} Reused Passwords Detected</span>
              </div>
              <p className="text-slate-300 text-[11px]">Reusing passwords across multiple sites puts your accounts at risk.</p>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <IconShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero reused passwords found across your vault.</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm font-mono tracking-wider transition-all shadow-lg shadow-cyan-500/20"
        >
          Close Audit Report
        </button>

      </div>
    </div>
  );
};

export default VaultAuditModal;
