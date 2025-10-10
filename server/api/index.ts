import express from "express";
import cors from "cors";
import connectDB from "../dist/config/database.js";
import {
  addPassword,
  deletePassword,
  editPasswords,
  getPasswords,
} from "../dist/controllers/passwords.js";
import {
  addCreditCard,
  deleteCreditCard,
  editCreditCard,
  getCreditCards,
} from "../dist/controllers/credit-cards.js";
import { handleMasterPasswordChange } from "../dist/controllers/master-pasword.js";

const app = express();

// Connect to database
connectDB();

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// Passwords routes
app.post("/api/v1/add-password", addPassword);
app.put("/api/v1/update-password/:passwordId", editPasswords);
app.delete("/api/v1/delete-password/:passwordId", deletePassword);
app.get("/api/v1/view-passwords/:userid", getPasswords);

// Credit card routes
app.post("/api/v1/add-credit-card", addCreditCard);
app.put("/api/v1/update-credit-card/:cardId", editCreditCard);
app.delete("/api/v1/delete-credit-card/:cardId", deleteCreditCard);
app.get("/api/v1/view-credit-cards/:userid", getCreditCards);

// Master password change route
app.post("/api/v1/change-master-password", handleMasterPasswordChange);

// Health check routes
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.get("/api", (req, res) => {
  return res.json({
    success: true,
    message: "API is working!",
  });
});

// Export for Vercel serverless
export default app;