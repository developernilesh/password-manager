import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import { CreditCardsModel } from "../models/credit-cards.js";

export const addCreditCard = async (req: Request, res: Response) => {
  try {
    const {
      userid,
      cardName,
      bank,
      category,
      cardholderName,
      expiry,
      encryptedCardNumber,
      cardNoEncryptionParams,
      encryptedCvv,
      cvvEncryptionParams,
    } = req.body;

    if (
      !userid ||
      !cardName ||
      !bank ||
      !category ||
      !cardholderName ||
      !expiry ||
      !encryptedCardNumber ||
      !cardNoEncryptionParams ||
      !encryptedCvv ||
      !cvvEncryptionParams
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot add card info at moment. Please try again!",
      });
    }

    const newCard = await CreditCardsModel.create({
      userid,
      cardName,
      bank,
      category,
      cardholderName,
      expiry,
      encryptedCardNumber,
      cardNoEncryptionParams,
      encryptedCvv,
      cvvEncryptionParams,
    });

    if (!newCard) {
      return res.status(400).json({
        success: false,
        message: "Cannot add card info at moment. Please try again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Card added successfully!",
      newCard,
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

export const getCreditCards = async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: "Cannot fetch credit cards info at moment. Please try again!",
      });
    }

    const cards = await CreditCardsModel.find({ userid });

    if (!cards) {
      return res.status(400).json({
        success: false,
        message: "Cannot fetch credit cards info at moment. Please try again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "cards fetched successfully",
      data: cards,
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
