import type { Request, Response } from "express";
import { PasswordsModel } from "../models/passwords.js";
import { CreditCardsModel } from "../models/credit-cards.js";

export const handleMasterPasswordChange = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, updatedPasswords, updatedCards } = req.body;

    if (!userId || !updatedPasswords || !updatedCards) {
      return res.status(400).json({
        success: false,
        message: "Coudn't update passwords and credit cards",
      });
    }

    // Update each password in the database
    const updateOperationsForPassword = updatedPasswords.map((pwd: any) =>
      PasswordsModel.findByIdAndUpdate(pwd._id, {
        encryptedData: pwd.encryptedData,
        encryptionParams: pwd.encryptionParams,
      })
    );
    const updateOperationsForCreditCard = updatedCards.map((card: any) =>
      CreditCardsModel.findByIdAndUpdate(card._id, {
        encryptedCardNumber: card.encryptedCardNumber,
        cardNoEncryptionParams: card.cardNoEncryptionParams,
        encryptedCvv: card.encryptedCvv,
        cvvEncryptionParams: card.cvvEncryptionParams,
      })
    );

    await Promise.all(updateOperationsForPassword);
    await Promise.all(updateOperationsForCreditCard);

    res.status(200).json({
      success: true,
      message: "Master password updated successfully",
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
