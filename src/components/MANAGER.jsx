import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { encryptText, decryptText, isEncrypted } from '../utils/crypto.js';
import {
  IconKey,
  IconFileText,
  IconCreditCard,
  IconWifi,
  IconShield,
  IconShieldCheck,
  IconSearch,
  IconCopy,
  IconCheck,
  IconTrash,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconPlus,
  IconStar,
  IconGrid,
  IconList,
  IconSparkles,
  IconExternalLink,
  IconCode,
  IconZap,
  IconCpu,
  IconLock,
  IconUnlock
} from './Icons.jsx';

// Calculate Password Strength Metric
const getPasswordStrength = (pwd) => {
  if (!pwd) return { label: 'None', score: 0, color: 'bg-slate-700', text: 'text-slate-500' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { label: 'Weak', score, color: 'bg-red-500', text: 'text-red-400' };
  if (score === 3 || score === 4) return { label: 'Medium', score, color: 'bg-amber-400', text: 'text-amber-400' };
  return { label: 'Strong', score, color: 'bg-emerald-400', text: 'text-emerald-400' };
};

// Normalize data structure for backward compatibility
const normalizeVaultItem = (item) => {
  return {
    id: item.id || uuidv4(),
    type: item.type || 'login',
    title: item.title || item.site || 'Untitled Entry',
    site: item.site || '',
    username: item.username || '',
    password: item.password || '',
    notes: item.notes || '',
    cardHolder: item.cardHolder || '',
    cardNumber: item.cardNumber || '',
    cardExpiry: item.cardExpiry || '',
    cardCvv: item.cardCvv || '',
    wifiSecurity: item.wifiSecurity || 'WPA2',
    apiKeySecret: item.apiKeySecret || '',
    category: item.category || 'General',
    isFavorite: item.isFavorite || false,
    createdAt: item.createdAt || new Date().toISOString()
  };
};

const MANAGER = ({
  onOpenGenerator,
  generatorAppliedPassword,
  clearAppliedPassword,
  onOpenAudit,
  masterPassphrase,
  onOpenPassphraseModal
}) => {
  const [passwordArray, setPasswordArray] = useState([]);
  const [decryptedCache, setDecryptedCache] = useState({}); // id -> decrypted item copy
  const [activeType, setActiveType] = useState('login');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [clipboardTimer, setClipboardTimer] = useState(null);

  const searchInputRef = useRef(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    site: '',
    username: '',
    password: '',
    notes: '',
    cardHolder: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    wifiSecurity: 'WPA2',
    apiKeySecret: '',
    category: 'General'
  });

  // Load items from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('passwords');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPasswordArray(parsed.map(normalizeVaultItem));
        }
      }
    } catch (e) {
      console.error('Failed loading storage:', e);
    }
  }, []);

  // Decrypt ciphertext items when masterPassphrase is present or changes
  useEffect(() => {
    async function processDecryption() {
      const cache = {};
      for (const item of passwordArray) {
        if (masterPassphrase) {
          const decPassword = isEncrypted(item.password)
            ? await decryptText(item.password, masterPassphrase)
            : item.password;
          const decNotes = isEncrypted(item.notes)
            ? await decryptText(item.notes, masterPassphrase)
            : item.notes;
          const decCardNumber = isEncrypted(item.cardNumber)
            ? await decryptText(item.cardNumber, masterPassphrase)
            : item.cardNumber;
          const decCardCvv = isEncrypted(item.cardCvv)
            ? await decryptText(item.cardCvv, masterPassphrase)
            : item.cardCvv;
          const decApiSecret = isEncrypted(item.apiKeySecret)
            ? await decryptText(item.apiKeySecret, masterPassphrase)
            : item.apiKeySecret;

          cache[item.id] = {
            ...item,
            password: decPassword,
            notes: decNotes,
            cardNumber: decCardNumber,
            cardCvv: decCardCvv,
            apiKeySecret: decApiSecret
          };
        } else {
          cache[item.id] = item;
        }
      }
      setDecryptedCache(cache);
    }
    processDecryption();
  }, [passwordArray, masterPassphrase]);

  // Handle Ctrl+K and Ctrl+N Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        window.scrollTo({ top: 180, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply generator password when user uses generator modal
  useEffect(() => {
    if (generatorAppliedPassword) {
      setForm((prev) => ({
        ...prev,
        password: generatorAppliedPassword,
        apiKeySecret: generatorAppliedPassword
      }));
      if (clearAppliedPassword) clearAppliedPassword();
    }
  }, [generatorAppliedPassword, clearAppliedPassword]);

  const saveToStorage = (items) => {
    setPasswordArray(items);
    localStorage.setItem('passwords', JSON.stringify(items));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      site: '',
      username: '',
      password: '',
      notes: '',
      cardHolder: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      wifiSecurity: 'WPA2',
      apiKeySecret: '',
      category: 'General'
    });
    setEditingId(null);
  };

  const handleSaveItem = async () => {
    const hasContent =
      form.title.trim() ||
      form.site.trim() ||
      form.username.trim() ||
      form.password.trim() ||
      form.notes.trim() ||
      form.cardNumber.trim();

    if (!hasContent) {
      toast.error('Please enter a Title, URL, or Note before saving.');
      return;
    }

    const computedTitle =
      form.title.trim() ||
      form.site.trim() ||
      (activeType === 'note' ? 'Untitled Note' : 'Untitled Vault Item');

    // If masterPassphrase is set, encrypt sensitive fields
    let encPassword = form.password;
    let encNotes = form.notes;
    let encCardNumber = form.cardNumber;
    let encCardCvv = form.cardCvv;
    let encApiSecret = form.apiKeySecret;

    if (masterPassphrase) {
      if (form.password) encPassword = await encryptText(form.password, masterPassphrase);
      if (form.notes) encNotes = await encryptText(form.notes, masterPassphrase);
      if (form.cardNumber) encCardNumber = await encryptText(form.cardNumber, masterPassphrase);
      if (form.cardCvv) encCardCvv = await encryptText(form.cardCvv, masterPassphrase);
      if (form.apiKeySecret) encApiSecret = await encryptText(form.apiKeySecret, masterPassphrase);
    }

    const newItem = normalizeVaultItem({
      ...form,
      title: computedTitle,
      type: activeType,
      password: encPassword,
      notes: encNotes,
      cardNumber: encCardNumber,
      cardCvv: encCardCvv,
      apiKeySecret: encApiSecret,
      id: editingId || uuidv4()
    });

    let updated;
    if (editingId) {
      updated = passwordArray.map((item) => (item.id === editingId ? newItem : item));
      toast.success('Entry updated in vault!');
    } else {
      updated = [newItem, ...passwordArray];
      toast.success('Saved to vault!');
    }

    saveToStorage(updated);
    resetForm();
  };

  const handleEdit = (item) => {
    const decItem = decryptedCache[item.id] || item;
    setEditingId(item.id);
    setActiveType(item.type || 'login');
    setForm({
      title: decItem.title || '',
      site: decItem.site || '',
      username: decItem.username || '',
      password: decItem.password || '',
      notes: decItem.notes || '',
      cardHolder: decItem.cardHolder || '',
      cardNumber: decItem.cardNumber || '',
      cardExpiry: decItem.cardExpiry || '',
      cardCvv: decItem.cardCvv || '',
      wifiSecurity: decItem.wifiSecurity || 'WPA2',
      apiKeySecret: decItem.apiKeySecret || '',
      category: decItem.category || 'General'
    });
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const handleDeleteConfirmed = () => {
    if (!deleteConfirmId) return;
    const updated = passwordArray.filter((i) => i.id !== deleteConfirmId);
    saveToStorage(updated);
    toast.info('Item deleted.');
    setDeleteConfirmId(null);
  };

  const toggleFavorite = (id) => {
    const updated = passwordArray.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveToStorage(updated);
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Clipboard copy with 30s auto-clear safety
  const copyToClipboard = (text, label = 'Secret') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}! (Auto-clears in 30s)`);

    if (clipboardTimer) clearTimeout(clipboardTimer);
    const timer = setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 30000);
    setClipboardTimer(timer);
  };

  // Filter & Search Logic
  const displayItems = useMemo(() => {
    return passwordArray.map((item) => decryptedCache[item.id] || item).filter((item) => {
      if (filterType === 'favorites' && !item.isFavorite) return false;
      if (filterType !== 'all' && filterType !== 'favorites' && item.type !== filterType) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.site && item.site.toLowerCase().includes(q)) ||
        (item.username && item.username.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    });
  }, [passwordArray, decryptedCache, filterType, searchQuery]);

  const strength = getPasswordStrength(form.password);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Tactical HUD Header */}
      <div className="glass-cyber rounded-2xl p-6 mb-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                SYSTEM ONLINE
              </span>
              <span className="text-slate-500 text-xs font-mono">• {passwordArray.length} Vault Entries</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold font-display-heading tracking-tight text-slate-100">
              Cybernetic <span className="text-cyan-400">Vault Terminal</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAudit}
              className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <IconShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Run Vault Audit</span>
            </button>

            {!masterPassphrase && onOpenPassphraseModal && (
              <button
                onClick={onOpenPassphraseModal}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 rounded-xl text-xs font-mono font-extrabold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
              >
                <IconZap className="w-4 h-4" />
                <span>Enable AES Encryption</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Input Form Workspace */}
      <div className="glass-cyber rounded-2xl p-6 mb-8 border border-slate-800 shadow-xl">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-800">
          <h3 className="font-display-heading font-bold text-lg text-slate-100 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-cyan-400 stroke-[3]" />
            <span>{editingId ? 'Edit Vault Entry' : 'Create Vault Entry'}</span>
          </h3>

          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs font-mono px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Type Switcher Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveType('login')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeType === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <IconKey className="w-4 h-4" /> Logins
          </button>

          <button
            type="button"
            onClick={() => setActiveType('note')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeType === 'note'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <IconFileText className="w-4 h-4" /> Secure Text Note
          </button>

          <button
            type="button"
            onClick={() => setActiveType('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeType === 'card'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <IconCreditCard className="w-4 h-4" /> Payment Card
          </button>

          <button
            type="button"
            onClick={() => setActiveType('wifi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeType === 'wifi'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <IconWifi className="w-4 h-4" /> Wi-Fi Info
          </button>

          <button
            type="button"
            onClick={() => setActiveType('api')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeType === 'api'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <IconCode className="w-4 h-4" /> API Key
          </button>
        </div>

        {/* Dynamic Form Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Title / Identifier</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder={
                  activeType === 'login'
                    ? 'e.g. GitHub Account'
                    : activeType === 'note'
                    ? 'e.g. Wallet Seed Phrase'
                    : activeType === 'card'
                    ? 'e.g. Primary Bank Card'
                    : activeType === 'wifi'
                    ? 'e.g. Home Wi-Fi 5G'
                    : 'e.g. Anthropic API Secret'
                }
                className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-2.5 text-sm text-slate-100 cursor-pointer font-mono"
              >
                <option value="General">General</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Finance">Finance</option>
                <option value="Social">Social</option>
              </select>
            </div>
          </div>

          {activeType === 'login' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Website URL</label>
                  <input
                    type="text"
                    name="site"
                    value={form.site}
                    onChange={handleInputChange}
                    placeholder="https://github.com"
                    className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Username / Email</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-mono text-slate-300">Password (Optional)</label>
                  {form.password && (
                    <span className={`text-xs font-mono font-bold ${strength.text}`}>
                      Strength: {strength.label}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="flex-1 bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={onOpenGenerator}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-colors shrink-0"
                  >
                    <IconSparkles className="w-4 h-4" /> Generate
                  </button>
                </div>
                {form.password && (
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                  </div>
                )}
              </div>
            </>
          )}

          {activeType === 'note' && (
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Secure Text / Note Content</label>
              <textarea
                name="notes"
                rows="5"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Write any custom text, instructions, recovery codes, or private notes here..."
                className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 font-mono leading-relaxed"
              />
            </div>
          )}

          {activeType === 'card' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={form.cardHolder}
                    onChange={handleInputChange}
                    placeholder="JOHN DOE"
                    className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4532 •••• •••• 8910"
                    className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="12/28"
                    className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">CVV Code</label>
                  <input
                    type="password"
                    name="cardCvv"
                    maxLength="4"
                    value={form.cardCvv}
                    onChange={handleInputChange}
                    placeholder="•••"
                    className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                  />
                </div>
              </div>
            </>
          )}

          {activeType === 'wifi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Network Name (SSID)</label>
                <input
                  type="text"
                  name="site"
                  value={form.site}
                  onChange={handleInputChange}
                  placeholder="Home_WiFi_5G"
                  className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Wi-Fi Password</label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Wi-Fi Password"
                  className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                />
              </div>
            </div>
          )}

          {activeType === 'api' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">API Key / Token Name</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  placeholder="Stripe Live Secret Key"
                  className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Secret Key Value</label>
                <input
                  type="text"
                  name="apiKeySecret"
                  value={form.apiKeySecret}
                  onChange={handleInputChange}
                  placeholder="sk_live_51Nx..."
                  className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600"
                />
              </div>
            </div>
          )}

          {activeType !== 'note' && (
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                rows="2"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Any extra comments or security details..."
                className="w-full bg-[#080c14] border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl p-3 text-xs text-slate-100 font-mono placeholder-slate-600"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSaveItem}
              className="w-full md:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold font-mono text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <IconPlus className="w-5 h-5 stroke-[3]" />
              <span>{editingId ? 'Update Entry' : 'Save Vault Entry'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Controls HUD Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-80">
          <IconSearch className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault (Ctrl+K)..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              filterType === 'all' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-100'
            }`}
          >
            All ({passwordArray.length})
          </button>

          <button
            onClick={() => setFilterType('favorites')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              filterType === 'favorites' ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-100'
            }`}
          >
            <IconStar className="w-3.5 h-3.5" fill={filterType === 'favorites' ? 'currentColor' : 'none'} /> Favorites
          </button>

          <button
            onClick={() => setFilterType('login')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              filterType === 'login' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-100'
            }`}
          >
            Logins
          </button>

          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              filterType === 'note' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-100'
            }`}
          >
            Notes
          </button>

          <button
            onClick={() => setFilterType('card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              filterType === 'card' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-100'
            }`}
          >
            Cards
          </button>

          <div className="ml-auto flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-100'}`}
              title="Grid Cards View"
            >
              <IconGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-100'}`}
              title="Compact Table View"
            >
              <IconList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Vault Items List */}
      {displayItems.length === 0 ? (
        <div className="glass-cyber rounded-2xl p-12 text-center my-6 border border-slate-800">
          <IconShield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold font-display-heading text-slate-300 mb-1">No Entries Found</h3>
          <p className="text-slate-500 text-xs font-mono">
            {searchQuery ? 'No vault items match your search criteria.' : 'Create your first login, secure note, or card above!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {displayItems.map((item) => {
            const isVisible = visiblePasswords[item.id];
            return (
              <div
                key={item.id}
                className="glass-cyber-card rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group animate-fade-in"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                        {item.type === 'login' && <IconKey className="w-5 h-5" />}
                        {item.type === 'note' && <IconFileText className="w-5 h-5" />}
                        {item.type === 'card' && <IconCreditCard className="w-5 h-5" />}
                        {item.type === 'wifi' && <IconWifi className="w-5 h-5" />}
                        {item.type === 'api' && <IconCode className="w-5 h-5" />}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-100 text-base truncate">{item.title}</h4>
                        <span className="inline-block px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 text-[10px] uppercase font-mono font-semibold rounded-md">
                          {item.category || item.type}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="text-slate-500 hover:text-amber-400 p-1 transition-colors"
                    >
                      <IconStar
                        className={`w-5 h-5 ${item.isFavorite ? 'text-amber-400' : ''}`}
                        fill={item.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 py-2">
                    {item.site && (
                      <div className="flex items-center justify-between bg-[#080c14] p-2 rounded-xl border border-slate-800 font-mono">
                        <a
                          href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                        >
                          {item.site} <IconExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(item.site, 'URL')}
                          className="text-slate-400 hover:text-slate-100 p-1"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.username && (
                      <div className="flex items-center justify-between bg-[#080c14] p-2 rounded-xl border border-slate-800 font-mono">
                        <span className="text-slate-200 truncate">{item.username}</span>
                        <button
                          onClick={() => copyToClipboard(item.username, 'Username')}
                          className="text-slate-400 hover:text-slate-100 p-1"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.password && (
                      <div className="flex items-center justify-between bg-[#080c14] p-2 rounded-xl border border-slate-800 font-mono">
                        <span className="text-emerald-400 tracking-wider">
                          {isVisible ? item.password : '••••••••••••'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="text-slate-400 hover:text-slate-100 p-1"
                          >
                            {isVisible ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(item.password, 'Password')}
                            className="text-slate-400 hover:text-slate-100 p-1"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {item.type === 'note' && item.notes && (
                      <div className="bg-[#080c14] p-3 rounded-xl border border-slate-800 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {item.notes}
                      </div>
                    )}

                    {item.type === 'card' && (
                      <div className="space-y-1.5 bg-[#080c14] p-2.5 rounded-xl border border-slate-800 font-mono text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>{item.cardHolder || 'CARD HOLDER'}</span>
                          <span>{item.cardExpiry}</span>
                        </div>
                        <div className="flex justify-between items-center text-cyan-400 font-bold tracking-widest pt-1">
                          <span>{isVisible ? item.cardNumber : '•••• •••• •••• ' + (item.cardNumber.slice(-4) || '••••')}</span>
                          <button
                            onClick={() => copyToClipboard(item.cardNumber, 'Card Number')}
                            className="text-slate-400 hover:text-slate-100"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {item.type === 'api' && item.apiKeySecret && (
                      <div className="flex items-center justify-between bg-[#080c14] p-2 rounded-xl border border-slate-800 font-mono">
                        <span className="text-indigo-400 text-xs truncate max-w-[180px]">
                          {isVisible ? item.apiKeySecret : item.apiKeySecret.slice(0, 4) + '••••••••'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.apiKeySecret, 'API Secret')}
                          className="text-slate-400 hover:text-slate-100 p-1"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.notes && item.type !== 'note' && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2 pt-1 font-mono">{item.notes}</p>
                    )}

                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-cyber rounded-2xl overflow-x-auto border border-slate-800 shadow-xl mb-10">
          <table className="w-full text-left text-xs md:text-sm text-slate-300 font-mono">
            <thead className="bg-[#080c14] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Title / Site</th>
                <th className="py-3.5 px-4">Username / Card</th>
                <th className="py-3.5 px-4">Secret Value</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayItems.map((item) => {
                const isVisible = visiblePasswords[item.id];
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">
                          {item.type === 'login' && <IconKey className="w-4 h-4" />}
                          {item.type === 'note' && <IconFileText className="w-4 h-4" />}
                          {item.type === 'card' && <IconCreditCard className="w-4 h-4" />}
                          {item.type === 'wifi' && <IconWifi className="w-4 h-4" />}
                          {item.type === 'api' && <IconCode className="w-4 h-4" />}
                        </span>
                        <div>
                          <div>{item.title}</div>
                          {item.site && (
                            <a
                              href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              {item.site}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.username || item.cardHolder || '—'}
                    </td>
                    <td className="py-3 px-4 text-emerald-400">
                      {item.password ? (
                        <div className="flex items-center gap-2">
                          <span>{isVisible ? item.password : '••••••••'}</span>
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="text-slate-400 hover:text-slate-100"
                          >
                            {isVisible ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(item.password, 'Password')}
                            className="text-slate-400 hover:text-slate-100"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : item.type === 'note' ? (
                        <span className="text-slate-400 truncate max-w-[150px] inline-block">{item.notes}</span>
                      ) : item.type === 'card' ? (
                        <span>{item.cardNumber}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-slate-400 hover:text-cyan-400"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1 text-slate-400 hover:text-red-400"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b101b] border border-red-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <IconTrash className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold font-display-heading text-slate-100 mb-1">Delete Vault Entry?</h4>
            <p className="text-xs font-mono text-slate-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold rounded-xl text-xs shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MANAGER;