import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ConfirmModal from "../components/ConfirmModal";
import API from "../services/api";
import ExpenseForm from "../components/ExpenseForm";

const categoryMeta = {
  Food: { icon: "🍔", className: "food" },
  Transport: { icon: "🚗", className: "transport" },
  Shopping: { icon: "🛍️", className: "shopping" },
  Bills: { icon: "💡", className: "bills" },
  Entertainment: { icon: "🎬", className: "entertainment" },
  Health: { icon: "💊", className: "health" },
  Education: { icon: "📚", className: "education" },
  Other: { icon: "📦", className: "other" },
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const COLORS = [
    "#6366f1",
    "#ec4899",
    "#22c55e",
    "#f59e0b",
    "#06b6d4",
    "#8b5cf6",
  ];

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const expenseCount = expenses.length;
  const latestExpense = expenses.length > 0 ? expenses[0] : null;
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const topCategory = categoryData.length
    ? categoryData.reduce((max, item) => (item.total > max.total ? item : max))
    : null;

  const fetchAll = async () => {
    try {
      const params = {};

      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const [expensesRes, categoryRes, monthRes] = await Promise.all([
        API.get("/expenses", { params }),
        API.get("/expenses/by-category", { params }),
        API.get("/expenses/by-month", { params }),
      ]);

      setExpenses(expensesRes.data);
      setCategoryData(categoryRes.data);

      const formattedMonthlyData = monthRes.data.map((item) => ({
        name: `${String(item._id.month).padStart(2, "0")}/${item._id.year}`,
        total: item.total,
      }));

      setMonthlyData(formattedMonthlyData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    fetchAll();
  }, [navigate, filters]);

  const handleDeleteExpense = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      await API.delete(`/expenses/${deleteId}`);

      if (editingExpense?._id === deleteId) {
        setEditingExpense(null);
      }

      toast.success("Expense deleted");
      setDeleteId(null);
      fetchAll();
    } catch (error) {
      toast.error("Failed to delete expense");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };
  const logout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="topbar">
        <div className="topbar-left">
          <div className="brand-mark">💸</div>

          <div>
            <div className="brand-name">SpendWise</div>
            <div className="brand-subtitle">Personal finance dashboard</div>
          </div>
        </div>

        <div className="topbar-right">
          <div className="profile-chip">
            <div className="user-badge">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="profile-meta">
              <div className="profile-label">Signed in as</div>
              <div className="profile-email">{user?.email || "User"}</div>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="page-grid">
        <div className="left-column">
          <div className="card">
            <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>
            <ExpenseForm
              onSuccess={fetchAll}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <div className="card">
            <h3>Filters</h3>
            <div className="form-grid">
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="">All Categories</option>
                {Object.keys(categoryMeta).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />

              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setFilters({
                    category: "",
                    startDate: "",
                    endDate: "",
                  })
                }
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Recent Transactions</h3>
            <p className="section-subtle">
              Manage, edit, and review your latest spending.
            </p>

            {expenses.length === 0 ? (
              <p className="empty-text">No expenses yet. Add your first one.</p>
            ) : (
              <div className="expense-list">
                {expenses.map((expense) => {
                  const meta =
                    categoryMeta[expense.category] || categoryMeta.Other;

                  return (
                    <div key={expense._id} className="expense-item">
                      <div className="expense-main">
                        <div className="expense-title-row">
                          <span className={`badge badge-${meta.className}`}>
                            <span>{meta.icon}</span>
                            <span>{expense.category}</span>
                          </span>

                          <span className="expense-date">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </div>

                        {expense.description && (
                          <div className="expense-description">
                            {expense.description}
                          </div>
                        )}
                      </div>

                      <div className="expense-right">
                        <div className="expense-amount">
                          ${Number(expense.amount).toFixed(2)}
                        </div>

                        <div className="expense-actions">
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => handleEditExpense(expense)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() => handleDeleteExpense(expense._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <h3>Total Spent</h3>
            <div className="summary-value">${totalSpent.toFixed(2)}</div>
          </div>

          <div className="card">
            <h3>Total Transactions</h3>
            <div className="summary-value">{expenseCount}</div>
          </div>

          <div className="card">
            <h3>Top Category</h3>
            <div className="summary-value" style={{ fontSize: "24px" }}>
              {topCategory ? topCategory._id : "—"}
            </div>
          </div>

          <div className="card">
            <h3>Latest Expense</h3>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              {latestExpense
                ? `$${Number(latestExpense.amount).toFixed(2)}`
                : "—"}
            </div>
            <div style={{ marginTop: "6px", opacity: 0.75 }}>
              {latestExpense ? latestExpense.category : "No data yet"}
            </div>
          </div>

          <div className="card">
            <h3>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="_id"
                  outerRadius={90}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry._id || index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card chart-card">
        <h3>Monthly Analytics</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="name" stroke="#b6bdd0" />
            <YAxis stroke="#b6bdd0" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#a5b4fc"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
