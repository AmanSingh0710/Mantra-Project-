const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const auth = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

router.post("/", auth, isAdmin, categoryController.createCategory);
router.put("/:id", auth, isAdmin, categoryController.updateCategory);
router.delete("/:id", auth, isAdmin, categoryController.deleteCategory);
router.get("/", auth, isAdmin, categoryController.getCategories);


module.exports = router;