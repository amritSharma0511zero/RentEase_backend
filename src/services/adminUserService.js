// const User = require("../models/User");
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

export const getAllUsers = async (role) => {
  const filter = {};

  if (role) {
    const allowedRoles = [
      "USER",
      "OWNER",
      "ADMIN",
    ];

    if (!allowedRoles.includes(role)) {
      throw new AppError(
        "Invalid user role",
        400
      );
    }

    filter.role = role;
  }

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });

  return users;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-password");

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return user;
};

export const blockUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  if (user.role === "ADMIN") {
    throw new AppError(
      "Admin users cannot be blocked",
      400
    );
  }

  if (user.isBlocked) {
    throw new AppError(
      "User is already blocked",
      400
    );
  }

  user.isBlocked = true;

  await user.save();

  return user;
};

export const unblockUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  if (!user.isBlocked) {
    throw new AppError(
      "User is already active",
      400
    );
  }

  user.isBlocked = false;

  await user.save();

  return user;
};

export const deleteUser = async (
  userId,
  adminId
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  if (
    user._id.toString() ===
    adminId.toString()
  ) {
    throw new AppError(
      "You cannot delete your own admin account",
      400
    );
  }

  if (user.role === "ADMIN") {
    throw new AppError(
      "Admin accounts cannot be deleted",
      400
    );
  }

  await User.findByIdAndDelete(userId);

  return true;
};
