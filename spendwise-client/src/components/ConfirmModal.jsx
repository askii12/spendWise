export default function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p className="modal-text">{description}</p>

        <div className="modal-actions">
          <button className="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>

          <button className="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
