// routes/borrow.routes.js
const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");

router.post("/borrow", borrowController.borrowBook);
router.post("/return", borrowController.returnBook);
router.get("/borrows", borrowController.getBorrows);
router.get("/books/:id/stock", borrowController.getStock);
router.get("/logs", borrowController.getLogs);

module.exports = router;
