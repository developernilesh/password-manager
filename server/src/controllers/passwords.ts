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

    const encryptionKey = Buffer.from('placeholder-key-32-bytes-long', 'utf8');

    // Encrypt sensitive data
    const iv = encryption.generateIV();
    const encryptedTitle = encryption.encrypt(title, encryptionKey, iv);
    const encryptedUsername = encryption.encrypt(username, encryptionKey, iv);
    const encryptedPassword = encryption.encrypt(password, encryptionKey, iv);
    const encryptedWebsite = url ? encryption.encrypt(url, encryptionKey, iv) : null;

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

    const newPassword = await PasswordsModel.create({
      userid,
      title,
      url,
      username,
      password,
      category,
    });

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Cannot add password at moment. Please try again!",
      });
    }

    res.status(400).json({
      success: true,
      message: "Password created successfully!",
      newPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Something went wrong: ${
        (error as { message: string }).message
      }`,
    });
  }
};
