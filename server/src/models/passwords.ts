import { model, Schema } from "mongoose";

const passwordSchema = new Schema(
  {
    userid: String,
    title: String,
    url: String,
    username: String,
    password: String,
    category: String,
  },
  { timestamps: true }
);

export const PasswordsModel = model("Passwords", passwordSchema)