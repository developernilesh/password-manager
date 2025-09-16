import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import { addPassword, deletePassword, editPasswords, getPasswords } from "./controllers/passwords.js";

const app = express();
connectDB();

app.use(express.json());

// Used env variable safely (added a fallback to avoid "undefined")
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));

app.post("/api/v1/add-password", addPassword);
app.put("/api/v1/update-password/:passwordId", editPasswords);
app.delete("/api/v1/delete-password/:passwordId", deletePassword);
app.get("/api/v1/view-passwords/:userid", getPasswords);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(4000, () => {
  console.log("Server Started at Port 4000");
});
