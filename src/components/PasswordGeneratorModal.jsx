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
    toast.success('Generated password copied to clipboard!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
            <IconSparkles className="w-6 h-6 animate-pulse" />
            <span>Password Generator</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Display Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-5 flex items-center justify-between gap-3 shadow-inner">
          <span className="font-mono text-lg tracking-wider text-emerald-300 break-all select-all font-semibold">
            {password || 'Select at least 1 option'}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={generatePassword}
              title="Regenerate"
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <IconRefresh className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              title="Copy Password"
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copied ? <IconCheck className="w-5 h-5 text-emerald-400" /> : <IconCopy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm text-slate-300 font-medium mb-1">
              <span>Password Length</span>
              <span className="font-bold text-emerald-400">{length} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="40"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors text-sm">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-slate-200 font-medium">ABC Uppercase</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors text-sm">
              <input
                type="checkbox"
                checked={useLowercase}
                onChange={(e) => setUseLowercase(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-slate-200 font-medium">abc Lowercase</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors text-sm">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-slate-200 font-medium">123 Numbers</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors text-sm">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-slate-200 font-medium">!@# Symbols</span>
            </label>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {onApplyPassword && (
            <button
              onClick={handleApply}
              disabled={!password}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              Use This Password
            </button>
          )}
          <button
            onClick={handleCopy}
            disabled={!password}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 border border-slate-700"
          >
            <IconCopy className="w-4 h-4" /> Copy Only
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGeneratorModal;
