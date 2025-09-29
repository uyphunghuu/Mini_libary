// controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullname, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullname : username,
      role: role || "user"   // mặc định là user, admin thì set thủ công
    });

    res.status(201).json({ message: "Đăng ký thành công!", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user có tồn tại
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secret_key",   // sau này đổi thành biến môi trường
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
