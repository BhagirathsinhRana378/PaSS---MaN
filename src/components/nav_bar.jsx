import React from 'react';
import {
  IconShieldCheck,
  IconSparkles,
  IconDownload,
  IconLock,
  IconKey,
  IconSearch,
  IconShield
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
    <nav className="h-16 bg-[#0a0a0a] border-b border-[#1f1f1f] text-white px-4 md:px-8 flex justify-between items-center sticky top-0 z-40">
      
      {/* Mintlify Brand Mark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#00d4a4] text-[#0a0a0a] flex items-center justify-center font-bold">
          <IconShield className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-display font-semibold tracking-tight text-white select-none">
            PaSS<span className="text-[#00d4a4]">-</span>MaN
          </h1>
          <span className="mint-badge-green text-[10px] hidden sm:inline-block">v2.0 AES</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 md:gap-3 text-xs">
        
        {/* Search HUD */}
        <button
          onClick={onFocusSearch}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1e] text-[#b3b3b3] font-sans border border-[#1f1f1f] hover:border-[#00d4a4] transition-colors"
          title="Search (Ctrl+K)"
        >
          <IconSearch className="w-3.5 h-3.5 text-[#00d4a4]" />
          <span>Search docs & vault</span>
          <kbd className="px-1.5 py-0.5 bg-[#0a0a0a] text-[#b3b3b3] rounded border border-[#1f1f1f] text-[10px]">Ctrl+K</kbd>
        </button>

        {/* Audit Report */}
        <button
          onClick={onOpenAudit}
          className="btn-dark-pill text-xs py-1.5 px-3.5"
          title="Vault Security Audit"
        >
          <IconShieldCheck className="w-4 h-4 text-[#00d4a4]" />
          <span className="hidden sm:inline">Audit</span>
        </button>

        {/* Generator */}
        <button
          onClick={onOpenGenerator}
          className="btn-dark-pill text-xs py-1.5 px-3.5"
          title="Password Generator"
        >
          <IconSparkles className="w-4 h-4 text-[#00d4a4]" />
          <span className="hidden sm:inline">Generator</span>
        </button>

        {/* Backup & Sync */}
        <button
          onClick={onOpenBackup}
          className="btn-dark-pill text-xs py-1.5 px-3.5"
          title="Backup & Sync"
        >
          <IconDownload className="w-4 h-4 text-[#b3b3b3]" />
          <span className="hidden sm:inline">Sync</span>
        </button>

        {/* Lock Security Toggle */}
        {isLockedEnabled ? (
          <button
            onClick={onLockApp}
            className="btn-mint-pill text-xs py-1.5 px-4"
            title="Lock Vault"
          >
            <IconLock className="w-4 h-4" />
            <span className="hidden sm:inline">Lock Vault</span>
          </button>
        ) : (
          <button
            onClick={onOpenLock}
            className="btn-dark-outline text-xs py-1.5 px-3.5"
            title="Set Master PIN Security"
          >
            <IconKey className="w-4 h-4 text-[#00d4a4]" />
            <span className="hidden sm:inline">Set PIN</span>
          </button>
        )}

        {/* GitHub Link */}
        <a
          className="btn-dark-outline py-1.5 px-3.5 text-xs"
          href="https://github.com/Bhagirathsinhrana378"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repo"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.476 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="hidden md:inline">GitHub</span>
        </a>

      </div>
    </nav>
  );
};

export default NavBar;