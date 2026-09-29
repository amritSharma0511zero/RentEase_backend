import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createPropertyController,
  deletePropertyController,
  getAllPropertiesController,
  getMyPropertiesController,
  getPropertyByIdController,
  updatePropertyController,
} from "../controllers/propertyController.js";
const router = express.Router();

// Public routes

router.get("/", getAllPropertiesController);

router.get("/:id", getPropertyByIdController);

// Owner routes

router.post("/", authenticate, authorizeRoles("OWNER"), createPropertyController);

router.get(
  "/owner/my-properties",
  authenticate,
  authorizeRoles("OWNER"),
  getMyPropertiesController,
);

router.put("/:id", authenticate, authorizeRoles("OWNER"), updatePropertyController);

router.delete("/:id", authenticate, authorizeRoles("OWNER"), deletePropertyController);

export default router;
