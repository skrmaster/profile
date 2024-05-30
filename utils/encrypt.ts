import CryptoJS from 'crypto-js';

const encryptionKey = import.meta.env.VITE_PROJECT_ENCRYPTIONKEY;

export function aesDecrypt(encryptedText: string): string {
  // Decode the Base64 string to bytes
  const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);
    
  // Extract the IV (first 16 bytes, which is 4 words of 4 bytes each)
  const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4), 16);
  
  // Extract the actual encrypted data (remaining bytes)
  const encryptedData = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(4), encryptedBytes.sigBytes - 16);
  
  // Convert the key to the appropriate format
  const keyBytes = CryptoJS.enc.Utf8.parse(encryptionKey);

  // Create CipherParams object
  const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedData,
      iv: iv,
      key: keyBytes
  });

  // Perform the decryption
  const decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

  // Convert the decrypted data back to a string
  const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);

  return decryptedText;
}
