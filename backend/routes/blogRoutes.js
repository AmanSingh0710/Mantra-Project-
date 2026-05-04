const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = require("../middleware/upload");
const isAdmin = require("../middleware/isAdmin");
const auth = require("../middleware/auth");

// CREATE
router.post("/add", auth, isAdmin, upload.single("image"), blogController.createBlog);

// READ
router.get("/",  blogController.getBlogs);
router.get("/:slug",  blogController.getSingleBlog);

// UPDATE
router.put("/:id", auth, isAdmin,  upload.single("image"), blogController.updateBlog);

// DELETE
router.delete("/:id", auth, isAdmin,  blogController.deleteBlog);

module.exports = router;