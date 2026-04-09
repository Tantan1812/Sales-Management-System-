const mongoose = require("mongoose");
const generate = require("../helpers/generate.js")
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: { 
        type: Date,  
        expires: 0,
        default: () => new Date(Date.now() + 180 * 1000), // 180 giây sau
    },
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

forgotPasswordSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;
