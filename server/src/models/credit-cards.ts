import { model, Schema } from "mongoose";

const creditCardSchema = new Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    cardName: {
      type: String,
      required: true,
      trim: true,
    },
    bank: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    cardholderName: {
      type: String,
      required: true,
      trim: true,
    },
    expiry: {
      type: String,
      required: true,
    },
    encryptedCardNumber: {
      type: String,
      required: true,
    },
    cardNoEncryptionParams: {
      iv: {
        type: String,
        required: true,
      },
      salt: {
        type: String,
        required: true,
      },
      hmac: {
        type: String,
        required: true,
      },
      algorithm: {
        type: String,
        required: true,
        default: "AES-256-CBC",
      },
      version: {
        type: String,
        required: true,
        default: "1.0",
      },
    },
    encryptedCvv: {
      type: String,
      required: true,
    },
    cvvEncryptionParams: {
      iv: {
        type: String,
        required: true,
      },
      salt: {
        type: String,
        required: true,
      },
      hmac: {
        type: String,
        required: true,
      },
      algorithm: {
        type: String,
        required: true,
        default: "AES-256-CBC",
      },
      version: {
        type: String,
        required: true,
        default: "1.0",
      },
    },
  },
  { timestamps: true }
);

export const CreditCardsModel = model("CreditCards", creditCardSchema);
