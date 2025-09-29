const { Book, Category } = require("../models");
const { Op } = require("sequelize");

// Lấy danh sách sách
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy 1 cuốn sách theo ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm sách mới
exports.addBook = async (req, res) => {
  try {
    const { title, author, category_id, genre, quantity_total } = req.body;

    const book = await Book.create({
      title,
      author,
      category_id,
      genre, // thêm trường mới
      quantity_total,
      quantity_available: quantity_total, // ban đầu số lượng khả dụng = tổng số lượng
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Cập nhật sách
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category_id, quantity_total, quantity_available } = req.body;

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.update({
      title,
      author,
      category_id,
      quantity_total,
      quantity_available,
    });

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa sách
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { title, author, category, genre } = req.query;

    // Tìm theo các cột của bảng Book
    let whereClause = {};
    if (title) whereClause.title = { [Op.like]: `%${title}%` };
    if (author) whereClause.author = { [Op.like]: `%${author}%` };
    if (genre) whereClause.genre = { [Op.like]: `%${genre}%` };

    // Tìm theo bảng Category
    let includeClause = [];
    if (category) {
      includeClause.push({
        model: Category,
        as: "category",
        where: { name: { [Op.like]: `%${category}%` } },
        required: true, // bắt buộc join
      });
    } else {
      includeClause.push({
        model: Category,
        as: "category",
        required: false,
      });
    }

    const books = await Book.findAll({
      where: whereClause,
      include: includeClause,
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
