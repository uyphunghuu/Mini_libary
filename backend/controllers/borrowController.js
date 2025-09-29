
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



// 📌 Kiểm tra tồn kho
exports.getStock = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      attributes: ["id", "title", "quantity_total"]
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
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
