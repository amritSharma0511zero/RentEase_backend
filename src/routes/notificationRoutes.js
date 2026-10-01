import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getMyNotifications, markAllAsRead, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.use(authenticate);

// Get current user's notifications
router.get(
  "/",
  getMyNotifications
);

// Mark all as read
router.patch(
  "/read-all",
  markAllAsRead
);

// Mark one notification as read
router.patch(
  "/:id/read",
  markAsRead
);

// module.exports = router;
export default router;