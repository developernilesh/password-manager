import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import { PasswordsModel } from "../models/passwords.js";
import { Encryption } from "../utils/encryption.js";

const encryption = new Encryption();

export const addPassword = async (req: Request, res: Response) => {
  try {
    const {
      userid,
      title,
      url,
      username,
      category,
      encryptedData,
      encryptionParams,
    } = req.body;

    if (
      !userid ||
      !title ||
      !url ||
      !username ||
      !category ||
      !encryptedData ||
      !encryptionParams
    ) {
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

    const newPassword = await PasswordsModel.create({
      userid,
      title,
      url,
      username,
      encryptedData,
      category,
      encryptionParams,
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

    res.status(200).json({
      success: true,
      message: "Passwords fetched successfully",
      data: passwords,
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
