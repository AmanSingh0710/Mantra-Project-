const express = require("express");
const multer = require("multer");
const isAdmin =  require("../middleware/isAdmin");
const auth = require("../middleware/auth");
const authController = require("../controllers/authController")

const router = express.Router();

// --- MULTER SETUP (Local Storage) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Ensure this folder exists
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// AUTH ROUTES
router.post("/register", upload.single("image"), authController.register);
router.post("/login", authController.login);
router.get("/all", auth, isAdmin, authController.getAllUsers);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

// ADMIN ROUTES (STATIC FIRST)
router.get("/admin-profile", auth, isAdmin, authController.getAdminProfile);
router.patch("/update-password", auth, isAdmin, authController.updatePassword);
router.patch("/update-admin", auth, isAdmin, upload.single("image"), authController.updateAdmin);
router.patch("/update/:id", auth, isAdmin, upload.single("image"), authController.updateUser);

// PROFILE CRUD
router.get("/profile/:id", auth, authController.getProfile);
router.delete("/:id", auth, authController.deleteUser);

// 🔥 Dynamic route LAST
router.patch("/:id", upload.single("image"), auth, authController.updateUser);

module.exports = router;