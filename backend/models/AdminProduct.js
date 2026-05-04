//backend/models/AdminProduct.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String },
  subSubCategory: { type: String },
  brand: { type: String },
  productType: { type: String, default: 'Physical' },
  sku: { type: String, unique: true },
  unit: { type: String },
  tags: [String],
  unitPrice: { type: Number, required: true },
  minOrderQty: { type: Number, default: 1 },
  currentStock: { type: Number, default: 0 },
  discountType: { type: String, enum: ['Flat', 'Percent'], default: 'Flat' },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  taxCalculation: { type: String, default: 'Include with product' },
  shippingCost: { type: Number, default: 0 },
  multiplyQty: { type: Boolean, default: false },
  thumbnail: { type: String }, // Image Path
  images: [String],           // Array of Image Paths
  videoLink: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaImage: { type: String },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: [true, "Product must belong to a Store"]},
  isFeatured: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  listingType: { 
    type: String, 
    enum: ['BESTSELLER', 'NEW ARRIVAL', 'COMBOS'], 
    default: 'BESTSELLER' 
  },
}, { timestamps: true });

module.exports = mongoose.model('AdminProduct', productSchema);