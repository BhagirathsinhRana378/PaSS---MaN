import React from 'react';
import {
  IconShieldCheck,
  IconSparkles,
  IconDownload,
  IconLock,
  IconKey,
  IconSearch,
  IconShield,
  IconSun,
  IconMoon
} from './Icons.jsx';

const NavBar = ({
  onOpenGenerator,
  onOpenBackup,
  onOpenAudit,
  onOpenLock,
  isLockedEnabled,
  onLockApp,
  isEncryptedMode,
  onFocusSearch,
  theme,
  onToggleTheme
}) => {
  return (
    <nav className="h-16 bg-[var(--color-nav)] border-b border-[var(--color-[#dddddd])] text-[var(--color-text)] px-4 md:px-8 flex justify-between items-center sticky top-0 z-40 transition-colors">
      
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-text)] text-[var(--color-nav)] flex items-center justify-center font-bold">
          <IconShield className="w-5 h-5" />
        </div>

        <div>
          <h1 className="text-lg md:text-xl font-display font-medium tracking-tight select-none text-[var(--color-text)]">
            <span>PaSS</span>
            <span className="text-[var(--color-label)]">/</span>
            <span>-</span>
            <span className="text-[#aa2d00] dark:text-rose-400">-</span>
            <span>MaN</span>
          </h1>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 md:gap-3 text-xs">
        
        {/* Search HUD */}
        <button
          onClick={onFocusSearch}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-input)] text-[var(--color-label)] font-sans border border-[var(--color-[#dddddd])] transition-colors"
          title="Search (Ctrl+K)"
        >
          <IconSearch className="w-3.5 h-3.5 text-[var(--color-text)]" />
          <span>Search</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--color-card)] text-[var(--color-label)] rounded border border-[var(--color-[#dddddd])] text-[10px]">Ctrl+K</kbd>
        </button>

        {/* Audit Report */}
        <button
          onClick={onOpenAudit}
          className="btn-secondary py-1.5 px-3 text-xs"
          title="Security Audit"
        >
          <IconShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Audit</span>
        </button>

        {/* Generator */}
        <button
          onClick={onOpenGenerator}
          className="btn-secondary py-1.5 px-3 text-xs"
          title="Password Generator"
        >
          <IconSparkles className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Generator</span>
        </button>

        {/* Backup & Sync */}
        <button
          onClick={onOpenBackup}
          className="btn-secondary py-1.5 px-3 text-xs"
          title="Backup & Sync"
        >
          <IconDownload className="w-4 h-4" />
          <span className="hidden sm:inline">Sync</span>
        </button>

        {/* Lock Security Toggle */}
        {isLockedEnabled ? (
          <button
            onClick={onLockApp}
            className="btn-primary py-1.5 px-3 text-xs"
            title="Lock Vault"
          >
            <IconLock className="w-4 h-4" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        ) : (
          <button
            onClick={onOpenLock}
            className="btn-secondary py-1.5 px-3 text-xs"
            title="Set Master PIN Security"
          >
            <IconKey className="w-4 h-4 text-[var(--color-label)]" />
            <span className="hidden sm:inline">Set PIN</span>
          </button>
        )}

        {/* Theme Switcher Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn-secondary p-1.5 text-xs"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <IconSun className="w-4 h-4 text-amber-400" /> : <IconMoon className="w-4 h-4 text-[#181d26]" />}
        </button>

        {/* GitHub Link */}
        <a
          className="btn-secondary py-1.5 px-3 text-xs"
          href="https://github.com/Bhagirathsinhrana378"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repo"
        >
          <svg className="w-4 h-4 text-[var(--color-text)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.476 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="hidden md:inline">GitHub</span>
        </a>

      </div>
    </nav>
  );
};

export default NavBar;