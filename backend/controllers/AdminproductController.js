//backend/controller/AdminproductController.js
const Product = require('../models/AdminProduct');
const fs = require('fs'); // Files delete karne ke liye
const excelJS = require("exceljs");
const Review = require("../models/Review");
const path = require("path");
const mongoose = require("mongoose");

exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.min(100, parseInt(limit));

    let query = {}; // ✅ FIXED

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: safeSearch, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" }); // ❌ hide internal error
  }
};


// User ke liye 
exports.getPublicProducts = async (req, res) => {
  try {
    // isActive: true  check karna safe rehta hai
    const products = await Product.find({ isActive: true }).lean();

    // Har product ke liye uska average nikaalna
    const productsWithRating = await Promise.all(products.map(async (product) => {
      const reviews = await Review.find({ productId: product._id, status: "active" });

      const reviewsCount = reviews.length;
      const averageRating = reviewsCount > 0
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewsCount
        : 0;

      return { ...product, averageRating, reviewsCount };
    }));

    res.status(200).json({ products: productsWithRating });
  } catch (error) {
    console.error("Public Products Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      unitPrice,
      currentStock
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const productData = {
      name,
      description,
      category,
      brand,
      unitPrice: Number(unitPrice) || 0,
      currentStock: Number(currentStock) || 0
    };

    // ✅ Safe file handling
    if (req.files) {
      if (req.files.thumbnail) productData.thumbnail = req.files.thumbnail[0].filename;
      if (req.files.images) productData.images = req.files.images.map(file => file.filename);
      if (req.files.metaImage) productData.metaImage = req.files.metaImage[0].filename;
    }

    const newProduct = await Product.create(productData);

    res.status(201).json({
      message: "Product Added Successfully",
      product: newProduct
    });

  } catch (err) {
    res.status(500).json({ message: "Add failed" });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id, field } = req.body;

     // 🔐 ADD HERE
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const allowedFields = ["isActive", "isFeatured"];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product[field] = !product[field];
    await product.save();

    res.json({
      message: "Status Updated",
      status: product[field]
    });

  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

     // 🔐 ADD HERE
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const uploadPath = path.join(__dirname, "../uploads");

    if (product.thumbnail) {
      fs.unlink(path.join(uploadPath, product.thumbnail), () => { });
    }

    if (product.images?.length) {
      product.images.forEach(img => {
        fs.unlink(path.join(uploadPath, img), () => { });
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.bulkImportProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an excel file!" });
    }

    if (products.length > 1000) {
      return res.status(400).json({ message: "Too many records" });
    }

    const filePath = req.file.path;
    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1); // Pehli sheet uthayenge
    const products = [];

    // Row-by-row data read karein (Row 1 headers hote hain, isliye row 2 se start karenge)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const productInfo = {
          name: row.getCell(1).value?.toString(),
          description: row.getCell(2).value?.toString(),
          category: row.getCell(3).value?.toString(),
          brand: row.getCell(4).value?.toString(),
          unitPrice: Number(row.getCell(5).value) || 0,
          currentStock: Number(row.getCell(6).value) || 0,
          sku: row.getCell(7).value?.toString() || `SKU-${Date.now()}-${rowNumber}`,
          isActive: true
        };
        products.push(productInfo);
      }
    });

    // Database mein bulk insert
    if (products.length > 0) {
      await Product.insertMany(products);
    }

    // Uploaded temp file ko delete karein
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: `${products.length} Products imported successfully!`,
      total: products.length
    });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path); // Error aane par file saaf karein
    res.status(500).json({ message: "Bulk import failed", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

     // 🔐 ADD HERE
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const allowedFields = ["name", "description", "unitPrice", "currentStock"];

    let updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};