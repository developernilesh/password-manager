import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import {
  addPassword,
  deletePassword,
  editPasswords,
  getPasswords,
} from "./controllers/passwords.js";
import {
  addCreditCard,
  deleteCreditCard,
  editCreditCard,
  getCreditCards,
} from "./controllers/credit-cards.js";
import { handleMasterPasswordChange } from "./controllers/master-pasword.js";

const app = express();
connectDB();

app.use(express.json());

// Used env variable safely (added a fallback to avoid "undefined")
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));

// passwords route
app.post("/api/v1/add-password", addPassword);
app.put("/api/v1/update-password/:passwordId", editPasswords);
app.delete("/api/v1/delete-password/:passwordId", deletePassword);
app.get("/api/v1/view-passwords/:userid", getPasswords);

// credit card routes
app.post("/api/v1/add-credit-card", addCreditCard);
app.put("/api/v1/update-credit-card/:cardId", editCreditCard);
app.delete("/api/v1/delete-credit-card/:cardId", deleteCreditCard);
app.get("/api/v1/view-credit-cards/:userid", getCreditCards);

// master password change route
app.post("/api/v1/change-master-password", handleMasterPasswordChange);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at Port No: ${process.env.PORT}`);
});
