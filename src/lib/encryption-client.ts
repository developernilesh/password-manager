// lib/encryption-client-crypto-js.ts
import CryptoJS from 'crypto-js';

export const encryptDataWithCryptoJS = (data: string, masterPassword: string): {
  encryptedData: string;
  iv: string;
  salt: string;
  hmac: string;
} => {
  // Generate a random salt
  const salt = CryptoJS.lib.WordArray.random(128/8).toString();
  
  // Derive key using PBKDF2
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 100000
  });
  
  // Generate a random IV
  const iv = CryptoJS.lib.WordArray.random(128/8).toString();
  
  // Encrypt the data using AES-CBC
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Calculate HMAC for authentication
  const hmac = CryptoJS.HmacSHA256(encrypted.toString(), key).toString();
  
  return {
    encryptedData: encrypted.toString(),
    iv: iv,
    salt: salt,
    hmac: hmac,
  };
};

export const decryptDataWithCryptoJS = (
  encryptedData: string, 
  iv: string, 
  salt: string,  
  hmac: string,
  masterPassword: string
): string => {
  // Derive key using PBKDF2
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 100000
  });
  
  // Verify HMAC first to ensure data integrity
  const calculatedHmac = CryptoJS.HmacSHA256(encryptedData, key).toString();
  if (calculatedHmac !== hmac) {
    throw new Error('HMAC verification failed - data may have been tampered with');
  }
  
  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
};