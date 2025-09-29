import React, { useEffect, useState } from "react";

function BorrowReturn() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [action, setAction] = useState("borrow");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsers, resBooks] = await Promise.all([
          fetch("http://localhost:5000/api/borrow/users"),
            fetch("http://localhost:5000/api/books")

        ]);
        setUsers(await resUsers.json());
        setBooks(await resBooks.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBook) {
      setMessage("⚠️ Vui lòng chọn đủ thông tin!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/borrow/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser,
          book_id: selectedBook,
          action,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đã xảy ra lỗi");
      setMessage("✅ Thực hiện thành công!");
      setSelectedBook("");
      setSelectedUser("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="borrow-container">
      <h2 className="borrow-title">📖 Đăng ký mượn / trả sách</h2>

      <form onSubmit={handleSubmit} className="borrow-form">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="borrow-select"
        >
          <option value="">-- Chọn người mượn --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} ({u.fullname})
            </option>
          ))}
        </select>

        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="borrow-select"
        >
          <option value="">-- Chọn sách --</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.category?.name || "Chưa có thể loại"})
            </option>
          ))}
        </select>

        <div className="borrow-radio-group">
          <label>
            <input
              type="radio"
              value="borrow"
              checked={action === "borrow"}
              onChange={(e) => setAction(e.target.value)}
            />
            Mượn
          </label>
          <label>
            <input
              type="radio"
              value="return"
              checked={action === "return"}
              onChange={(e) => setAction(e.target.value)}
            />
            Trả
          </label>
        </div>

        <button type="submit" disabled={loading} className="borrow-button">
          {loading ? "⏳ Đang xử lý..." : "Xác nhận"}
        </button>
      </form>

      {message && (
        <p className={`borrow-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      {/* CSS inline trong file */}
      <style>{`
        .borrow-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 24px;
          font-family: sans-serif;
        }
        .borrow-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4f46e5;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .borrow-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .borrow-select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: border 0.2s;
        }
        .borrow-select:focus {
          border-color: #4f46e5;
        }
        .borrow-radio-group {
          display: flex;
          gap: 20px;
          font-size: 1rem;
        }
        .borrow-button {
          padding: 10px 16px;
          background: #4f46e5;
          color: #fff;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .borrow-button:hover {
          background: #4338ca;
        }
        .borrow-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .borrow-message {
          margin-top: 1rem;
          font-weight: 500;
        }
        .borrow-message.success {
          color: #16a34a;
        }
        .borrow-message.error {
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}

export default BorrowReturn;
