import express from 'express';

import { approvePropertyContoller, getPropertiesController, getPropertyByIdController, rejectPropertyController } from '../controllers/adminPropertyController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { createNotification } from '../services/notificationService.js';

const router = express.Router();


router.use(
  authenticate,
  authorizeRoles("ADMIN")
);

// Get all pending properties

router.get(
  "/",
  getPropertiesController
);

router.get(
  "/:id",
  getPropertyByIdController
);

// Approve property
router.patch(
  "/:id/approve",
  approvePropertyContoller
);

// Reject property
router.patch(
  "/:id/reject",
  rejectPropertyController
);

// module.exports = router;
export default router;