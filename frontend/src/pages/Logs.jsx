
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

  // CSS object
  const styles = {
    container: {
      padding: "24px",
      maxWidth: "1100px",
      margin: "0 auto",
      fontFamily: "Segoe UI, Tahoma, sans-serif",
      color: "#333",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    title: {
      fontSize: "1.6rem",
      fontWeight: "bold",
      color: "#4338ca",
    },
    button: {
      padding: "8px 16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      background: "#fff",
      cursor: "pointer",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
    },
    buttonHover: {
      background: "#f3f4f6",
    },
    errorBox: {
      marginBottom: "16px",
      padding: "12px",
      background: "#fee2e2",
      color: "#b91c1c",
      borderRadius: "6px",
    },
    loading: {
      textAlign: "center",
      color: "#6b7280",
    },
    tableWrapper: {
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      background: "#eef2ff",
      color: "#3730a3",
    },
    th: {
      padding: "12px 16px",
      textAlign: "left",
    },
    td: {
      padding: "12px 16px",
    },
    trHover: {
      background: "#f9fafb",
    },
    empty: {
      textAlign: "center",
      padding: "24px",
      color: "#6b7280",
    },
    borrow: { color: "#2563eb", fontWeight: "600" },
    return: { color: "#16a34a", fontWeight: "600" },
    other: { color: "#4b5563" },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📝 Nhật ký hoạt động</h1>
        <button
          onClick={fetchLogs}
          style={styles.button}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = styles.buttonHover.background)
          }
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          🔄 Làm mới
        </button>
      </header>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Đang tải nhật ký...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Người dùng</th>
                <th style={styles.th}>Hành động</th>
                <th style={styles.th}>Sách</th>
                <th style={styles.th}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} style={styles.empty}>
                    Chưa có hoạt động nào.
                  </td>
                </tr>
              )}
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = styles.trHover.background)
                  }
                  onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  <td style={styles.td}>{log.user?.name || "Ẩn danh"}</td>
                  <td style={styles.td}>
                    {log.action === "borrow" ? (
                      <span style={styles.borrow}>📖 Mượn</span>
                    ) : log.action === "return" ? (
                      <span style={styles.return}>✅ Trả</span>
                    ) : (
                      <span style={styles.other}>{log.action}</span>
                    )}
                  </td>
                  <td style={styles.td}>{log.book?.title || "Không rõ"}</td>
                  <td style={styles.td}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
