// src/pages/BorrowReturn.jsx
import React, { useEffect, useState } from "react";

function BorrowReturn() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [action, setAction] = useState("borrow"); // borrow or return
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy danh sách user & book từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsers, resBooks] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/books"),
        ]);

        const dataUsers = await resUsers.json();
        const dataBooks = await resBooks.json();

        setUsers(dataUsers);
        setBooks(dataBooks);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBook) {
      setMessage("Vui lòng chọn đủ thông tin!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser,
          book_id: selectedBook,
          action, // borrow or return
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đã xảy ra lỗi");
      setMessage("Thực hiện thành công!");
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📖 Đăng ký mượn / trả sách</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Chọn người mượn */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="">Chọn người mượn</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username} ({u.fullname})</option>
          ))}
        </select>

        {/* Chọn sách */}
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="">Chọn sách</option>
          {books.map(b => (
            <option key={b.id} value={b.id}>{b.title} ({b.category?.name || "Chưa có thể loại"})</option>
          ))}
        </select>

        {/* Chọn hành động */}
        <div style={{ display: "flex", gap: "20px" }}>
          <label>
            <input
              type="radio"
              value="borrow"
              checked={action === "borrow"}
              onChange={(e) => setAction(e.target.value)}
            /> Mượn
          </label>
          <label>
            <input
              type="radio"
              value="return"
              checked={action === "return"}
              onChange={(e) => setAction(e.target.value)}
            /> Trả
          </label>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            backgroundColor: "#2980b9",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </form>

      {message && <p style={{ marginTop: "20px", color: message.includes("thành công") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}

export default BorrowReturn;
