import React from 'react';
import { IconCpu, IconShieldCheck } from './Icons.jsx';

const FOOTER = () => {
  return (
    <footer className="glass-cyber border-t border-cyan-500/20 text-slate-400 py-8 px-4 text-center mt-12">
      <div className="max-w-3xl mx-auto space-y-3 font-mono">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-200">
          <IconCpu className="w-4 h-4 text-cyan-400" />
          <span>Designed & Maintained by Bhagirathsinh Rana</span>
        </div>

        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          <strong className="text-cyan-400 font-bold">&lt;PaSS/--MaN&gt;</strong> operates completely client-side in offline storage with optional Web Crypto AES-256-GCM encryption. Zero trackers, zero cloud servers, 100% user privacy.
        </p>

        <div className="text-[11px] text-slate-500 pt-2 flex items-center justify-center gap-2">
          <IconShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>&copy; {new Date().getFullYear()} Passman Cybernetic Security Terminal</span>
        </div>
      </div>
    </footer>
  );
};

export default FOOTER;