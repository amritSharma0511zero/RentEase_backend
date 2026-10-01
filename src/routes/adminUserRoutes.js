import express from 'express';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { blockUserController, deleteUserController, getAllUsersController, getUserByIdController, unblockUserController } from '../controllers/adminUserController.js';

const router = express.Router();

router.use(
  authenticate,
  authorizeRoles("ADMIN")
);

// Get all users
// ?role=USER
// ?role=OWNER
router.get(
  "/",
  getAllUsersController
);

// Get single user
router.get(
  "/:id",
  getUserByIdController
);

// Block user
router.patch(
  "/:id/block",
  blockUserController
);

// Unblock user
router.patch(
  "/:id/unblock",
  unblockUserController
);

// Delete user
router.delete(
  "/:id",
  deleteUserController
);

export default router;