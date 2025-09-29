// routes/borrow.routes.js
const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");

router.post("/borrow", borrowController.borrowBook);
router.post("/return", borrowController.returnBook);
router.get("/borrows", borrowController.getBorrows);
router.get("/books", borrowController.getStock);
router.get("/logs", borrowController.getLogs);


router.get("/users", borrowController.getUsers);
router.post("/users", borrowController.createUser);
router.put("/users/:id", borrowController.updateUser);
router.delete("/users/:id", borrowController.deleteUser);

module.exports = router;
