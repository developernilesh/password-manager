import express from "express";
import connectDB from "./config/database.js";
import { addPassword } from "./controllers/passwords.js";

const app = express();
connectDB();

app.use(express.json());

app.post("/api/v1/add-password", addPassword);


app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(4000, () => {
  console.log("Server Started at Port 4000");
});
