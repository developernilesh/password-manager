import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import { PasswordsModel } from "../models/passwords.js";
import { Encryption } from "../utils/encryption.js";

const encryption = new Encryption();

export const addPassword = async (req: Request, res: Response) => {
  try {
    const { userid, title, url, username, password, category } = req.body;

    if (!userid || !title || !url || !username || !password || !category) {
      return res.status(400).json({
        success: false,
        message: "Cannot add password at moment. Please try again!",
      });
    }

    const isExisting = await PasswordsModel.findOne({
      userid,
      url,
      username,
    });

    if (isExisting) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry can't be created!",
      });
    }

    const encryptionKey = Buffer.from(
      process.env.ENCRYPTION_KEY as string,
      "utf8"
    );

    // Encrypt sensitive data
    const iv = encryption.generateIV();
    const encryptedPassword = encryption.encrypt(password, encryptionKey, iv);

    if (!encryptedPassword?.encryptedData || !encryptedPassword?.authTag) {
      return res.status(400).json({
        success: false,
        message: "Cannot generate encrypted password. Please try again!",
      });
    }

    const newPassword = await PasswordsModel.create({
      userid,
      title,
      url,
      username,
      password: encryptedPassword.encryptedData,
      category,
      encryption: {
        algorithm: "AES-256-GCM",
        iv: iv,
        authTag: encryptedPassword.authTag,
        version: "1.0",
      },
    });

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Cannot add password at moment. Please try again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password created successfully!",
      newPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong: ${
        (error as { message: string }).message
      }`,
    });
  }
};

export const getPasswords = async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: "Cannot fetch passwords at moment. Please try again!",
      });
    }

    const passwords = await PasswordsModel.find({ userid });

    if (!passwords) {
      return res.status(400).json({
        success: false,
        message: "Cannot fetch passwords at moment. Please try again!",
      });
    }

    const encryptionKey = Buffer.from(
      process.env.ENCRYPTION_KEY as string,
      "utf8"
    );

    const decryptedPasswords = passwords.map((entry: any) => {
      try {
        // Build the encryptedData object expected by Encryption.decrypt
        const encryptedData = {
          encryptedData: entry.password,
          iv: entry.encryption.iv,
          authTag: entry.encryption.authTag,
          algorithm: entry.encryption.algorithm || "AES-256-GCM",
          version: entry.encryption.version || "1.0",
        };
        const decryptedPassword = encryption.decrypt(
          encryptedData,
          encryptionKey
        );
        return {
          ...entry.toObject(),
          password: decryptedPassword,
        };
      } catch (err) {
        return {
          ...entry.toObject(),
          password: null,
        };
      }
    });

    res.status(200).json({
      success: true,
      data: decryptedPasswords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong: ${
        (error as { message: string }).message
      }`,
    });
  }
};
