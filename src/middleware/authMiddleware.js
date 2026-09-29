// const {
//   verifyAccessToken,
// } = require("../utils/token");

import { verifyAccessToken } from "../utils/token.js";

// const AppError = require("../utils/AppError");
import AppError from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(
      new AppError(
        "Invalid or expired access token",
        401
      )
    );
  }
};

// module.exports = authenticate;