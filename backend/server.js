const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const db = require("./models");

const authRoutes = require("./routes/auth.routes.js");
const bookRoutes = require("./routes/bookRoutes.js");
const borrowRoutes = require("./routes/borrow.routes.js");

const app = express();
app.use(bodyParser.json());

// 📂 Tạo folder logs nếu chưa có
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 📄 Tạo stream để ghi log vào file access.log
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" } // append mode
);

// 👉 Log vừa in ra console, vừa ghi file
app.use(morgan("dev")); // console
app.use(morgan("combined", { stream: accessLogStream })); // file

// ✅ Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// API
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
