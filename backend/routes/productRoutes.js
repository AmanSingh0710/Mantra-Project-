// backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const validateId = require("../middleware/validateId");
const upload = require("../middleware/upload");

const productcontroller = require("../controllers/productController");

const rateLimit = require("express-rate-limit");


// 🔐 Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later"
});


// ================= PUBLIC ROUTES ================= //

// ✅ Get All Products
router.get("/", apiLimiter, productcontroller.getAllProducts);

// ✅ Get Single Product
router.get("/:id", apiLimiter, validateId, productcontroller.getSingleProduct);


// ================= ADMIN ROUTES ================= //

// ✅ Add Product (Admin only)
router.post(
  "/",
  apiLimiter,
  auth,
  isAdmin("ADMIN"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "metaImage", maxCount: 1 }
  ]),
  productcontroller.addProduct
);

// ✅ Update Product (Admin only)
router.put(
  "/:id",
  apiLimiter,
  auth,
  isAdmin("ADMIN"),
  validateId,
  productcontroller.updateProduct
);

// ✅ Delete Product (Admin only)
router.delete(
  "/:id",
  apiLimiter,
  auth,
  isAdmin("ADMIN"),
  validateId,
  productcontroller.deleteProduct
);

module.exports = router;