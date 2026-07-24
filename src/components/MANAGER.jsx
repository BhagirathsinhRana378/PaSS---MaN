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
  IconCode
} from './Icons.jsx';

const getPasswordStrength = (pwd) => {
  if (!pwd) return { label: 'None', score: 0, color: 'bg-slate-600', text: 'text-slate-400' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { label: 'Weak', score, color: 'bg-rose-500', text: 'text-rose-400' };
  if (score === 3 || score === 4) return { label: 'Medium', score, color: 'bg-amber-400', text: 'text-amber-400' };
  return { label: 'Strong', score, color: 'bg-emerald-400', text: 'text-emerald-400' };
};

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
  const [decryptedCache, setDecryptedCache] = useState({});
  const [activeType, setActiveType] = useState('login');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [clipboardTimer, setClipboardTimer] = useState(null);

  const searchInputRef = useRef(null);

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
      console.error(e);
    }
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        window.scrollTo({ top: 320, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      toast.success('Updated entry!');
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
    window.scrollTo({ top: 320, behavior: 'smooth' });
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* Editorial Hero Band */}
      <div className="text-center mb-16 py-4">
        <h2 className="text-3xl md:text-5xl font-display font-normal tracking-tight mb-4 vault-heading">
          Production security in <span className="underline underline-offset-8 decoration-[#aa2d00] dark:decoration-rose-400">prototype speed</span>.
        </h2>
        <p className="text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed text-[var(--color-label)]">
          Save passwords, secure text notes, cards, and keys in an editorial workspace anchored on client-side zero-knowledge privacy.
        </p>
      </div>

      {/* Signature Coral Card Banner */}
      <div className="card-signature-coral mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-semibold text-white/80 tracking-wider">Security Architecture</span>
          <h3 className="text-2xl md:text-3xl font-display font-medium text-white mt-1">
            Client-Side AES-256 Vault Protection
          </h3>
          <p className="text-sm text-white/90 mt-2 max-w-xl">
            {masterPassphrase
              ? 'AES-256-GCM Session Key is active. All sensitive fields are encrypted in your browser.'
              : 'Your vault data remains 100% offline in local storage. Click below to enable AES session encryption.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenAudit}
            className="btn-secondary text-xs py-2.5 px-4 bg-white text-[#181d26] dark:bg-slate-900 dark:text-white"
          >
            <IconShieldCheck className="w-4 h-4 text-[#aa2d00] dark:text-emerald-400" /> Run Vault Audit
          </button>

          {!masterPassphrase && onOpenPassphraseModal && (
            <button
              onClick={onOpenPassphraseModal}
              className="btn-secondary text-xs py-2.5 px-4 bg-white text-[#181d26] dark:bg-slate-900 dark:text-white"
            >
              Enable AES Encryption
            </button>
          )}
        </div>
      </div>

      {/* Form Workspace Card */}
      <div className="vault-card p-6 md:p-8 mb-12 shadow-sm transition-colors">
        
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-[var(--color-[#dddddd])]">
          <h3 className="font-display font-medium text-xl vault-heading flex items-center gap-2">
            <IconPlus className="w-5 h-5" />
            <span>{editingId ? 'Edit Vault Entry' : 'Create Vault Entry'}</span>
          </h3>

          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs font-medium px-3 py-1 btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveType('login')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeType === 'login'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Logins / Passwords
          </button>

          <button
            type="button"
            onClick={() => setActiveType('note')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeType === 'note'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Secure Text Note
          </button>

          <button
            type="button"
            onClick={() => setActiveType('card')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeType === 'card'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Payment Card
          </button>

          <button
            type="button"
            onClick={() => setActiveType('wifi')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeType === 'wifi'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Wi-Fi Info
          </button>

          <button
            type="button"
            onClick={() => setActiveType('api')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeType === 'api'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            API Key
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block vault-label mb-1.5">Title / Identifier</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder={
                  activeType === 'login'
                    ? 'e.g. GitHub Account'
                    : activeType === 'note'
                    ? 'e.g. Secret Recovery Code'
                    : activeType === 'card'
                    ? 'e.g. Business Debit Card'
                    : activeType === 'wifi'
                    ? 'e.g. Office Wi-Fi'
                    : 'e.g. Stripe API Key'
                }
                className="w-full vault-input px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block vault-label mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full vault-input px-3 py-2.5 text-sm cursor-pointer"
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
                  <label className="block vault-label mb-1.5">Website URL</label>
                  <input
                    type="text"
                    name="site"
                    value={form.site}
                    onChange={handleInputChange}
                    placeholder="https://github.com"
                    className="w-full vault-input px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block vault-label mb-1.5">Username / Email</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    className="w-full vault-input px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block vault-label">Password (Optional)</label>
                  {form.password && (
                    <span className={`text-xs font-mono font-medium ${strength.text}`}>
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
                    className="flex-1 vault-input px-3.5 py-2.5 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={onOpenGenerator}
                    className="btn-secondary text-xs py-2 px-3 shrink-0"
                  >
                    <IconSparkles className="w-4 h-4 text-cyan-400" /> Generate
                  </button>
                </div>
              </div>
            </>
          )}

          {activeType === 'note' && (
            <div>
              <label className="block vault-label mb-1.5">Secure Text / Note Content</label>
              <textarea
                name="notes"
                rows="5"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Write any custom text, recovery codes, instructions, or private notes..."
                className="w-full vault-input p-3.5 text-sm font-sans leading-relaxed"
              />
            </div>
          )}

          {activeType === 'card' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block vault-label mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={form.cardHolder}
                    onChange={handleInputChange}
                    placeholder="JOHN DOE"
                    className="w-full vault-input px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block vault-label mb-1.5">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4532 •••• •••• 8910"
                    className="w-full vault-input px-3.5 py-2.5 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block vault-label mb-1.5">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="12/28"
                    className="w-full vault-input px-3.5 py-2.5 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block vault-label mb-1.5">CVV Code</label>
                  <input
                    type="password"
                    name="cardCvv"
                    maxLength="4"
                    value={form.cardCvv}
                    onChange={handleInputChange}
                    placeholder="•••"
                    className="w-full vault-input px-3.5 py-2.5 text-sm font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {activeType === 'wifi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block vault-label mb-1.5">Network SSID</label>
                <input
                  type="text"
                  name="site"
                  value={form.site}
                  onChange={handleInputChange}
                  placeholder="Home_WiFi_5G"
                  className="w-full vault-input px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block vault-label mb-1.5">Wi-Fi Password</label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Wi-Fi Password"
                  className="w-full vault-input px-3.5 py-2.5 text-sm font-mono"
                />
              </div>
            </div>
          )}

          {activeType === 'api' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block vault-label mb-1.5">API Key Name</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  placeholder="Stripe Secret Token"
                  className="w-full vault-input px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block vault-label mb-1.5">Secret Key Value</label>
                <input
                  type="text"
                  name="apiKeySecret"
                  value={form.apiKeySecret}
                  onChange={handleInputChange}
                  placeholder="sk_live_51Nx..."
                  className="w-full vault-input px-3.5 py-2.5 text-sm font-mono"
                />
              </div>
            </div>
          )}

          {activeType !== 'note' && (
            <div>
              <label className="block vault-label mb-1.5">Additional Notes</label>
              <textarea
                name="notes"
                rows="2"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Any extra comments..."
                className="w-full vault-input p-3 text-xs"
              />
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveItem}
              className="w-full md:w-auto btn-primary py-2.5 px-6"
            >
              <IconPlus className="w-4 h-4" />
              <span>{editingId ? 'Update Entry' : 'Save Vault Entry'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full md:w-80">
          <IconSearch className="w-4 h-4 text-[var(--color-label)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault (Ctrl+K)..."
            className="w-full vault-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'all'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            All ({passwordArray.length})
          </button>

          <button
            onClick={() => setFilterType('favorites')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'favorites' ? 'bg-[#f4d35e] text-[#181d26]' : 'btn-secondary'
            }`}
          >
            <IconStar className="w-3.5 h-3.5" fill={filterType === 'favorites' ? 'currentColor' : 'none'} /> Favorites
          </button>

          <button
            onClick={() => setFilterType('login')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'login'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Logins
          </button>

          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'note'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Notes
          </button>

          <button
            onClick={() => setFilterType('card')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'card'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Cards
          </button>

          <div className="ml-auto flex items-center bg-[var(--color-card)] border border-[var(--color-[#dddddd])] rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'btn-primary' : 'text-[var(--color-label)]'}`}
              title="Grid View"
            >
              <IconGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'btn-primary' : 'text-[var(--color-label)]'}`}
              title="Table View"
            >
              <IconList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* List Display */}
      {displayItems.length === 0 ? (
        <div className="vault-card p-12 text-center my-6">
          <IconShield className="w-10 h-10 text-[var(--color-label)] mx-auto mb-3" />
          <h3 className="text-lg font-display font-medium text-[var(--color-text)] mb-1">No Entries Found</h3>
          <p className="text-[var(--color-label)] text-xs">
            {searchQuery ? 'No items match search query.' : 'Create your first login, note, or card above!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayItems.map((item) => {
            const isVisible = visiblePasswords[item.id];
            return (
              <div
                key={item.id}
                className="vault-card p-5 shadow-sm flex flex-col justify-between transition-all group animate-fade-in"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-md bg-[var(--color-input)] border border-[var(--color-[#dddddd])] flex items-center justify-center text-[var(--color-text)] shrink-0">
                        {item.type === 'login' && <IconKey className="w-4 h-4" />}
                        {item.type === 'note' && <IconFileText className="w-4 h-4" />}
                        {item.type === 'card' && <IconCreditCard className="w-4 h-4" />}
                        {item.type === 'wifi' && <IconWifi className="w-4 h-4" />}
                        {item.type === 'api' && <IconCode className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <h4 className="font-display font-medium text-[var(--color-text)] text-base truncate">{item.title}</h4>
                        <span className="inline-block px-2 py-0.5 bg-[#f5e9d4] dark:bg-slate-700 text-[#181d26] dark:text-slate-200 text-[10px] font-medium rounded">
                          {item.category || item.type}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="text-[#9297a0] hover:text-[#d9a441] p-1"
                    >
                      <IconStar
                        className={`w-4 h-4 ${item.isFavorite ? 'text-[#d9a441]' : ''}`}
                        fill={item.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-[var(--color-text)] py-2">
                    {item.site && (
                      <div className="flex items-center justify-between bg-[var(--color-input)] p-2 rounded-md border border-[var(--color-[#dddddd])]">
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
                          className="text-[var(--color-label)] hover:text-[var(--color-text)] p-1"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.username && (
                      <div className="flex items-center justify-between bg-[var(--color-input)] p-2 rounded-md border border-[var(--color-[#dddddd])]">
                        <span className="text-[var(--color-text)] truncate">{item.username}</span>
                        <button
                          onClick={() => copyToClipboard(item.username, 'Username')}
                          className="text-[var(--color-label)] hover:text-[var(--color-text)] p-1"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.password && (
                      <div className="flex items-center justify-between bg-[var(--color-input)] p-2 rounded-md border border-[var(--color-[#dddddd])] font-mono">
                        <span className="text-[var(--color-text)]">
                          {isVisible ? item.password : '••••••••••••'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="text-[var(--color-label)] hover:text-[var(--color-text)] p-1"
                          >
                            {isVisible ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(item.password, 'Password')}
                            className="text-[var(--color-label)] hover:text-[var(--color-text)] p-1"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {item.type === 'note' && item.notes && (
                      <div className="bg-[var(--color-input)] p-3 rounded-md border border-[var(--color-[#dddddd])] text-[var(--color-text)] text-xs whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {item.notes}
                      </div>
                    )}

                    {item.type === 'card' && (
                      <div className="space-y-1 bg-[var(--color-input)] p-2.5 rounded-md border border-[var(--color-[#dddddd])] text-xs font-mono">
                        <div className="flex justify-between text-[var(--color-label)]">
                          <span>{item.cardHolder || 'CARD HOLDER'}</span>
                          <span>{item.cardExpiry}</span>
                        </div>
                        <div className="flex justify-between items-center text-[var(--color-text)] font-semibold tracking-wider pt-1">
                          <span>{isVisible ? item.cardNumber : '•••• •••• •••• ' + (item.cardNumber.slice(-4) || '••••')}</span>
                          <button
                            onClick={() => copyToClipboard(item.cardNumber, 'Card Number')}
                            className="text-[var(--color-label)] hover:text-[var(--color-text)]"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {item.type === 'api' && item.apiKeySecret && (
                      <div className="flex items-center justify-between bg-[var(--color-input)] p-2 rounded-md border border-[var(--color-[#dddddd])] font-mono">
                        <span className="text-[var(--color-text)] text-xs truncate max-w-[180px]">
                          {isVisible ? item.apiKeySecret : item.apiKeySecret.slice(0, 4) + '••••••••'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.apiKeySecret, 'API Secret')}
                          className="text-[var(--color-label)] hover:text-[var(--color-text)] p-1"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.notes && item.type !== 'note' && (
                      <p className="text-[11px] text-[var(--color-label)] italic line-clamp-2 pt-1">{item.notes}</p>
                    )}

                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-[#dddddd])] mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 text-[var(--color-label)] hover:text-[var(--color-text)]"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1 text-[var(--color-label)] hover:text-rose-400"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="vault-card overflow-x-auto shadow-sm mb-16">
          <table className="w-full text-left text-xs md:text-sm text-[var(--color-text)]">
            <thead className="bg-[var(--color-input)] text-[var(--color-text)] font-medium border-b border-[var(--color-[#dddddd])]">
              <tr>
                <th className="py-3 px-4">Title / Site</th>
                <th className="py-3 px-4">Username / Card</th>
                <th className="py-3 px-4">Secret Value</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-[#dddddd])]">
              {displayItems.map((item) => {
                const isVisible = visiblePasswords[item.id];
                return (
                  <tr key={item.id} className="hover:bg-[var(--color-input)] transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                      <div className="flex items-center gap-2">
                        <span>
                          {item.type === 'login' && <IconKey className="w-4 h-4 text-[var(--color-text)]" />}
                          {item.type === 'note' && <IconFileText className="w-4 h-4 text-[var(--color-text)]" />}
                          {item.type === 'card' && <IconCreditCard className="w-4 h-4 text-[var(--color-text)]" />}
                          {item.type === 'wifi' && <IconWifi className="w-4 h-4 text-[var(--color-text)]" />}
                          {item.type === 'api' && <IconCode className="w-4 h-4 text-[var(--color-text)]" />}
                        </span>
                        <div>
                          <div>{item.title}</div>
                          {item.site && (
                            <a
                              href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              {item.site}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text)]">
                      {item.username || item.cardHolder || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[var(--color-text)]">
                      {item.password ? (
                        <div className="flex items-center gap-2">
                          <span>{isVisible ? item.password : '••••••••'}</span>
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="text-[var(--color-label)] hover:text-[var(--color-text)]"
                          >
                            {isVisible ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(item.password, 'Password')}
                            className="text-[var(--color-label)] hover:text-[var(--color-text)]"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : item.type === 'note' ? (
                        <span className="text-[var(--color-label)] truncate max-w-[150px] inline-block">{item.notes}</span>
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
                          className="p-1 text-[var(--color-label)] hover:text-[var(--color-text)]"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1 text-[var(--color-label)] hover:text-rose-400"
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

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="vault-card rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
            <IconTrash className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h4 className="text-lg font-display font-medium text-[var(--color-text)] mb-1">Delete Vault Entry?</h4>
            <p className="text-xs text-[var(--color-label)] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 btn-secondary justify-center py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-xs py-2 shadow-md transition-colors"
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