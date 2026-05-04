const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shopName: { type: String, required: true },
  shopAddress: { type: String, required: true },
  vendorImage: { type: String }, // Stores file path
  shopLogo: { type: String },    // Stores file path
  shopBanner: { type: String },  // Stores file path
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] }
}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);