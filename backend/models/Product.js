const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },

    description: { type: String, required: [true, "Product description is required"], trim: true },

    price: { type: Number, required: [true, "Product price is required"], min: [0, "Price cannot be negative"] },

    rating: { type: Number, default: 0, min: [0, "Rating cannot be less than 0"], max: [5, "Rating cannot be more than 5"] },

    stock: { type: Number, required: [true, "Stock is required"], min: [0, "Stock cannot be negative"] },

    image: { type: String, required: [true, "Product image is required"] },

    category: { type: String, required: [true, "Category is required"], trim: true },

    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, },

    isFeatured: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Product", productSchema);
