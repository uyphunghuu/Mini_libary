import React, { useEffect, useState } from "react";

export default function BookManager() {
  const API_URL = "http://localhost:5000/api/books";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    id: null,
    title: "",
    author: "",
    category_id: "",
    genre: "",
    quantity_total: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Không lấy được dữ liệu");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        author: form.author,
        category_id: parseInt(form.category_id, 10),
        genre: form.genre,
        quantity_total: parseInt(form.quantity_total, 10),
      };

      const res = await fetch(editing ? `${API_URL}/${form.id}` : API_URL, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lỗi khi lưu sách");
      resetForm();
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(book) {
    setForm(book);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa sách này?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi khi xóa sách");
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  function resetForm() {
    setForm({
      id: null,
      title: "",
      author: "",
      category_id: "",
      genre: "",
      quantity_total: "",
    });
    setEditing(false);
  }

  // ================= CSS =================
  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f9fafb",
      padding: "40px",
      fontFamily: "Segoe UI, sans-serif",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      fontSize: "2.2rem",
      fontWeight: "bold",
      color: "#4338ca",
    },
    subtitle: { marginTop: "8px", color: "#6b7280" },
    card: {
      background: "#fff",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "40px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      border: "1px solid #e5e7eb",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "20px",
    },
    form: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },
    label: { fontSize: "0.9rem", fontWeight: "500", marginBottom: "6px", display: "block", color: "#374151" },
    input: {
      width: "100%",
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      outline: "none",
    },
    btnRow: { display: "flex", gap: "12px", alignItems: "flex-end" },
    btn: {
      padding: "10px 20px",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      transition: "0.2s",
    },
    btnPrimary: { background: "#4f46e5", color: "#fff" },
    btnPrimaryHover: { background: "#4338ca" },
    btnCancel: { background: "#9ca3af", color: "#fff" },
    btnCancelHover: { background: "#6b7280" },
    tableWrapper: {
      overflowX: "auto",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
    },
    table: {
      width: "100%",
      fontSize: "0.9rem",
      borderCollapse: "collapse",
    },
    thead: { background: "#4f46e5", color: "#fff" },
    th: { padding: "12px 16px", textAlign: "left" },
    td: { padding: "12px 16px" },
    rowEven: { background: "#f9fafb" },
    rowOdd: { background: "#fff" },
    actionBtn: {
      padding: "6px 12px",
      borderRadius: "6px",
      color: "#fff",
      cursor: "pointer",
      marginRight: "6px",
      border: "none",
    },
    editBtn: { background: "#f59e0b" },
    deleteBtn: { background: "#ef4444" },
    errorBox: {
      marginBottom: "16px",
      padding: "12px",
      background: "#fee2e2",
      color: "#b91c1c",
      borderRadius: "6px",
    },
  };

  // ================= UI =================
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>Quản lý Thư viện</h1>
          <p style={styles.subtitle}>
            Quản lý, chỉnh sửa và theo dõi danh sách sách trong hệ thống
          </p>
        </header>

        {/* Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            {editing ? "✏️ Cập nhật thông tin sách" : "➕ Thêm sách mới"}
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {[
              { label: "Tên sách", key: "title", type: "text" },
              { label: "Tác giả", key: "author", type: "text" },
              { label: "Thể loại", key: "genre", type: "text" },
              { label: "Danh mục (ID)", key: "category_id", type: "number" },
              { label: "Số lượng", key: "quantity_total", type: "number" },
            ].map((field) => (
              <div key={field.key}>
                <label style={styles.label}>{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  required
                  style={styles.input}
                />
              </div>
            ))}

            <div style={styles.btnRow}>
              <button
                type="submit"
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    styles.btnPrimaryHover.background)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = styles.btnPrimary.background)
                }
              >
                {editing ? "💾 Lưu" : "➕ Thêm"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ ...styles.btn, ...styles.btnCancel }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      styles.btnCancelHover.background)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = styles.btnCancel.background)
                  }
                >
                  ❌ Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📖 Danh sách sách</h2>

          {error && <div style={styles.errorBox}>{error}</div>}

          {loading ? (
            <div>Đang tải dữ liệu...</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    {[
                      "ID",
                      "Tên sách",
                      "Tác giả",
                      "Thể loại",
                      "Danh mục",
                      "Số lượng",
                      "Hành động",
                    ].map((col) => (
                      <th key={col} style={styles.th}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                        Không có sách nào.
                      </td>
                    </tr>
                  )}
                  {books.map((book, idx) => (
                    <tr
                      key={book.id}
                      style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}
                    >
                      <td style={styles.td}>{book.id}</td>
                      <td style={{ ...styles.td, fontWeight: "600", color: "#111827" }}>
                        {book.title}
                      </td>
                      <td style={styles.td}>{book.author}</td>
                      <td style={styles.td}>{book.genre}</td>
                      <td style={styles.td}>{book.category_id}</td>
                      <td style={styles.td}>{book.quantity_total}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleEdit(book)}
                          style={{ ...styles.actionBtn, ...styles.editBtn }}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
