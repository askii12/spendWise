import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./server/routes/authRoutes.js";
import expenseRoutes from "./server/routes/expenseRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://YOUR-VERCEL-DOMAIN.vercel.app"],
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SpendWise API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
