import React, { useEffect, useState } from "react";

export default function BorrowLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/borrow/logs");
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải nhật ký");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">📝 Nhật ký hoạt động</h1>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100"
        >
          🔄 Làm mới
        </button>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Đang tải nhật ký...</div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-indigo-50 text-indigo-800">
              <tr>
                <th className="px-4 py-3 text-left">Người dùng</th>
                <th className="px-4 py-3 text-left">Hành động</th>
                <th className="px-4 py-3 text-left">Sách</th>
                <th className="px-4 py-3 text-left">Thời gian</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    Chưa có hoạt động nào.
                  </td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{log.user?.name || "Ẩn danh"}</td>
                  <td className="px-4 py-3">
                    {log.action === "borrow" ? (
                      <span className="text-blue-600 font-medium">📖 Mượn</span>
                    ) : log.action === "return" ? (
                      <span className="text-green-600 font-medium">✅ Trả</span>
                    ) : (
                      <span className="text-gray-600">{log.action}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{log.book?.title || "Không rõ"}</td>
                  <td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
