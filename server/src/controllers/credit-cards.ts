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

export const editCreditCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

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
      !cardId ||
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
        message: "Cannot update card info at moment. Please try again!",
      });
    }

    const cardToEdit = await CreditCardsModel.findById(cardId);

    if (!cardToEdit) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch data. Please try again!",
      });
    }

    if (cardToEdit.userid !== userid) {
      return res.status(400).json({
        success: false,
        message: "You are not authenticated to update this card!",
      });
    }

    cardToEdit.cardName = cardName;
    cardToEdit.bank = bank;
    cardToEdit.cardholderName = cardholderName;
    cardToEdit.category = category;
    cardToEdit.expiry = expiry;
    cardToEdit.encryptedCardNumber = encryptedCardNumber;
    cardToEdit.cardNoEncryptionParams = cardNoEncryptionParams;
    cardToEdit.encryptedCvv = encryptedCvv;
    cardToEdit.cvvEncryptionParams = cvvEncryptionParams;

    const updatedCardInfo = await cardToEdit.save();

    if (!updatedCardInfo) {
      return res.status(400).json({
        success: false,
        message: "Cannot update card info at moment. Please try again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Card info updated successfully!",
      updatedCardInfo,
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

export const deleteCreditCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    const { userid } = req.body;

    if (!cardId || !userid) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete card at moment. Please try again!",
      });
    }

    const cardToDelete = await CreditCardsModel.findById(cardId);

    if (!cardToDelete) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch data. Please try again!",
      });
    }

    if (cardToDelete.userid !== userid) {
      return res.status(400).json({
        success: false,
        message: "You are not authenticated to update this card!",
      });
    }

    const cardsAfterDeleteion = await CreditCardsModel.findByIdAndDelete(
      cardId
    );

    if (!cardsAfterDeleteion) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete card at moment. Please try again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Card deleted successfully!",
      cardsAfterDeleteion,
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
