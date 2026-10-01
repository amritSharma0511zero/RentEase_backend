import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  deletePropertyImage,
  replacePropertyImage,
  uploadPropertyImages,
} from "../controllers/propertyImageController.js";
import upload from "../middleware/uploadMiddleware.js";
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

//owner routes
router.get(
  "/owner/my-properties",
  authenticate,
  authorizeRoles("OWNER"),
  getMyPropertiesController,
);

router.get("/:id", getPropertyByIdController);

// Owner routes

router.post(
  "/",
  authenticate,
  authorizeRoles("OWNER"),
  createPropertyController,
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("OWNER"),
  updatePropertyController,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("OWNER"),
  deletePropertyController,
);

// Property images  -- Only owner
router.post(
  "/:id/images",
  authenticate,
  authorizeRoles("OWNER"),
  upload.array("images", 10),
  uploadPropertyImages,
);

router.delete(
  "/:id/images/:imageId",
  authenticate,
  authorizeRoles("OWNER"),
  deletePropertyImage,
);

router.put(
  "/:id/images/:imageId",
  authenticate,
  authorizeRoles("OWNER"),
  upload.single("image"),
  replacePropertyImage
);

export default router;
