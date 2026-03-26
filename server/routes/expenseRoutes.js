import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
  getByCategory,
  getByMonth,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/summary", protect, getSummary);
router.get("/by-category", protect, getByCategory);
router.get("/by-month", protect, getByMonth);
router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

export default router;
