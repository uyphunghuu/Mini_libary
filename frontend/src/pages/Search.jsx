// src/pages/Search.jsx
import React, { useState } from "react";

function Search() {
  const [titleQuery, setTitleQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!titleQuery.trim() && !authorQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/books/search?title=${encodeURIComponent(titleQuery)}&author=${encodeURIComponent(authorQuery)}`
      );

      if (!res.ok) throw new Error("Không lấy được dữ liệu từ server");

      const data = await res.json();
      console.log("Dữ liệu API trả về:", data);

      const filtered = data.filter(book => {
        const titleMatch = titleQuery ? book.title?.toLowerCase().includes(titleQuery.toLowerCase()) : true;
        const authorMatch = authorQuery ? book.author?.toLowerCase().includes(authorQuery.toLowerCase()) : true;
        return titleMatch && authorMatch;
      });

      setResults(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>🔍 Tìm kiếm sách</h2>

      {/* Inputs */}
      <div style={{ display: "flex", marginBottom: "20px", gap: "10px" }}>
        <input
          type="text"
          placeholder="Tên sách"
          value={titleQuery}
          onChange={e => setTitleQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none"
          }}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
        <input
          type="text"
          placeholder="Tên tác giả"
          value={authorQuery}
          onChange={e => setAuthorQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none"
          }}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
      </div>

      <button
        onClick={handleSearch}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#2980b9",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "0.2s",
          marginBottom: "20px"
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "#3498db"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "#2980b9"}
      >
        Tìm kiếm
      </button>

      {/* Trạng thái */}
      {loading && <p style={{ color: "#2980b9" }}>Đang tìm kiếm...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Kết quả */}
      {results.length === 0 && !loading && <p>Không tìm thấy sách nào.</p>}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {results.map(book => (
          <div
            key={book.id}
            style={{
              background: "#f9f9f9",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={{ margin: "0 0 8px", color: "#2980b9" }}>{book.title}</h3>
            <p style={{ margin: "0 0 4px" }}><strong>Tác giả:</strong> {book.author || "Chưa có"}</p>
            <p style={{ margin: 0 }}><strong>Thể loại:</strong> {book.category?.name || "Chưa có"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
