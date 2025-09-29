import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage("✅ Đăng ký thành công: " + res.data.message);
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center" }}>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Tên đăng nhập</label>
          <input
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Họ và tên</label>
          <input
            name="fullname"
            placeholder="Họ và tên"
            value={form.fullname}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Mật khẩu</label>
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <button
          type="submit"
          style={{ width: "100%", padding: 10, background: "#4CAF50", color: "white", border: "none", borderRadius: 5 }}
        >
          Đăng ký
        </button>
      </form>
      {message && <p style={{ marginTop: 15, textAlign: "center" }}>{message}</p>}
    </div>
  );
}

export default Register;
