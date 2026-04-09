const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

const Role = mongoose.model('Role', roleSchema, "roles");

module.exports = Role;
