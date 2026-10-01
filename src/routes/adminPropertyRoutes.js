import express from 'express';

import { approvePropertyContoller, getPendingPropertiesController, rejectPropertyController } from '../controllers/adminPropertyController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get all pending properties
router.get(
  "/pending",
  authenticate,
  authorizeRoles("ADMIN"),
  getPendingPropertiesController
);

// Approve property
router.patch(
  "/:id/approve",
  authenticate,
  authorizeRoles("ADMIN"),
  approvePropertyContoller
);

// Reject property
router.patch(
  "/:id/reject",
  authenticate,
  authorizeRoles("ADMIN"),
  rejectPropertyController
);

// module.exports = router;
export default router;