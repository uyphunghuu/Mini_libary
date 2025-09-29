const { User, Book, Category, Borrow, Log } = require("./models");

async function testDB() {
  try {
    // Tạo 1 category
    const cat = await Category.create({ name: "Lập trình" });

    // Tạo 1 book
    const book = await Book.create({
      title: "Học Node.js",
      author: "Nguyễn Văn A",
      category_id: cat.id,
      quantity_total: 10,
      quantity_available: 10
    });

    // Tạo 1 user
    const user = await User.create({
      username: "admin",
      password: "123456",
      fullname: "Quản trị viên",
      role: "admin"
    });

    // Mượn sách
    const borrow = await Borrow.create({
      user_id: user.id,
      book_id: book.id,
      status: "pending"
    });

    console.log("✅ Test thành công!");
    console.log({ cat, book, user, borrow });
  } catch (err) {
    console.error("❌ Lỗi test DB:", err);
  }
}

testDB();
