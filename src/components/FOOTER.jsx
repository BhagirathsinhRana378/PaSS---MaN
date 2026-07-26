import React from 'react';
import { IconShield } from './Icons.jsx';

const FOOTER = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1f1f1f] text-[#b3b3b3] py-12 px-6 md:px-12 font-sans text-xs">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="PaSS-MaN Logo" className="w-6 h-6 rounded-md object-cover border border-[#1f1f1f]" />
            <span className="font-display font-semibold text-white text-base">PaSS-MaN</span>
          </div>
          <p className="text-xs text-[#5a5a5c] leading-relaxed">
            Zero-knowledge, client-side encrypted developer vault suite. Stored 100% locally on your machine.
          </p>
        </div>

        {/* Column 1: Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Features</h4>
          <ul className="space-y-2">
            <li><a href="#vault" className="hover:text-[#00d4a4] transition-colors">AES-256 Vault</a></li>
            <li><a href="#notes" className="hover:text-[#00d4a4] transition-colors">Secure Text Notes</a></li>
            <li><a href="#generator" className="hover:text-[#00d4a4] transition-colors">Password Generator</a></li>
            <li><a href="#audit" className="hover:text-[#00d4a4] transition-colors">Security Audit</a></li>
          </ul>
        </div>

        {/* Column 2: Security */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Security</h4>
          <ul className="space-y-2">
            <li><span className="text-white">Web Crypto API</span></li>
            <li><span className="text-white">PBKDF2 Derivation</span></li>
            <li><span className="text-white">100,000 Iterations</span></li>
            <li><span className="text-white">Zero Cloud Sync</span></li>
          </ul>
        </div>

        {/* Column 3: Developer */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Developer</h4>
          <ul className="space-y-2">
            <li><a href="https://github.com/Bhagirathsinhrana378" target="_blank" rel="noopener noreferrer" className="hover:text-[#00d4a4] transition-colors">GitHub Repository</a></li>
            <li><span className="text-[#5a5a5c]">Hosted on gh-pages</span></li>
            <li><span className="text-[#5a5a5c]">MIT Open Source</span></li>
          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-[#1f1f1f] flex flex-col md:flex-row justify-between items-center gap-4 text-[#5a5a5c]">
        <p>© {new Date().getFullYear()} PaSS-MaN Security Suite. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <span>Made by</span>
          <span className="text-[#00d4a4] font-semibold">Bhagirayhsinh Rana</span>
          <span>&</span>
          <span className="text-white font-semibold">Google Antigravity</span>
        </p>
      </div>
    </footer>
  );
};

export default FOOTER;