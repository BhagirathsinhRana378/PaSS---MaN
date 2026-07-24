import React, { useState, useEffect } from 'react';
import { IconX, IconRefresh, IconCopy, IconCheck, IconSparkles } from './Icons.jsx';
import { toast } from 'react-toastify';

const PasswordGeneratorModal = ({ isOpen, onClose, onApplyPassword }) => {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    let generated = '';
    const cryptoObj = window.crypto || window.msCrypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
      const values = new Uint32Array(length);
      cryptoObj.getRandomValues(values);
      for (let i = 0; i < length; i++) {
        generated += charset[values[i] % charset.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        generated += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    setPassword(generated);
  };

  useEffect(() => {
    if (isOpen) {
      generatePassword();
    }
  }, [isOpen, length, useUppercase, useLowercase, useNumbers, useSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Generated password copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyPassword && password) {
      onApplyPassword(password);
      toast.success('Applied to form!');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181d26]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-[#dddddd] text-[#181d26] rounded-xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#dddddd]">
          <div className="flex items-center gap-2 text-[#181d26] font-display font-semibold text-lg">
            <IconSparkles className="w-5 h-5 text-[#1b61c9]" />
            <span>Password Generator</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#41454d] hover:text-[#181d26] p-1.5 rounded-lg transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Display Field */}
        <div className="bg-[#f8fafc] border border-[#dddddd] rounded-lg p-3.5 mb-5 flex items-center justify-between gap-3">
          <span className="font-mono text-base font-semibold text-[#181d26] break-all select-all">
            {password || 'Select options'}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={generatePassword}
              title="Regenerate"
              className="p-1.5 text-[#41454d] hover:text-[#181d26] rounded-lg hover:bg-[#e0e2e6] transition-colors"
            >
              <IconRefresh className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              title="Copy"
              className="p-1.5 text-[#41454d] hover:text-[#181d26] rounded-lg hover:bg-[#e0e2e6] transition-colors"
            >
              {copied ? <IconCheck className="w-4 h-4 text-[#006400]" /> : <IconCopy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4 mb-6 text-xs text-[#333840]">
          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Password Length</span>
              <span className="font-semibold text-[#181d26]">{length} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="40"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-[#e0e2e6] rounded-lg appearance-none cursor-pointer accent-[#181d26]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <label className="flex items-center gap-2 bg-[#f8fafc] p-2.5 rounded-lg border border-[#dddddd] cursor-pointer hover:border-[#9297a0]">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="w-4 h-4 accent-[#181d26]"
              />
              <span>ABC Uppercase</span>
            </label>

            <label className="flex items-center gap-2 bg-[#f8fafc] p-2.5 rounded-lg border border-[#dddddd] cursor-pointer hover:border-[#9297a0]">
              <input
                type="checkbox"
                checked={useLowercase}
                onChange={(e) => setUseLowercase(e.target.checked)}
                className="w-4 h-4 accent-[#181d26]"
              />
              <span>abc Lowercase</span>
            </label>

            <label className="flex items-center gap-2 bg-[#f8fafc] p-2.5 rounded-lg border border-[#dddddd] cursor-pointer hover:border-[#9297a0]">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="w-4 h-4 accent-[#181d26]"
              />
              <span>123 Numbers</span>
            </label>

            <label className="flex items-center gap-2 bg-[#f8fafc] p-2.5 rounded-lg border border-[#dddddd] cursor-pointer hover:border-[#9297a0]">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="w-4 h-4 accent-[#181d26]"
              />
              <span>!@# Symbols</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          {onApplyPassword && (
            <button
              onClick={handleApply}
              disabled={!password}
              className="flex-1 btn-airtable-primary justify-center py-2.5"
            >
              Use This Password
            </button>
          )}
          <button
            onClick={handleCopy}
            disabled={!password}
            className="flex-1 btn-airtable-secondary justify-center py-2.5"
          >
            Copy Only
          </button>
        </div>

      </div>
    </div>
  );
};

export default PasswordGeneratorModal;
