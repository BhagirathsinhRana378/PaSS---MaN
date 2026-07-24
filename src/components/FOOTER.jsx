import React from 'react';

const FOOTER = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-4 text-center mt-12">
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-200">
          <span>Crafted with</span>
          <span role="img" aria-label="love" className="animate-pulse text-red-500">❤️‍🔥</span>
          <span>By Bhagirathsinh Rana</span>
        </div>

        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          <strong className="text-emerald-400 font-semibold">&lt;PaSS/--MaN&gt;</strong> keeps your sensitive passwords, secure text notes, cards, and keys completely offline in local storage. Your data never leaves your device.
        </p>

        <div className="text-[11px] text-slate-400 pt-2">
          &copy; {new Date().getFullYear()} Passman Security Vault. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FOOTER;