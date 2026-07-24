import React, { useState } from 'react';
import { IconX, IconDownload, IconUpload, IconShield } from './Icons.jsx';
import { toast } from 'react-toastify';

const ExportImportModal = ({ isOpen, onClose, items, onImportItems }) => {
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState('merge');

  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute("download", `passman_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success(`Exported ${items.length} vault items!`);
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    }
  };

  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        setImportText(event.target.result);
      };
    }
  };

  const processImport = () => {
    if (!importText.trim()) {
      toast.error('Please select a file or paste JSON data.');
      return;
    }
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        toast.error('Invalid backup format: Must be an array of vault items.');
        return;
      }
      onImportItems(parsed, importMode);
      toast.success(`Imported ${parsed.length} items!`);
      setImportText('');
      onClose();
    } catch (err) {
      toast.error('Failed to parse JSON file.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181d26]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-[#dddddd] text-[#181d26] rounded-xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#dddddd]">
          <div className="flex items-center gap-2 font-display font-semibold text-lg text-[#181d26]">
            <IconShield className="w-5 h-5 text-[#1b61c9]" />
            <span>Backup & Sync (PC / Phone)</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#41454d] hover:text-[#181d26] p-1.5 rounded-lg transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[#333840] text-xs mb-5 leading-relaxed">
          Export your vault to JSON or restore existing backups to sync passwords between PC and Mobile.
        </p>

        {/* Section 1: Export */}
        <div className="bg-[#f8fafc] border border-[#dddddd] rounded-lg p-4 mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-[#181d26]">Export Vault File</h4>
            <p className="text-[11px] text-[#41454d]">Download {items.length} items as a `.json` file</p>
          </div>
          <button
            onClick={handleExportJSON}
            className="btn-airtable-primary py-2 px-3.5 text-xs"
          >
            <IconDownload className="w-4 h-4" /> Export JSON
          </button>
        </div>

        {/* Section 2: Import */}
        <div className="bg-[#f8fafc] border border-[#dddddd] rounded-lg p-4 space-y-3.5">
          <h4 className="font-semibold text-xs text-[#181d26]">Import Backup File</h4>

          <div>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="block w-full text-xs text-[#333840] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-[#181d26] file:text-white hover:file:bg-[#0d1218] cursor-pointer border border-[#dddddd] rounded-lg p-1"
            />
          </div>

          <div>
            <textarea
              rows="3"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Or paste JSON array here..."
              className="w-full bg-white border border-[#dddddd] rounded-lg p-2.5 text-xs font-mono text-[#181d26] placeholder-[#9297a0] focus:outline-none focus:border-[#181d26]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#41454d]">Import Mode:</span>
            <label className="flex items-center gap-1.5 text-[#333840] cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={importMode === 'merge'}
                onChange={() => setImportMode('merge')}
                className="accent-[#181d26]"
              />
              Merge
            </label>
            <label className="flex items-center gap-1.5 text-[#333840] cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                className="accent-[#aa2d00]"
              />
              Replace all
            </label>
          </div>

          <button
            onClick={processImport}
            className="w-full btn-airtable-primary justify-center py-2.5 text-xs"
          >
            <IconUpload className="w-4 h-4" /> Process & Restore Backup
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExportImportModal;
