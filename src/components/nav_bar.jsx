import React from 'react';
import { IconShield, IconSparkles, IconDownload, IconLock, IconUnlock, IconKey } from './Icons.jsx';

const NavBar = ({ onOpenGenerator, onOpenBackup, onOpenLock, isLockedEnabled, onLockApp }) => {
  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 md:px-8 py-3.5 flex justify-between items-center shadow-xl sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
          <IconShield className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight select-none">
          <span className="text-emerald-400">&lt;</span>
          <span className="text-slate-100">Pa</span>
          <span className="text-emerald-400">S</span>
          <span className="text-emerald-500">S</span>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-400">-</span>
          <span className="text-pink-400">-</span>
          <span className="text-slate-100">MaN</span>
          <span className="text-emerald-400">&gt;</span>
        </h1>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Password Generator */}
        <button
          onClick={onOpenGenerator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs md:text-sm font-semibold border border-slate-700/60 transition-all shadow-sm"
          title="Password Generator"
        >
          <IconSparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Generator</span>
        </button>

        {/* Backup & Sync */}
        <button
          onClick={onOpenBackup}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs md:text-sm font-semibold border border-slate-700/60 transition-all shadow-sm"
          title="Backup & Sync"
        >
          <IconDownload className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Backup / Sync</span>
        </button>

        {/* Lock Security Toggle */}
        {isLockedEnabled ? (
          <button
            onClick={onLockApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs md:text-sm font-semibold border border-emerald-500/30 transition-all shadow-sm"
            title="Lock App"
          >
            <IconLock className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Lock Vault</span>
          </button>
        ) : (
          <button
            onClick={onOpenLock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs md:text-sm font-semibold border border-slate-700/60 transition-all shadow-sm"
            title="Set Master PIN Security"
          >
            <IconKey className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Set PIN</span>
          </button>
        )}

        {/* GitHub Link */}
        <a
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs md:text-sm font-semibold border border-slate-700/60 transition-all shadow-sm"
          href="https://github.com/Bhagirathsinhrana378"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.476 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="hidden md:inline">GitHub</span>
        </a>
      </div>
    </nav>
  );
};

export default NavBar;