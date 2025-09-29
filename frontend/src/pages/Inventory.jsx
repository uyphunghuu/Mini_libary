import React, { useEffect, useState } from "react";

export default function BookStock() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/borrow/books");
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu sách");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-4 drop-shadow-lg">
            📚 Kho sách thư viện
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Kiểm tra số lượng còn lại của tất cả các sách trong kho một cách trực quan và nhanh chóng
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-indigo-500 animate-pulse text-xl mb-6">
            ⏳ Đang tải dữ liệu...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-center shadow-md">
            ❌ {error}
          </div>
        )}

        {/* No data */}
        {!loading && !error && books.length === 0 && (
          <p className="text-center text-gray-400 italic">Không có dữ liệu sách.</p>
        )}

        {/* Books grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => (
              <div
                key={book.id}
                className="relative p-6 bg-gradient-to-tr from-white via-indigo-50 to-white rounded-3xl shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-gray-100 flex flex-col justify-between"
              >
                {/* ID Badge */}
                <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  ID: {book.id}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-indigo-800 mb-3 truncate">{book.title}</h2>

                {/* Quantity */}
                <p className="text-gray-500 mb-1">Tổng số lượng:</p>
                <p className="text-4xl font-extrabold text-green-600">{book.quantity_total}</p>

                {/* Button */}
                <button className="mt-6 py-2 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-700 transition duration-300">
                  Xem chi tiết
                </button>

                {/* Decorative Gradient Circle */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-indigo-200 rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
