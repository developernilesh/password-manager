import { model, Schema } from "mongoose";

const creditCardSchema = new Schema(
  {
    userid: String,
    cardName: String,
    bank: String,
    category: String,
    cardholderName: String,
    expiry: String,
    cardNumber: String,
    cvv: String,
  },
  { timestamps: true }
);

export const CreditCardsModel = model("CreditCards", creditCardSchema)