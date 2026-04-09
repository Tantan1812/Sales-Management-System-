const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');

// Sử dụng plugin slug cho Mongoose
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    parent_id: {
        type: String, 
        default: "" 
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", // Tạo slug từ trường "title"
      unique: true   // Đảm bảo slug là duy nhất
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-category");

module.exports = ProductCategory;
