// src/models/passwords.ts
import { model, Schema } from "mongoose";

const passwordSchema = new Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    // This will now store the client-side encrypted data
    encryptedData: {
      type: String,
      required: true,
    },
    encryptionParams: {
      iv: {
        type: String,
        required: true,
      },
      authTag: {
        type: String,
        required: true,
      },
      salt: {
        type: String,
        required: true,
      },
      algorithm: {
        type: String,
        required: true,
        default: "AES-256-GCM",
      },
      version: {
        type: String,
        required: true,
        default: "1.0",
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const PasswordsModel = model("Passwords", passwordSchema);