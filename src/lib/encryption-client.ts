// lib/encryption-client-crypto-js.ts
import CryptoJS from 'crypto-js';

export const encryptDataWithCryptoJS = (data: string, masterPassword: string): {
  encryptedData: string;
  iv: string;
  salt: string;
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
  
  return {
    encryptedData: encrypted.toString(),
    iv: iv,
    salt: salt
  };
};

export const decryptDataWithCryptoJS = (
  encryptedData: string, 
  iv: string, 
  salt: string, 
  masterPassword: string
): string => {
  // Derive key using PBKDF2
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 100000
  });
  
  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
};