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
    password: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    encryption: {
      algorithm: {
        type: String,
        required: true,
        default: "AES-256-GCM",
        enum: ["AES-256-GCM"],
      },
      iv: {
        type: String,
        required: true,
        length: 32, // 16 bytes as hex
      },
      authTag: {
        type: String,
        required: true,
        length: 32, // 16 bytes as hex
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

export const PasswordsModel = model("Passwords", passwordSchema);
