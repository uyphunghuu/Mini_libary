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

      const res = await fetch(
        editing ? `${API_URL}/${form.id}` : API_URL,
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

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

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-indigo-700">Quản lý Thư viện</h1>
          <p className="text-gray-600 mt-2">
            Quản lý, chỉnh sửa và theo dõi danh sách sách trong hệ thống
          </p>
        </header>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editing ? "✏️ Cập nhật thông tin sách" : "➕ Thêm sách mới"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { label: "Tên sách", key: "title", type: "text" },
              { label: "Tác giả", key: "author", type: "text" },
              { label: "Thể loại", key: "genre", type: "text" },
              { label: "Danh mục (ID)", key: "category_id", type: "number" },
              { label: "Số lượng", key: "quantity_total", type: "number" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            ))}

            <div className="flex gap-3 items-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
              >
                {editing ? "💾 Lưu" : "➕ Thêm"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow hover:bg-gray-500 transition"
                >
                  ❌ Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            📖 Danh sách sách
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-gray-600">Đang tải dữ liệu...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    {[
                      "ID",
                      "Tên sách",
                      "Tác giả",
                      "Thể loại",
                      "Danh mục",
                      "Số lượng",
                      "Hành động",
                    ].map((col) => (
                      <th key={col} className="px-4 py-3 text-left">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center p-6 text-gray-500"
                      >
                        Không có sách nào.
                      </td>
                    </tr>
                  )}
                  {books.map((book, idx) => (
                    <tr
                      key={book.id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3">{book.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {book.title}
                      </td>
                      <td className="px-4 py-3">{book.author}</td>
                      <td className="px-4 py-3">{book.genre}</td>
                      <td className="px-4 py-3">{book.category_id}</td>
                      <td className="px-4 py-3">{book.quantity_total}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
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
