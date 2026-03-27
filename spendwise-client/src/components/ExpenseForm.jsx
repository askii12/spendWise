import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

const initialForm = {
  amount: "",
  category: "Food",
  date: "",
  description: "",
};

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

export default function ExpenseForm({
  onSuccess,
  editingExpense,
  onCancelEdit,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(editingExpense);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: editingExpense.amount ?? "",
        category: editingExpense.category ?? "Food",
        date: editingExpense.date ? editingExpense.date.slice(0, 10) : "",
        description: editingExpense.description ?? "",
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      return "Amount must be greater than 0";
    }

    if (!form.category.trim()) {
      return "Please choose a category";
    }

    if (!form.date) {
      return "Please select a date";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      description: form.description.trim(),
    };

    try {
      setLoading(true);
      setError("");

      if (isEditing) {
        await API.put(`/expenses/${editingExpense._id}`, payload);
        toast.success("Expense updated");
      } else {
        await API.post("/expenses", payload);
        toast.success("Expense added");
      }

      setForm(initialForm);
      onSuccess();

      if (isEditing && onCancelEdit) {
        onCancelEdit();
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to save expense";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <input
        name="amount"
        type="number"
        step="0.01"
        min="0"
        placeholder="💰 Amount"
        value={form.amount}
        onChange={handleChange}
      />

      <select name="category" value={form.category} onChange={handleChange}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
      />

      <textarea
        name="description"
        className="full-width"
        placeholder="📝 Description"
        value={form.description}
        onChange={handleChange}
      />

      {error && (
        <p
          className="full-width"
          style={{ margin: 0, color: "#fca5a5", fontSize: "14px" }}
        >
          {error}
        </p>
      )}

      <div
        className="full-width"
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
              ? "Save Changes"
              : "Add Expense"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="secondary"
            onClick={onCancelEdit}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
