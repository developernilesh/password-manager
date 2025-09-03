import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";

interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
  algorithm: string;
  version: string;
}

export class Encryption {
  private algorithm: string;

  constructor() {
    this.algorithm = process.env.ENCRYPTION_ALGORITHM || "AES-256-GCM";
  }

  /**
   * Generate a random initialization vector
   */
  generateIV(length: number = 16): string {
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  encrypt(data: string, key: Buffer, ivHex: string): EncryptedData {
    try {
      const iv = Buffer.from(ivHex, "hex");

      // Narrow Cipheriv to include AES-GCM methods
      const cipher = crypto.createCipheriv(this.algorithm, key, iv) as crypto.CipherGCM;

      cipher.setAAD(Buffer.from("password-manager", "utf8"));

      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");

      const authTag = cipher.getAuthTag();

      return {
        encryptedData: encrypted,
        iv: ivHex,
        authTag: authTag.toString("hex"),
        algorithm: this.algorithm,
        version: "1.0",
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${(error as { message: string }).message}`);
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  decrypt(encryptedData: EncryptedData, key: Buffer): string {
    try {
      const iv = Buffer.from(encryptedData.iv, "hex");

      // Narrow Decipheriv to include AES-GCM methods
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as crypto.DecipherGCM;

      decipher.setAAD(Buffer.from("password-manager", "utf8"));
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

      let decrypted = decipher.update(encryptedData.encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${(error as { message: string }).message}`);
    }
  }
}
