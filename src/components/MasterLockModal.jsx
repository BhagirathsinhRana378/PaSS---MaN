import React, { useState } from 'react';
import { IconLock, IconUnlock, IconKey, IconX, IconShield } from './Icons.jsx';
import { toast } from 'react-toastify';

const MasterLockModal = ({ isOpen, isSettingLock, onUnlock, onSetLock, onRemoveLock, onClose }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSettingLock) {
      if (pin.length < 4) {
        toast.error('PIN code must be at least 4 digits!');
        return;
      }
      if (pin !== confirmPin) {
        toast.error('PIN codes do not match!');
        return;
      }
      onSetLock(pin);
      toast.success('Master Security PIN enabled!');
      setPin('');
      setConfirmPin('');
      onClose();
    } else {
      if (onUnlock(pin)) {
        toast.success('Vault unlocked!');
        setPin('');
      } else {
        toast.error('Incorrect PIN code. Try again.');
        setPin('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden text-center">
        
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center mb-4">
          {isSettingLock ? <IconKey className="w-8 h-8 text-emerald-400" /> : <IconLock className="w-8 h-8 text-emerald-400" />}
        </div>

        <h3 className="text-xl font-extrabold text-slate-100 mb-1">
          {isSettingLock ? 'Set App Security PIN' : 'PaSS---MaN Locked'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {isSettingLock ? 'Create a local PIN code to protect your passwords on this device.' : 'Enter your Master PIN code to unlock your vault.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength="12"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN code"
              className="w-full text-center tracking-widest text-2xl bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {isSettingLock && (
            <div>
              <input
                type="password"
                maxLength="12"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm PIN code"
                className="w-full text-center tracking-widest text-2xl bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {isSettingLock && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isSettingLock ? <IconShield className="w-4 h-4" /> : <IconUnlock className="w-4 h-4" />}
              {isSettingLock ? 'Save PIN' : 'Unlock Vault'}
            </button>
          </div>
        </form>

        {isSettingLock && onRemoveLock && (
          <button
            type="button"
            onClick={() => {
              onRemoveLock();
              toast.info('Master Security PIN removed.');
              onClose();
            }}
            className="mt-4 text-xs text-red-400 hover:text-red-300 underline"
          >
            Turn off PIN Security
          </button>
        )}

      </div>
    </div>
  );
};

export default MasterLockModal;
