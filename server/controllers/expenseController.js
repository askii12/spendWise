import prisma from "../config/prisma.js";

const buildWhere = (req) => {
  const { category, startDate, endDate } = req.query;

  const where = {
    userId: req.user.id,
  };

  if (category) {
    where.category = category;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  return where;
};
export const createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body || {};

  if (!amount || !category || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        category,
        date: new Date(date),
        description,
        userId: req.user.id,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: buildWhere(req),
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const expenseId = Number(req.params.id);

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return res.status(404).json({ message: "Not found" });
    }

    if (expense.userId !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount: amount !== undefined ? Number(amount) : expense.amount,
        category: category ?? expense.category,
        date: date ? new Date(date) : expense.date,
        description: description ?? expense.description,
      },
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  const expenseId = Number(req.params.id);

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return res.status(404).json({ message: "Not found" });
    }

    if (expense.userId !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSummary = async (req, res) => {
  try {
    const result = await prisma.expense.aggregate({
      where: buildWhere(req),
      _sum: {
        amount: true,
      },
    });

    res.json({ total: result._sum.amount || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getByCategory = async (req, res) => {
  try {
    const data = await prisma.expense.groupBy({
      by: ["category"],
      where: buildWhere(req),
      _sum: {
        amount: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    const formatted = data.map((item) => ({
      _id: item.category,
      total: item._sum.amount || 0,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getByMonth = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: buildWhere(req),
      select: {
        amount: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const grouped = {};

    for (const expense of expenses) {
      const d = new Date(expense.date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${month}`;

      if (!grouped[key]) {
        grouped[key] = {
          _id: { year, month },
          total: 0,
        };
      }

      grouped[key].total += Number(expense.amount);
    }

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
