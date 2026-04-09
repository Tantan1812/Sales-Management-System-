const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');

// Sử dụng plugin slug cho Mongoose
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    product_category_id: { type: String, default: "" },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", // Tạo slug từ trường "title"
      unique: true   // Đảm bảo slug là duy nhất
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    deleted: { type: Boolean, default: false },
    // deletedAt: Date
    deletedBy: { 
      account_id: String,
      deletedAt: Date
    },
    updatedBy: { 
      account_id: String,
      updatedAt: Date
    },
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;
