import Notification from "../models/Notification.js";

export const createNotification = async ({
  recipient,
  type,
  title,
  message,
  property,
}) => {
  const notification =
    await Notification.create({
      recipient,
      type,
      title,
      message,
      property: property || null,
    });

  return notification;
};

export const getUserNotifications = async (
  userId
) => {
  const notifications =
    await Notification.find({
      recipient: userId,
    })
      .populate(
        "property",
        "title price status"
      )
      .sort({ createdAt: -1 });

  return notifications;
};

export const markNotificationAsRead = async (
  notificationId,
  userId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

  if (!notification) {
    const AppError = require(
      "../utils/AppError"
    );

    throw new AppError(
      "Notification not found",
      404
    );
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};

export const markAllNotificationsAsRead =
  async (userId) => {
    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return true;
  };

// module.exports = {
//   createNotification,
//   getUserNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// };