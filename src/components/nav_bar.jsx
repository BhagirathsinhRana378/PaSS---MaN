import React from 'react';
import {
  IconShield,
  IconShieldCheck,
  IconSparkles,
  IconDownload,
  IconLock,
  IconKey,
  IconCpu,
  IconSearch
} from './Icons.jsx';

const NavBar = ({
  onOpenGenerator,
  onOpenBackup,
  onOpenAudit,
  onOpenLock,
  isLockedEnabled,
  onLockApp,
  isEncryptedMode,
  onFocusSearch
}) => {
  return (
    <nav className="glass-cyber sticky top-0 z-40 px-4 md:px-8 py-3 flex justify-between items-center shadow-2xl transition-all border-b border-cyan-500/20">
      
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#080c14] rounded-xl flex items-center justify-center">
              <IconCpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          {isEncryptedMode && (
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#080c14] rounded-full" title="AES-256-GCM Active" />
          )}
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-extrabold font-display-heading tracking-wider select-none text-slate-100 flex items-center gap-1">
            <span className="text-cyan-400">&lt;</span>
            <span>PaSS</span>
            <span className="text-cyan-400">/</span>
            <span className="text-indigo-400">-</span>
            <span className="text-pink-500">-</span>
            <span>MaN</span>
            <span className="text-cyan-400">&gt;</span>
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold uppercase tracking-widest">TACTICAL VAULT</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{isEncryptedMode ? 'AES-256 ENCRYPTED' : 'LOCAL VAULT'}</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Search Shortcut Indicator */}
        <button
          onClick={onFocusSearch}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 text-xs font-mono border border-slate-800 transition-colors"
          title="Search Vault (Ctrl+K)"
        >
          <IconSearch className="w-3.5 h-3.5 text-cyan-400" />
          <span>Search</span>
          <kbd className="px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded border border-slate-800 text-[10px]">Ctrl+K</kbd>
        </button>

        {/* Audit Button */}
        <button
          onClick={onOpenAudit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30 transition-all shadow-sm"
          title="Vault Security Health Audit"
        >
          <IconShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Audit Report</span>
        </button>

        {/* Generator Button */}
        <button
          onClick={onOpenGenerator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30 transition-all shadow-sm"
          title="Password Generator"
        >
          <IconSparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Generator</span>
        </button>

        {/* Backup & Sync Button */}
        <button
          onClick={onOpenBackup}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 text-xs font-mono font-semibold border border-indigo-500/30 transition-all shadow-sm"
          title="Backup & Sync"
        >
          <IconDownload className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Sync / Export</span>
        </button>

        {/* Lock Security Toggle */}
        {isLockedEnabled ? (
          <button
            onClick={onLockApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/40 transition-all shadow-sm"
            title="Lock Vault"
          >
            <IconLock className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        ) : (
          <button
            onClick={onOpenLock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-semibold border border-slate-700 transition-all shadow-sm"
            title="Set Master PIN"
          >
            <IconKey className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">PIN Security</span>
          </button>
        )}

        {/* GitHub Repository */}
        <a
          className="flex items-center gap-2 p-2 md:px-3 md:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-semibold border border-slate-800 transition-all"
          href="https://github.com/Bhagirathsinhrana378"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
        >
          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.476 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="hidden md:inline">Repo</span>
        </a>

      </div>
    </nav>
  );
};

export default NavBar;