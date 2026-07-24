import React, { useState } from 'react';
import { IconX, IconDownload, IconUpload, IconShield, IconCheck, IconFileText } from './Icons.jsx';
import { toast } from 'react-toastify';

const ExportImportModal = ({ isOpen, onClose, items, onImportItems }) => {
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState('merge'); // 'merge' or 'replace'

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
      toast.success(`Exported ${items.length} vault items successfully!`);
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
      toast.success(`Successfully imported ${parsed.length} items!`);
      setImportText('');
      onClose();
    } catch (err) {
      toast.error('Failed to parse JSON file: Check file format.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
            <IconShield className="w-6 h-6 text-emerald-400" />
            <span>Backup & Sync (PC / Mobile)</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Export your encrypted data to transfer between your PC and Mobile phone, or keep safe offline backups.
        </p>

        {/* Section 1: Export */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                <IconDownload className="w-4 h-4 text-emerald-400" />
                Export Vault Backup
              </h4>
              <p className="text-xs text-slate-400 mt-1">Download {items.length} items as a `.json` backup file</p>
            </div>
            <button
              onClick={handleExportJSON}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
            >
              <IconDownload className="w-4 h-4" /> Export File
            </button>
          </div>
        </div>

        {/* Section 2: Import */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <h4 className="font-semibold text-slate-100 flex items-center gap-2">
            <IconUpload className="w-4 h-4 text-indigo-400" />
            Import Backup File
          </h4>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Select JSON File or Drag & Drop</label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer border border-slate-800 rounded-xl p-1"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Or Paste Raw JSON Backup</label>
            <textarea
              rows="3"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste JSON array here..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Import Mode:</span>
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={importMode === 'merge'}
                onChange={() => setImportMode('merge')}
                className="accent-indigo-500"
              />
              Merge with existing
            </label>
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                className="accent-red-500"
              />
              Replace all existing
            </label>
          </div>

          <button
            onClick={processImport}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <IconUpload className="w-4 h-4" /> Process & Restore Backup
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExportImportModal;
