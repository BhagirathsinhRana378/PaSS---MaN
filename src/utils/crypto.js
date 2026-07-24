/**
 * Web Crypto API Utility for Passman
 * Implements client-side AES-256-GCM encryption with PBKDF2 key derivation (100,000 iterations).
 * Zero-knowledge: Plaintext data is encrypted in the browser before being written to localStorage.
 */

// Helper to convert string to Uint8Array
const enc = new TextEncoder();
const dec = new TextDecoder();

// Derive a CryptoKey from a user passphrase using PBKDF2
export async function deriveKey(passphrase, saltUint8) {
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),

    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltUint8,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt plaintext string using derived key
export async function encryptText(plaintext, passphrase) {
  if (!plaintext) return '';
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plaintext)
    );

    // Combine salt, iv, and ciphertext into base64 payload
    const payload = {
      s: Array.from(salt),
      iv: Array.from(iv),
      ct: Array.from(new Uint8Array(ciphertextBuffer))
    };

    return 'ENC:' + btoa(JSON.stringify(payload));
  } catch (err) {
    console.error('Encryption error:', err);
    throw err;
  }
}

// Decrypt ciphertext payload using passphrase
export async function decryptText(encryptedPayload, passphrase) {
  if (!encryptedPayload) return '';
  if (!encryptedPayload.startsWith('ENC:')) return encryptedPayload; // Return unencrypted legacy data as-is

  try {
    const jsonStr = atob(encryptedPayload.slice(4));
    const { s, iv, ct } = JSON.parse(jsonStr);

    const saltUint8 = new Uint8Array(s);
    const ivUint8 = new Uint8Array(iv);
    const ctUint8 = new Uint8Array(ct);

    const key = await deriveKey(passphrase, saltUint8);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivUint8 },
      key,
      ctUint8
    );

    return dec.decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption error (incorrect key or corrupted data):', err);
    return '🔒 [Decryption Failed]';
  }
}

// Check if string is encrypted
export function isEncrypted(val) {
  return typeof val === 'string' && val.startsWith('ENC:');
}
