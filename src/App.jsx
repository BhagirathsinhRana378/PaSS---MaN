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
import { IconKey, IconX } from './components/Icons.jsx';

function App() {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isPassphraseModalOpen, setIsPassphraseModalOpen] = useState(false);

  // Force 100% Dark Mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const [masterPassphrase, setMasterPassphrase] = useState('');
  const [inputPassphrase, setInputPassphrase] = useState('');

  const [appliedPassword, setAppliedPassword] = useState('');

  const [masterPin, setMasterPin] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isSettingLock, setIsSettingLock] = useState(false);

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
    toast.success('AES-256-GCM Encryption Key active!');
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col justify-between relative selection:bg-[#00d4a4] selection:text-[#0a0a0a]">
      
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

      {/* Header Navigation */}
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

      {/* Mintlify Footer */}
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
          <div className="mint-card text-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-[#1f1f1f]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#1f1f1f]">
              <div className="flex items-center gap-2 font-display font-semibold text-base">
                <IconKey className="w-5 h-5 text-[#00d4a4]" />
                <span>AES-256-GCM Session Key</span>
              </div>
              <button
                onClick={() => setIsPassphraseModalOpen(false)}
                className="text-[#b3b3b3] hover:text-white p-1 rounded-lg"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#b3b3b3] mb-4 leading-relaxed font-sans">
              Enter a master passphrase. Passman will derive a 256-bit key using PBKDF2 (100,000 iterations) to encrypt sensitive data client-side before saving to localStorage.
            </p>

            <form onSubmit={handleSetMasterPassphrase} className="space-y-4 font-sans">
              <input
                type="password"
                autoFocus
                value={inputPassphrase}
                onChange={(e) => setInputPassphrase(e.target.value)}
                placeholder="Enter Master Passphrase"
                className="w-full mint-input px-3.5 py-2.5 text-sm font-mono"
              />

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPassphraseModalOpen(false)}
                  className="flex-1 btn-dark-outline justify-center py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-mint-pill justify-center py-2.5 text-xs"
                >
                  Activate AES Key
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