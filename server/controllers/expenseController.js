import Expense from "../models/Expense.js";

// CREATE
export const createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      date,
      description,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL (with filtering)
export const getExpenses = async (req, res) => {
  try {
    const filter = buildExpenseFilter(req);
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;

  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;
    expense.description = description ?? expense.description;

    const updatedExpense = await expense.save();

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const buildExpenseFilter = (req) => {
  const { category, startDate, endDate } = req.query;

  const filter = { user: req.user._id };

  if (category) {
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  return filter;
};
// DELETE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Not found" });

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const filter = buildExpenseFilter(req);

    const result = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(result[0] || { total: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getByCategory = async (req, res) => {
  try {
    const filter = buildExpenseFilter(req);

    const data = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getByMonth = async (req, res) => {
  try {
    const filter = buildExpenseFilter(req);

    const data = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
