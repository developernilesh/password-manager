import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import { PasswordsModel } from "../models/passwords.js";

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

    // const isExisting = await PasswordsModel.findOne({
    //   userid,
    //   url,
    //   username,
    // });

    // if (isExisting) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Duplicate entry can't be created!",
    //   });
    // }

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

export const editPasswords = async (req: Request, res: Response) => {
  try {
    const { passwordId } = req.params;

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
      !passwordId ||
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
        message: "Cannot update password at moment. Please try again!",
      });
    }

    const passwordToEdit = await PasswordsModel.findById(passwordId);

    if (!passwordToEdit) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch data. Please try again!",
      });
    }

    if (passwordToEdit.userid !== userid) {
      return res.status(400).json({
        success: false,
        message: "You are not authenticated to update this password!",
      });
    }

    passwordToEdit.title = title;
    passwordToEdit.url = url;
    passwordToEdit.username = username;
    passwordToEdit.category = category;
    passwordToEdit.encryptedData = encryptedData;
    passwordToEdit.encryptionParams = encryptionParams;

    const updatedPassword = await passwordToEdit.save();

    if (!updatedPassword) {
      return res.status(400).json({
        success: false,
        message: "Cannot update password at moment. Please try again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
      updatedPassword,
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

export const deletePassword = async (req: Request, res: Response) => {
  try {
    const { passwordId } = req.params;

    const { userid } = req.body;

    if (!passwordId || !userid) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete password at moment. Please try again!",
      });
    }

    const passwordToDelete = await PasswordsModel.findById(passwordId);

    if (!passwordToDelete) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch data. Please try again!",
      });
    }

    if (passwordToDelete.userid !== userid) {
      return res.status(400).json({
        success: false,
        message: "You are not authenticated to update this password!",
      });
    }

    const passwordsAfterDeleteion = await PasswordsModel.findByIdAndDelete(
      passwordId
    );

    if (!passwordsAfterDeleteion) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete password at moment. Please try again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password deleted successfully!",
      passwordsAfterDeleteion,
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

export const updateAllPasswords = async (req: Request, res: Response) => {
  try {
    const { userId, updatedPasswords } = req.body;

    if (!userId || !updatedPasswords) {
      return res.status(400).json({
        success: false,
        message: "User ID and updated passwords are required",
      });
    }

    // Update each password in the database
    const updateOperations = updatedPasswords.map((pwd: any) =>
      PasswordsModel.findByIdAndUpdate(pwd._id, {
        encryptedData: pwd.encryptedData,
        encryptionParams: pwd.encryptionParams,
      })
    );

    await Promise.all(updateOperations);

    res.status(200).json({
      success: true,
      message: "Passwords updated successfully",
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
