const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ================= ADD PRODUCT ================= //
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      storeId,
      category,
      subCategory,
      subSubCategory,
      brand,
      productType,
      sku,
      unit,
      unitPrice,
      minOrderQty,
      currentStock,
      discountType,
      discountAmount,
      taxAmount,
      taxCalculation,
      shippingCost,
      multiplyQty,
      videoLink,
      metaTitle,
      metaDescription,
      listingType,
      description,
      tags
    } = req.body;

    if (!name || !storeId) {
      return res.status(400).json({ message: "Name & Store required" });
    }

    const price = Number(unitPrice) || 0;
    const stock = Number(currentStock) || 0;
    const minQty = Number(minOrderQty) || 1;

    if (price < 0 || stock < 0 || minQty < 0) {
      return res.status(400).json({ message: "Invalid numeric values" });
    }


    const thumbnail = req.files?.thumbnail?.[0]?.filename || null;

    const images =
      req.files?.images?.map((file) => file.filename) || [];

    const metaImage = req.files?.metaImage?.[0]?.filename || null;

    const product = await Product.create({
      name,
      description,
      storeId,
      category,
      subCategory,
      subSubCategory,
      brand,
      productType,
      sku,
      unit,
      price,
      minOrderQty: minQty,
      stock,
      discountType,
      discountAmount: Number(discountAmount) || 0,
      taxAmount: Number(taxAmount) || 0,
      taxCalculation,
      shippingCost: Number(shippingCost) || 0,
      multiplyQty: multiplyQty === "true",
      videoLink,
      metaTitle,
      metaDescription,
      listingType,

      // images
      image: thumbnail,
      images,
      metaImage,

      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET ALL PRODUCTS ================= //
exports.getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.min(50, parseInt(limit));

    const query = { isDeleted: false };

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });

  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET SINGLE PRODUCT ================= //
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);

  } catch (err) {
    console.error("Get Single Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE PRODUCT ================= //
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updateData = { ...req.body };

    // ================= IMAGE UPDATE =================
    if (req.files) {

      if (req.files.thumbnail) {
        updateData.image = req.files.thumbnail[0].filename;
      }

      if (req.files.metaImage) {
        updateData.metaImage = req.files.metaImage[0].filename;
      }

      if (req.files.images) {
        updateData.images = req.files.images.map(f => f.filename);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};


// ================= DELETE PRODUCT ================= //
const deleteFile = (filename) => {
  if (!filename) return;

  const filePath = path.join(__dirname, "../uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    // cleanup images
    deleteFile(product.image);

    if (product.images?.length) {
      product.images.forEach(img => deleteFile(img));
    }

    deleteFile(product.metaImage);

    // soft delete
    product.isDeleted = true;
    await product.save();

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};