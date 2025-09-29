import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const features = [
    { title: "🔍 Tìm kiếm", desc: "Theo tên, tác giả, thể loại", path: "/search" },
    { title: "📖 Mượn / Trả", desc: "Đăng ký mượn & trả", path: "/borrow-return" },
    { title: "📚 Sách", desc: "Thêm, sửa, xóa sách", path: "/books" },
    { title: "👥 Người mượn", desc: "Danh sách mượn/trả", path: "/users" },
    { title: "📦 Tồn kho", desc: "Số lượng còn lại", path: "/inventory" },
    { title: "📝 Nhật ký", desc: "Hoạt động mượn/trả", path: "/logs" },
  ];

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          'url("https://img5.thuthuatphanmem.vn/uploads/2021/11/27/anh-nen-co-rau-trang-one-piece_011046074.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "40px 20px",
      }}
    >
      {/* Header */}
      <h1
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "2.8rem",
          textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        📚 Quản lý Thư viện
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: "30px",
          fontWeight: "500",
          textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
        }}
      >
        Chọn chức năng:
      </p>

      {/* Features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "15px",
          marginBottom: "50px",
        }}
      >
        {features.map((f, i) => (
          <Link
            to={f.path}
            key={i}
            style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.25)";
            }}
          >
            <h3 style={{ color: "#fff", margin: "0 0 8px" }}>{f.title}</h3>
            <p style={{ color: "#eee", fontSize: "14px", margin: 0 }}>
              {f.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Book list */}
      <h2
        style={{
          margin: "30px 0 15px",
          color: "white",
          textShadow: "1px 1px 6px rgba(0,0,0,0.7)",
        }}
      >
        📖 Danh sách Sách
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {books.length > 0 ? (
          books.map((book, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(0,0,0,0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.25)";
              }}
            >
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "250px",
                    background: "#eee",
                    borderRadius: "8px",
                  }}
                ></div>
              )}
              <h4 style={{ marginTop: "10px", color: "#fff" }}>
                {book.title}
              </h4>
              <p style={{ fontSize: "14px", color: "#ddd" }}>
                {book.author}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "white" }}>⏳ Đang tải danh sách sách...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
