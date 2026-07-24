import React, { useState, useEffect } from 'react';
import NavBar from './components/nav_bar.jsx';
import Manager from './components/MANAGER.jsx';
import Footer from './components/FOOTER.jsx';
import PasswordGeneratorModal from './components/PasswordGeneratorModal.jsx';
import ExportImportModal from './components/ExportImportModal.jsx';
import MasterLockModal from './components/MasterLockModal.jsx';
import VaultAuditModal from './components/VaultAuditModal.jsx';
import { ToastContainer, Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconKey, IconShieldCheck, IconX } from './components/Icons.jsx';

function App() {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isPassphraseModalOpen, setIsPassphraseModalOpen] = useState(false);

  // Master Encryption Passphrase
  const [masterPassphrase, setMasterPassphrase] = useState('');
  const [inputPassphrase, setInputPassphrase] = useState('');

  // Applied password state from generator modal
  const [appliedPassword, setAppliedPassword] = useState('');

  // PIN Lock State
  const [masterPin, setMasterPin] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isSettingLock, setIsSettingLock] = useState(false);

  // Vault Items in state for backup export/import & audit
  const [vaultItems, setVaultItems] = useState([]);

  useEffect(() => {
    try {
      const savedPin = localStorage.getItem('passman_master_pin');
      if (savedPin) {
        setMasterPin(savedPin);
        setIsLocked(true);
      }

      const stored = localStorage.getItem('passwords');
      if (stored) {
        setVaultItems(JSON.parse(stored));
      }

      const savedPassphrase = sessionStorage.getItem('passman_session_passphrase');
      if (savedPassphrase) {
        setMasterPassphrase(savedPassphrase);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSetLock = (pin) => {
    setMasterPin(pin);
    localStorage.setItem('passman_master_pin', pin);
  };

  const handleRemoveLock = () => {
    setMasterPin('');
    setIsLocked(false);
    localStorage.removeItem('passman_master_pin');
  };

  const handleUnlock = (enteredPin) => {
    if (enteredPin === masterPin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const handleSetMasterPassphrase = (e) => {
    e.preventDefault();
    if (!inputPassphrase.trim()) {
      toast.error('Passphrase cannot be empty!');
      return;
    }
    setMasterPassphrase(inputPassphrase);
    sessionStorage.setItem('passman_session_passphrase', inputPassphrase);
    toast.success('AES-256-GCM Encryption Key active for this session!');
    setIsPassphraseModalOpen(false);
    setInputPassphrase('');
  };

  const handleImportItems = (newItems, mode) => {
    let finalItems;
    if (mode === 'replace') {
      finalItems = newItems;
    } else {
      const existingIds = new Set(vaultItems.map((i) => i.id));
      const filteredNew = newItems.filter((i) => !existingIds.has(i.id));
      finalItems = [...vaultItems, ...filteredNew];
    }
    setVaultItems(finalItems);
    localStorage.setItem('passwords', JSON.stringify(finalItems));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans flex flex-col justify-between relative overflow-x-hidden">
      
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {/* Cybernetic Grid & Glow Accents */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Header */}
      <NavBar
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenLock={() => {
          setIsSettingLock(true);
          setIsLockModalOpen(true);
        }}
        isLockedEnabled={!!masterPin}
        onLockApp={() => setIsLocked(true)}
        isEncryptedMode={!!masterPassphrase}
      />

      {/* Main Workspace */}
      <main className="flex-grow">
        <Manager
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          generatorAppliedPassword={appliedPassword}
          clearAppliedPassword={() => setAppliedPassword('')}
          onOpenAudit={() => setIsAuditOpen(true)}
          masterPassphrase={masterPassphrase}
          onOpenPassphraseModal={() => setIsPassphraseModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PasswordGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onApplyPassword={(pwd) => setAppliedPassword(pwd)}
      />

      <ExportImportModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        items={vaultItems}
        onImportItems={handleImportItems}
      />

      <VaultAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        items={vaultItems}
      />

      <MasterLockModal
        isOpen={isLocked || (isLockModalOpen && isSettingLock)}
        isSettingLock={isLockModalOpen && isSettingLock}
        onUnlock={handleUnlock}
        onSetLock={handleSetLock}
        onRemoveLock={handleRemoveLock}
        onClose={() => setIsLockModalOpen(false)}
      />

      {/* Enable AES Encryption Passphrase Modal */}
      {isPassphraseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b101b] border border-cyan-500/30 text-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-extrabold font-display-heading text-lg">
                <IconKey className="w-5 h-5 text-cyan-400" />
                <span>AES-256-GCM Session Key</span>
              </div>
              <button
                onClick={() => setIsPassphraseModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800 p-1 rounded-full"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
              Enter a master passphrase. Passman will derive a SHA-256 key using PBKDF2 (100k rounds) to encrypt sensitive data client-side before saving to localStorage.
            </p>

            <form onSubmit={handleSetMasterPassphrase} className="space-y-4 font-mono">
              <input
                type="password"
                autoFocus
                value={inputPassphrase}
                onChange={(e) => setInputPassphrase(e.target.value)}
                placeholder="Enter Master Encryption Passphrase"
                className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-cyan-300 placeholder-slate-600 outline-none"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPassphraseModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20"
                >
                  Activate Encryption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;