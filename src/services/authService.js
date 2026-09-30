import bcrypt from "bcryptjs";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "USER",
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isBlocked) {
    throw new AppError("Your account has been blocked", 403);
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  // console.log("this is get Current User", user);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const refreshUserToken = async (refreshToken) => {
//   const {
//     verifyRefreshToken,
//     generateAccessToken,
//   } = require("../utils/token");

  const {verifyRefreshToken,generateAccessToken} = require("../utils/token.js");

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isBlocked) {
    throw new AppError("Your account has been blocked", 403);
  }

  const accessToken = generateAccessToken(user);

  return accessToken;
};