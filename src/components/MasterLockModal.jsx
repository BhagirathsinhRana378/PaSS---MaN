import React, { useState } from 'react';
import { IconLock, IconUnlock, IconKey, IconShield } from './Icons.jsx';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181d26]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-[#dddddd] text-[#181d26] rounded-xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden text-center">
        
        <div className="w-14 h-14 bg-[#f8fafc] border border-[#dddddd] rounded-xl mx-auto flex items-center justify-center mb-4 text-[#181d26]">
          {isSettingLock ? <IconKey className="w-7 h-7" /> : <IconLock className="w-7 h-7" />}
        </div>

        <h3 className="text-xl font-display font-medium text-[#181d26] mb-1">
          {isSettingLock ? 'Set App Security PIN' : 'PaSS---MaN Locked'}
        </h3>
        <p className="text-xs text-[#41454d] mb-6">
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
              className="w-full text-center tracking-widest text-2xl bg-[#f8fafc] border border-[#dddddd] focus:border-[#181d26] rounded-lg py-2.5 px-4 text-[#181d26] placeholder-[#9297a0] focus:outline-none font-mono"
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
                className="w-full text-center tracking-widest text-2xl bg-[#f8fafc] border border-[#dddddd] focus:border-[#181d26] rounded-lg py-2.5 px-4 text-[#181d26] placeholder-[#9297a0] focus:outline-none font-mono"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {isSettingLock && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-airtable-secondary justify-center py-2.5"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 btn-airtable-primary justify-center py-2.5"
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
            className="mt-4 text-xs text-[#aa2d00] hover:underline"
          >
            Turn off PIN Security
          </button>
        )}

      </div>
    </div>
  );
};

export default MasterLockModal;
