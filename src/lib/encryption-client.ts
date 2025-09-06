import crypto from "crypto";

// Derive a key from the master password using PBKDF2
export const deriveKeyFromPassword = (
  password: string,
  salt: string
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  return crypto.subtle
    .importKey("raw", passwordBuffer, "PBKDF2", false, ["deriveKey"])
    .then((key) => {
      return crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: saltBuffer,
          iterations: 100000,
          hash: "SHA-256",
        },
        key,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    });
};

// Encrypt data using the derived key
export const encryptData = async (
  data: string,
  masterPassword: string
): Promise<{
  encryptedData: string;
  iv: string;
  salt: string;
  authTag: string;
}> => {
  const salt = crypto.randomBytes(16).toString("hex");
  const iv = crypto.randomBytes(12); // 96 bits for GCM
  const key = await deriveKeyFromPassword(masterPassword, salt);

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    dataBuffer
  );

  // Extract auth tag from the end of the encrypted data
  const authTag = new Uint8Array(encryptedBuffer.slice(-16));

  return {
    encryptedData: Array.from(new Uint8Array(encryptedBuffer.slice(0, -16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    iv: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    salt,
    authTag: Array.from(authTag)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  };
};

// Decrypt data using the derived key
export const decryptData = async (
  encryptedData: string,
  iv: string,
  authTag: string,
  salt: string,
  masterPassword: string
): Promise<string> => {
  const key = await deriveKeyFromPassword(masterPassword, salt);

  const encryptedBuffer = new Uint8Array([
    ...new Uint8Array(
      encryptedData.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    ),
    ...new Uint8Array(
      authTag.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    ),
  ]);

  const ivBuffer = new Uint8Array(
    iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    key,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
};
