import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import { PasswordsModel } from "../models/passwords.js";

export const addPassword = async (req: Request, res: Response) => {
  try {
    const { userid, title, url, username, password, category } = req.body;

    if (!userid || !title || !url || !username || !password || !category) {
      return res.status(400).json({
        success: false,
        message: "Cannot add password at moment. Please try again!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isExisting = await PasswordsModel.findOne({
      userid,
      url,
      username,
      password:hashedPassword,
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
      password: hashedPassword,
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
