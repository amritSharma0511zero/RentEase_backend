import express from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get(
  "/owner-test",
  authenticate,
  authorizeRoles("OWNER"),
  (req, res) => {
    res.json({
      success: true,
      message: "Owner route accessed successfully",
    });
  }
);

export default router;
