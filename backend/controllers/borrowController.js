
// controllers/borrow.controller.js
const { Borrow, Book, Log, User } = require("../models");

// 📌 Mượn sách
exports.borrowBook = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;

    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.quantity_total <= 0) {
      return res.status(400).json({ message: "Book out of stock" });
    }

    const borrow = await Borrow.create({
      user_id,
      book_id,
      borrow_date: new Date(),
      status: "pending"
    });

    await book.update({ quantity_total: book.quantity_total - 1 });

    await Log.create({
      user_id,
      book_id,
      action: "borrow_book",
      created_at: new Date()
    });

    res.status(201).json(borrow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Trả sách
exports.returnBook = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;

    const borrow = await Borrow.findOne({
      where: { user_id, book_id, status: "pending" }
    });
    if (!borrow) return res.status(404).json({ message: "No borrow record found" });

    await borrow.update({
      status: "returned",
      return_date: new Date()
    });

    const book = await Book.findByPk(book_id);
    await book.update({ quantity_total: book.quantity_total + 1 });

    await Log.create({
      user_id,
      book_id,
      action: "return_book",
      created_at: new Date()
    });

    res.json(borrow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// 📌 Danh sách mượn
exports.getBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      include: [
        {
          model: User,            // không dùng alias
          attributes: ["id", "username"]
        },
        {
          model: Book,            // không dùng alias
          attributes: ["id", "title"]
        }
      ]
    });

    res.json(borrows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách borrow:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// 📌 Lấy tất cả sách và số lượng còn lại
exports.getStock = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["id", "title", "quantity_total"] // nếu có trường số lượng còn lại
    });

    res.json(books); // trả về mảng tất cả sách
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// 📌 Xem log
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
        include: [
        { model: User,  attributes: ["id", "username"] },
        { model: Book,  attributes: ["id", "title"] }
      ],
      order: [["created_at", "DESC"]]
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// 📌 Lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "fullname", "email", "role", "created_at", "updated_at"]
    });
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { username, password, fullname, email, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username và password là bắt buộc" });
    }

    const user = await User.create({
      username,
      password, // ⚠️ bạn nên hash password trước khi lưu
      fullname,
      email,
      role: role || "user",
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Lỗi tạo user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    await user.update({
      fullname,
      email,
      role,
      updated_at: new Date()
    });

    res.json(user);
  } catch (err) {
    console.error("❌ Lỗi cập nhật user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    await user.destroy();
    res.json({ message: "User đã được xóa" });
  } catch (err) {
    console.error("❌ Lỗi xóa user:", err);
    res.status(500).json({ error: "Server error" });
  }
};
