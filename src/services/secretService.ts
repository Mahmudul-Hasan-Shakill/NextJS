// services/encryptionService.ts
import CryptoJS from "crypto-js";

const secret = process.env.NEXT_PUBLIC_SECRET_KEY;

export const encrypt = (text: string): string => {
  const key = CryptoJS.enc.Utf8.parse(secret as string);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.ciphertext.toString(
    CryptoJS.enc.Hex
  )}`;
};

export const decrypt = (encrypted: string): string => {
  const [ivHex, encryptedHex] = encrypted.split(":");
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const encryptedData = CryptoJS.enc.Hex.parse(encryptedHex);
  const key = CryptoJS.enc.Utf8.parse(secret as string);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedData } as any,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
};
