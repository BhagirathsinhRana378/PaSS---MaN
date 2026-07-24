import React, { useState, useEffect } from 'react';
import NavBar from './components/nav_bar.jsx';
import Manager from './components/MANAGER.jsx';
import Footer from './components/FOOTER.jsx';
import PasswordGeneratorModal from './components/PasswordGeneratorModal.jsx';
import ExportImportModal from './components/ExportImportModal.jsx';
import MasterLockModal from './components/MasterLockModal.jsx';
import { ToastContainer, Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  
  // Applied password state from generator modal
  const [appliedPassword, setAppliedPassword] = useState('');

  // Lock State
  const [masterPin, setMasterPin] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isSettingLock, setIsSettingLock] = useState(false);

  // Vault Items in state for backup export/import
  const [vaultItems, setVaultItems] = useState([]);

  useEffect(() => {
    try {
      const savedPin = localStorage.getItem('passman_master_pin');
      if (savedPin) {
        setMasterPin(savedPin);
        setIsLocked(true); // Lock on app start if PIN exists
      }

      const stored = localStorage.getItem('passwords');
      if (stored) {
        setVaultItems(JSON.parse(stored));
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

  const handleImportItems = (newItems, mode) => {
    let finalItems;
    if (mode === 'replace') {
      finalItems = newItems;
    } else {
      // Merge by ID
      const existingIds = new Set(vaultItems.map(i => i.id));
      const filteredNew = newItems.filter(i => !existingIds.has(i.id));
      finalItems = [...vaultItems, ...filteredNew];
    }
    setVaultItems(finalItems);
    localStorage.setItem('passwords', JSON.stringify(finalItems));
    // Trigger window reload or state update so Manager picks it up
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans flex flex-col justify-between relative overflow-x-hidden">
      
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

      {/* Background Glow Accents */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* App Header */}
      <NavBar
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenLock={() => {
          setIsSettingLock(true);
          setIsLockModalOpen(true);
        }}
        isLockedEnabled={!!masterPin}
        onLockApp={() => setIsLocked(true)}
      />

      {/* Main Content */}
      <main className="flex-grow">
        <Manager
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          generatorAppliedPassword={appliedPassword}
          clearAppliedPassword={() => setAppliedPassword('')}
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

      {/* Master Lock Modal (Lock screen when locked or setting PIN) */}
      <MasterLockModal
        isOpen={isLocked || (isLockModalOpen && isSettingLock)}
        isSettingLock={isLockModalOpen && isSettingLock}
        onUnlock={handleUnlock}
        onSetLock={handleSetLock}
        onRemoveLock={handleRemoveLock}
        onClose={() => setIsLockModalOpen(false)}
      />

    </div>
  );
}

export default App;