import React from 'react';
import { IconX, IconShieldCheck, IconShieldAlert, IconAlertTriangle } from './Icons.jsx';

const VaultAuditModal = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  // Calculate metrics
  let totalPasswords = 0;
  let weakPasswords = [];
  let reusedPasswordsMap = {};

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

  let score = 100;
  if (weakPasswords.length > 0) score -= weakPasswords.length * 15;
  if (reusedCount > 0) score -= reusedCount * 20;
  score = Math.max(10, Math.min(100, score));

  let healthBadge = 'bg-[#006400] text-white';
  let healthText = 'Vault Health: Excellent';
  if (score < 50) {
    healthBadge = 'bg-[#aa2d00] text-white';
    healthText = 'Vault Health: Critical Risks Detected';
  } else if (score < 80) {
    healthBadge = 'bg-[#d9a441] text-slate-950';
    healthText = 'Vault Health: Needs Attention';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181d26]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-[#dddddd] text-[#181d26] rounded-xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#dddddd]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#181d26] text-white flex items-center justify-center font-bold">
              <IconShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-display font-semibold text-lg text-[#181d26]">Vault Security Health Audit</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#41454d] hover:text-[#181d26] p-1.5 rounded-lg transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Cream Callout Card */}
        <div className="card-signature-cream mb-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-semibold text-[#41454d] tracking-wider">Health Index</span>
              <div className="text-3xl font-display font-medium text-[#181d26] mt-0.5">{score} / 100</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${healthBadge}`}>
              {healthText}
            </span>
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-3 mb-6">
          <div className="bg-[#f8fafc] border border-[#dddddd] rounded-lg p-3 flex justify-between items-center text-xs text-[#333840]">
            <span>Total Items Scanned</span>
            <span className="font-semibold text-[#181d26]">{items.length} items</span>
          </div>

          {weakPasswords.length > 0 ? (
            <div className="bg-[#aa2d00]/10 border border-[#aa2d00]/30 rounded-lg p-3.5 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#aa2d00] font-semibold">
                <IconShieldAlert className="w-4 h-4" />
                <span>{weakPasswords.length} Weak Passwords (&lt; 8 chars)</span>
              </div>
              <ul className="list-disc list-inside text-[#333840] text-[11px] space-y-0.5 pl-1">
                {weakPasswords.map((w) => (
                  <li key={w.id}>{w.title || w.site || 'Untitled Entry'}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-[#006400]/10 border border-[#006400]/30 rounded-lg p-3 text-xs text-[#006400] font-medium flex items-center gap-2">
              <IconShieldCheck className="w-4 h-4" />
              <span>All passwords meet minimum length guidelines (8+ chars).</span>
            </div>
          )}

          {reusedCount > 0 ? (
            <div className="bg-[#f5e9d4] border border-[#d9a441]/40 rounded-lg p-3.5 text-xs space-y-1">
              <div className="flex items-center gap-2 text-[#181d26] font-semibold">
                <IconAlertTriangle className="w-4 h-4 text-[#d9a441]" />
                <span>{reusedCount} Reused Passwords Found</span>
              </div>
              <p className="text-[#333840] text-[11px]">Reusing passwords increases account vulnerability.</p>
            </div>
          ) : (
            <div className="bg-[#006400]/10 border border-[#006400]/30 rounded-lg p-3 text-xs text-[#006400] font-medium flex items-center gap-2">
              <IconShieldCheck className="w-4 h-4" />
              <span>No reused passwords detected across vault.</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full btn-airtable-primary justify-center py-2.5"
        >
          Close Audit Report
        </button>

      </div>
    </div>
  );
};

export default VaultAuditModal;
