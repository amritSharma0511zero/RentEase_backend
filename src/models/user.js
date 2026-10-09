// const mongoose = require("mongoose");
import mongoose from "mongoose";

const toIST = (date) => {
  if (!date) return date;

  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "OWNER", "ADMIN"],
      default: "USER",
    },

    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.createdAt = toIST(ret.createdAt);
        ret.updatedAt = toIST(ret.updatedAt);
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

// module.exports = User;
export default User;