// backend/routes/AdminproductRoutes.js

const express = require('express');
const router = express.Router();

const productController = require('../controllers/AdminproductController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');
const validateId = require("../middleware/validateId");

const rateLimit = require("express-rate-limit");


// 🔐 Admin Rate Limiter
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many admin requests, try later"
});

// 🌍 Public Rate Limiter
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, try later"
});


// ================= ROUTES ================= //

// ✅ Get Product List (Admin only)
router.get(
  '/',
  adminLimiter,
  auth,
  isAdmin("ADMIN"),
  productController.getProducts
);


// ✅ Add Product (Admin only)
router.post(
  '/add',
  adminLimiter,
  auth,
  isAdmin("ADMIN"),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 },
    { name: 'metaImage', maxCount: 1 }
  ]),
  productController.addProduct
);


// ✅ Public Products
router.get('/public', publicLimiter, productController.getPublicProducts);


// ✅ Toggle Status (Admin only)
router.patch(
  '/toggle-status',
  adminLimiter,
  auth,
  isAdmin("ADMIN"),
  productController.toggleStatus
);


// ✅ Update Product (Admin only)
router.put(
  '/:id',
  adminLimiter,
  auth,
  isAdmin("ADMIN"),
  validateId,
  productController.updateProduct
);


// ✅ Delete Product (Admin only)
router.delete(
  '/:id',
  adminLimiter,
  auth,
  isAdmin("ADMIN"),
  validateId,
  productController.deleteProduct
);


// ✅ Bulk Import (Admin only)
router.post(
  '/bulk-import',
  adminLimiter,
  auth,
  isAdmin("ADMIN"),
  upload.single('file'),
  productController.bulkImportProducts
);


module.exports = router;