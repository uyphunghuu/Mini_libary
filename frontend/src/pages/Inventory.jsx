import React, { useEffect, useState } from "react";

export default function BookStock() {
  const [bookId, setBookId] = useState(3); // mặc định là id = 3
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStock(bookId);
  }, [bookId]);

  async function fetchStock(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/borrow/books/${id}/stock`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setStock(data.stock); // giả sử API trả về { stock: 12 }
    } catch (err) {
      setError(err.message || "Lỗi khi tải số lượng sách");
      setStock(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const id = e.target.bookId.value.trim();
    if (id) setBookId(id);
  }

  return (
    <div className="p-6 max-w-md mx-auto font-sans">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        📚 Kiểm tra số lượng sách
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="number"
          name="bookId"
          placeholder="Nhập ID sách..."
          className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Xem
        </button>
      </form>

      {loading && <div className="text-gray-600">Đang tải...</div>}
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {stock !== null && !loading && !error && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow">
          <p className="text-lg text-green-700">
            ✅ Số lượng sách còn lại: <span className="font-bold">{stock}</span>
          </p>
        </div>
      )}
    </div>
  );
}
