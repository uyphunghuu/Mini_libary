import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./api/home/Home";
import Register from "./api/auth/Register";
import Login from "./api/auth/Login";
import Search from "./pages/Search";
import BorrowReturn from "./pages/BorrowReturn";
import LibraryAdmin from "./pages/Library Admin";
import Logs from "./pages/Logs";
import UserBorrow from "./pages/UserBorrow";
import Inventory from "./pages/Inventory";


// Sau này bạn có thể import thêm các page khác:
// import SearchBooks from "./api/books/SearchBooks";
// import BorrowReturn from "./api/borrow/BorrowReturn";

function App() {
  const navStyle = {
    padding: "10px 20px",
    backgroundColor: "#ecf0f1",
    display: "flex",
    gap: "15px",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#2c3e50",
    fontWeight: "bold",
  };

  return (
    <Router>
      {/* Thanh menu */}
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>🏠 Trang chủ</Link>
        <Link to="/register" style={linkStyle}>Đăng ký</Link>
        <Link to="/login" style={linkStyle}>Đăng nhập</Link>
        {/* Sau này thêm link mới */}
        {/* <Link to="/search" style={linkStyle}>Tìm sách</Link> */}
        {/* <Link to="/borrow-return" style={linkStyle}>Mượn/Trả sách</Link> */}
      </nav>

      {/* Các route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/borrow-return" element = {<BorrowReturn/>}></Route>
        <Route path="/books" element={<LibraryAdmin />} />
        <Route path="/users" element={<UserBorrow/>} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;
