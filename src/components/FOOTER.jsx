import React from 'react';
import { IconShieldCheck } from './Icons.jsx';

const FOOTER = () => {
  return (
    <footer className="bg-white border-t border-[#dddddd] text-[#41454d] py-12 px-4 text-center mt-16 font-sans">
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#181d26]">
          <span>Crafted with care by Bhagirathsinh Rana</span>
        </div>

        <p className="text-xs text-[#41454d] max-w-xl mx-auto leading-relaxed">
          <strong className="text-[#181d26] font-medium">&lt;PaSS/--MaN&gt;</strong> is a zero-knowledge offline workflow password manager anchored on client-side AES-256-GCM encryption and local storage. No trackers, no telemetry.
        </p>

        <div className="text-[11px] text-[#9297a0] pt-2 flex items-center justify-center gap-1.5">
          <IconShieldCheck className="w-3.5 h-3.5 text-[#006400]" />
          <span>&copy; {new Date().getFullYear()} Passman Security. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default FOOTER;