const mongoose = require("mongoose");
const generate = require("../helpers/generate.js")
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,

    friendList: [
      {
        user_id: String,
        room_chat_id: String
      }
    ], //danh sách bạn bè của ô A
    
    acceptFriends: Array,//Danh sách người gửi kb cho ô A
    requestFriends: Array,//Danh sách người mà ô A gửi kb
    statusOnline: String,
    status: {
        type: String,
        default: "active"
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

const User = mongoose.model('User', userSchema, "users");

module.exports = User;
