
import { getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../services/notificationService.js";

export const getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await getUserNotifications(
          req.user.id
        );

    res.status(200).json({
      success: true,
      data: {
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await markNotificationAsRead(
          req.params.id,
          req.user.id
        );

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    await markAllNotificationsAsRead(
        req.user.id
      );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

