import React, { useEffect, useState } from "react";

export default function BorrowList() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBorrows();
  }, []);

  async function fetchBorrows() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/borrow/borrows");
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setBorrows(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải danh sách mượn");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">📖 Danh sách người mượn</h1>
        <button
          onClick={fetchBorrows}
          className="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100"
        >
          🔄 Làm mới
        </button>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Đang tải...</div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-indigo-50 text-indigo-800">
              <tr>
                <th className="px-4 py-3 text-left">Người mượn</th>
                <th className="px-4 py-3 text-left">Tên sách</th>
                <th className="px-4 py-3 text-left">Ngày mượn</th>
                <th className="px-4 py-3 text-left">Ngày trả</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrows.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    Chưa có ai mượn sách.
                  </td>
                </tr>
              )}
              {borrows.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{item.borrower_name || "Ẩn danh"}</td>
                  <td className="px-4 py-3">{item.book_name || "Không rõ"}</td>
                  <td className="px-4 py-3">{item.borrow_date}</td>
                  <td className="px-4 py-3">{item.return_date || "Chưa trả"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
