const Store = require("../models/Store");
const fs = require("fs");
const path = require("path");

// ================== CLEAN DELETE FUNCTION ==================
const deleteFile = (filename) => {
  try {
    if (!filename) return;

    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("File delete error:", err.message);
  }
};

// ================== GET ALL STORES ==================
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stores",
      error: error.message
    });
  }
};

// ================== CREATE STORE ==================
exports.createStore = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobile,
      email,
      password,
      confirmPassword,
      shopName,
      shopAddress
    } = req.body;

    // PASSWORD CHECK
    if (password !== confirmPassword) {
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (file?.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      return res.status(400).json({
        message: "Passwords do not match!"
      });
    }

    // ✅ ONLY STORE FILENAMES (PRODUCTION RULE)
    const vendorImage = req.files?.vendorImage?.[0]?.filename || null;
    const shopLogo = req.files?.shopLogo?.[0]?.filename || null;
    const shopBanner = req.files?.shopBanner?.[0]?.filename || null;

    const newStore = new Store({
      firstName,
      lastName,
      mobile,
      email,
      password, // 🔥 (bcrypt recommended in real production)
      shopName,
      shopAddress,
      vendorImage,
      shopLogo,
      shopBanner
    });

    await newStore.save();

    res.status(201).json({
      message: "Store created successfully",
      store: newStore
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ================== UPDATE STORE ==================
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updateData = { ...req.body };

    if (req.files) {

      // vendor image
      if (req.files.vendorImage) {
        deleteFile(store.vendorImage);
        updateData.vendorImage = req.files.vendorImage[0].filename;
      }

      // shop logo
      if (req.files.shopLogo) {
        deleteFile(store.shopLogo);
        updateData.shopLogo = req.files.shopLogo[0].filename;
      }

      // shop banner
      if (req.files.shopBanner) {
        deleteFile(store.shopBanner);
        updateData.shopBanner = req.files.shopBanner[0].filename;
      }
    }

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Store updated successfully",
      store: updatedStore
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message
    });
  }
};

// ================== PATCH STORE ==================
exports.patchStore = async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedStore);

  } catch (error) {
    res.status(500).json({
      message: "Patch failed",
      error: error.message
    });
  }
};

// ================== DELETE STORE ==================
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // delete images safely
    deleteFile(store.vendorImage);
    deleteFile(store.shopLogo);
    deleteFile(store.shopBanner);

    await Store.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Store and assets deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });
  }
};