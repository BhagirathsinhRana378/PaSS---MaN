import React, { useState, useEffect, useMemo } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
  IconKey,
  IconFileText,
  IconCreditCard,
  IconWifi,
  IconShield,
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

// Function to calculate basic password strength
const getPasswordStrength = (pwd) => {
  if (!pwd) return { label: 'Empty', score: 0, color: 'bg-slate-700' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { label: 'Weak', score, color: 'bg-red-500', textColor: 'text-red-400' };
  if (score === 3 || score === 4) return { label: 'Medium', score, color: 'bg-yellow-500', textColor: 'text-yellow-400' };
  return { label: 'Strong', score, color: 'bg-emerald-500', textColor: 'text-emerald-400' };
};

// Data normalization helper for 100% backward compatibility
const normalizeVaultItem = (item) => {
  return {
    id: item.id || uuidv4(),
    type: item.type || 'login', // 'login', 'note', 'card', 'wifi', 'api'
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

const MANAGER = ({ onOpenGenerator, generatorAppliedPassword, clearAppliedPassword }) => {
  const [passwordArray, setPasswordArray] = useState([]);
  const [activeType, setActiveType] = useState('login'); // Form item type
  const [filterType, setFilterType] = useState('all'); // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

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

  // Load items on mount and normalize backward compatible entries
  useEffect(() => {
    try {
      const stored = localStorage.getItem('passwords');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(normalizeVaultItem);
          setPasswordArray(normalized);
        }
      }
    } catch (e) {
      console.error('Error loading vault passwords from localStorage:', e);
    }
  }, []);

  // Sync applied password from external generator modal if user clicked "Use This Password"
  useEffect(() => {
    if (generatorAppliedPassword) {
      setForm((prev) => ({ ...prev, password: generatorAppliedPassword, apiKeySecret: generatorAppliedPassword }));
      if (clearAppliedPassword) clearAppliedPassword();
    }
  }, [generatorAppliedPassword, clearAppliedPassword]);

  // Save to localStorage helper
  const saveToLocalStorage = (items) => {
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

  const handleSaveItem = () => {
    // Non-compulsory validation: At least title, site, notes, or username must be provided
    const hasAnyContent =
      form.title.trim() ||
      form.site.trim() ||
      form.username.trim() ||
      form.password.trim() ||
      form.notes.trim() ||
      form.cardNumber.trim();

    if (!hasAnyContent) {
      toast.error('Please enter a Title, Note, or Site name before saving.');
      return;
    }

    // Determine fallback title
    const computedTitle =
      form.title.trim() ||
      form.site.trim() ||
      (activeType === 'note' ? 'Untitled Note' : activeType === 'card' ? 'Payment Card' : 'Untitled Vault Item');

    const newItem = normalizeVaultItem({
      ...form,
      title: computedTitle,
      type: activeType,
      id: editingId || uuidv4()
    });

    let updatedList;
    if (editingId) {
      updatedList = passwordArray.map((item) => (item.id === editingId ? newItem : item));
      toast.success('Updated vault entry!');
    } else {
      updatedList = [newItem, ...passwordArray];
      toast.success('Saved new vault entry!');
    }

    saveToLocalStorage(updatedList);
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setActiveType(item.type || 'login');
    setForm({
      title: item.title || item.site || '',
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
      category: item.category || 'General'
    });
    // Scroll smoothly up to form
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDeleteConfirmed = () => {
    if (!deleteConfirmId) return;
    const updated = passwordArray.filter((item) => item.id !== deleteConfirmId);
    saveToLocalStorage(updated);
    toast.info('Item deleted from vault.');
    setDeleteConfirmId(null);
  };

  const toggleFavorite = (id) => {
    const updated = passwordArray.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveToLocalStorage(updated);
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, label = 'Content') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  // Filtered & Searched List
  const filteredItems = useMemo(() => {
    return passwordArray.filter((item) => {
      // Filter by Type
      if (filterType === 'favorites' && !item.isFavorite) return false;
      if (filterType !== 'all' && filterType !== 'favorites' && item.type !== filterType) return false;

      // Filter by Search Query
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
  }, [passwordArray, filterType, searchQuery]);

  const strength = getPasswordStrength(form.password);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Hero Branding Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-2">
          Your Secure Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">Vault</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          Save logins, secure text notes, credit cards, Wi-Fi keys, and API secrets safely on your device.
        </p>
      </div>

      {/* Input / Add New Card Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-5 md:p-6 mb-8 backdrop-blur-sm">
        
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-emerald-400" />
            <span>{editingId ? 'Edit Vault Entry' : 'Add New Entry'}</span>
          </h3>

          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeType === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <IconKey className="w-4 h-4" /> Password / Login
          </button>

          <button
            type="button"
            onClick={() => setActiveType('note')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeType === 'note'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <IconFileText className="w-4 h-4" /> Secure Text / Note
          </button>

          <button
            type="button"
            onClick={() => setActiveType('card')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeType === 'card'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <IconCreditCard className="w-4 h-4" /> Payment Card
          </button>

          <button
            type="button"
            onClick={() => setActiveType('wifi')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeType === 'wifi'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <IconWifi className="w-4 h-4" /> Wi-Fi Info
          </button>

          <button
            type="button"
            onClick={() => setActiveType('api')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeType === 'api'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <IconCode className="w-4 h-4" /> API Key
          </button>
        </div>

        {/* Dynamic Form Inputs */}
        <div className="space-y-4">
          
          {/* Universal Title & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Title / Name <span className="text-slate-500 font-normal">(Optional identifier)</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder={
                  activeType === 'login'
                    ? 'e.g. GitHub / Personal Email'
                    : activeType === 'note'
                    ? 'e.g. Secret Recovery Words'
                    : activeType === 'card'
                    ? 'e.g. HDFC Bank Credit Card'
                    : activeType === 'wifi'
                    ? 'e.g. Home Wi-Fi 5G'
                    : 'e.g. OpenAI Secret Key'
                }
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Finance">Finance</option>
                <option value="Social">Social</option>
              </select>
            </div>
          </div>

          {/* Type Specific Fields */}
          {activeType === 'login' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL / App</label>
                  <input
                    type="text"
                    name="site"
                    value={form.site}
                    onChange={handleInputChange}
                    placeholder="https://github.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Email</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  {form.password && (
                    <span className={`text-xs font-semibold ${strength.textColor}`}>
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
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={onOpenGenerator}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                    title="Generate Password"
                  >
                    <IconSparkles className="w-4 h-4" /> Generate
                  </button>
                </div>
                {form.password && (
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                  </div>
                )}
              </div>
            </>
          )}

          {activeType === 'note' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Secure Note / Text Content</label>
              <textarea
                name="notes"
                rows="4"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Write whatever text, notes, backup codes, or details you want to save..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none leading-relaxed"
              />
            </div>
          )}

          {activeType === 'card' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={form.cardHolder}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4532 •••• •••• 8910"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="12/28"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    name="cardCvv"
                    maxLength="4"
                    value={form.cardCvv}
                    onChange={handleInputChange}
                    placeholder="•••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {activeType === 'wifi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Network Name (SSID)</label>
                <input
                  type="text"
                  name="site"
                  value={form.site}
                  onChange={handleInputChange}
                  placeholder="MyHomeWiFi_5G"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wi-Fi Password</label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Wi-Fi Password"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 outline-none"
                />
              </div>
            </div>
          )}

          {activeType === 'api' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">API Key / Token Name</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  placeholder="e.g. Stripe Publishable Key"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secret Key Value</label>
                <input
                  type="text"
                  name="apiKeySecret"
                  value={form.apiKeySecret}
                  onChange={handleInputChange}
                  placeholder="sk_live_51Nx..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* Notes field for all except Note type */}
          {activeType !== 'note' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Notes <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea
                name="notes"
                rows="2"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Any extra comments, security questions, or notes..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 outline-none"
              />
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveItem}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 text-base transition-all flex items-center justify-center gap-2"
            >
              <IconPlus className="w-5 h-5 stroke-[3]" />
              <span>{editingId ? 'Update Entry' : 'Save Entry'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Controls Bar: Search, Category Filters, View Switcher */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'all' ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All ({passwordArray.length})
          </button>
          <button
            onClick={() => setFilterType('favorites')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'favorites' ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <IconStar className="w-3.5 h-3.5" fill={filterType === 'favorites' ? 'currentColor' : 'none'} /> Favorites
          </button>
          <button
            onClick={() => setFilterType('login')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'login' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Logins
          </button>
          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'note' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setFilterType('card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'card' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Cards
          </button>

          {/* View Toggle */}
          <div className="ml-auto flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-white'}`}
              title="Grid View"
            >
              <IconGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-white'}`}
              title="Table View"
            >
              <IconList className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Vault Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center my-6">
          <IconShield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-300 mb-1">No Vault Items Found</h3>
          <p className="text-slate-500 text-sm">
            {searchQuery ? 'No entries match your search query.' : 'Add your first login, secure note, or card above!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredItems.map((item) => {
            const isVisible = visiblePasswords[item.id];
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Header row */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                        {item.type === 'login' && <IconKey className="w-5 h-5" />}
                        {item.type === 'note' && <IconFileText className="w-5 h-5" />}
                        {item.type === 'card' && <IconCreditCard className="w-5 h-5" />}
                        {item.type === 'wifi' && <IconWifi className="w-5 h-5" />}
                        {item.type === 'api' && <IconCode className="w-5 h-5" />}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-100 text-base truncate">{item.title}</h4>
                        <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] uppercase font-semibold rounded-md">
                          {item.category || item.type}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="text-slate-500 hover:text-amber-400 p-1 transition-colors"
                      title="Favorite"
                    >
                      <IconStar
                        className={`w-5 h-5 ${item.isFavorite ? 'text-amber-400' : ''}`}
                        fill={item.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2.5 text-xs text-slate-300 py-2">
                    
                    {item.site && (
                      <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        <a
                          href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[200px]"
                        >
                          {item.site} <IconExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(item.site, 'URL')}
                          className="text-slate-400 hover:text-white p-1"
                          title="Copy URL"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.username && (
                      <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        <span className="font-mono text-slate-200 truncate">{item.username}</span>
                        <button
                          onClick={() => copyToClipboard(item.username, 'Username')}
                          className="text-slate-400 hover:text-white p-1"
                          title="Copy Username"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.password && (
                      <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        <span className="font-mono text-emerald-400 tracking-wider">
                          {isVisible ? item.password : '••••••••••••'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="text-slate-400 hover:text-white p-1"
                          >
                            {isVisible ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(item.password, 'Password')}
                            className="text-slate-400 hover:text-white p-1"
                            title="Copy Password"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {item.type === 'note' && item.notes && (
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-200 text-xs whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {item.notes}
                      </div>
                    )}

                    {item.type === 'card' && (
                      <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 font-mono text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>{item.cardHolder || 'CARD HOLDER'}</span>
                          <span>{item.cardExpiry}</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-400 font-bold tracking-widest pt-1">
                          <span>{isVisible ? item.cardNumber : '•••• •••• •••• ' + (item.cardNumber.slice(-4) || '••••')}</span>
                          <button
                            onClick={() => copyToClipboard(item.cardNumber, 'Card Number')}
                            className="text-slate-400 hover:text-white"
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {item.type === 'api' && item.apiKeySecret && (
                      <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        <span className="font-mono text-indigo-400 text-xs truncate max-w-[180px]">
                          {isVisible ? item.apiKeySecret : item.apiKeySecret.slice(0, 4) + '••••••••'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.apiKeySecret, 'API Secret')}
                          className="text-slate-400 hover:text-white p-1"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {item.notes && item.type !== 'note' && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2 pt-1">{item.notes}</p>
                    )}

                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80 mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Edit Entry"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete Entry"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl mb-10">
          <table className="w-full text-left text-xs md:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Title / Site</th>
                <th className="py-3.5 px-4">Username / Card</th>
                <th className="py-3.5 px-4">Password / Value</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.map((item) => {
                const isVisible = visiblePasswords[item.id];
                return (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">
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
                              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              {item.site}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.username || item.cardHolder || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      {item.password ? (
                        <div className="flex items-center gap-2">
                          <span>{isVisible ? item.password : '••••••••'}</span>
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isVisible ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(item.password, 'Password')}
                            className="text-slate-400 hover:text-white"
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
                          className="p-1 text-slate-400 hover:text-emerald-400"
                          title="Edit"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1 text-slate-400 hover:text-red-400"
                          title="Delete"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <IconTrash className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-100 mb-1">Delete Vault Entry?</h4>
            <p className="text-xs text-slate-400 mb-5">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MANAGER;