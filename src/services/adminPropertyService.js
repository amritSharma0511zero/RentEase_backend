// const Property = require("../models/Property");
import Property from "../models/Property.js";
// const AppError = require("../utils/AppError");
import AppError from "../utils/AppError.js";
import { createNotification } from "./notificationService.js";

export const getPropertiesByStatus = async (status) => {
  const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "SOLD", "RENTED"];

  if (status && !allowedStatuses.includes(status)) {
    throw new AppError("Invalid property status", 400);
  }

  const filter = status ? { status } : {};

  const properties = await Property.find(filter)
    .populate("owner", "name email phone")
    .sort({ createdAt: -1 });

  return properties;
};

export const getPropertyById = async (propertyId) => {
  const property = await Property.findById(propertyId).populate(
    "owner",
    "name email phone",
  );

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  return property;
};

export const approveProperty = async (propertyId) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.status === "APPROVED") {
    throw new AppError("Property is already approved", 400);
  }

  if (property.status === "REJECTED") {
    throw new AppError("Rejected property cannot be approved directly", 400);
  }

  property.status = "APPROVED";
  property.rejectionReason = null;

  await property.save();

  await createNotification({
    recipient: property.owner,
    type: "PROPERTY_APPROVED",
    title: "Property Approved",
    message: `Your property "${property.title}" has been approved and is now visible to users.`,
    property: property._id,
  });

  return property;
};

export const rejectProperty = async (propertyId, rejectionReason) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.status === "APPROVED") {
    throw new AppError("Approved property cannot be rejected", 400);
  }

  if (!rejectionReason) {
    throw new AppError("Rejection reason is required", 400);
  }

  property.status = "REJECTED";
  property.rejectionReason = rejectionReason.trim();

  await property.save();

  await createNotification({
    recipient: property.owner,
    type: "PROPERTY_REJECTED",
    title: "Property Rejected",
    message: `Your property "${property.title}" was rejected. Reason: ${rejectionReason.trim()}`,
    property: property._id,
  });

  return property;
};

// module.exports = {
//   getPendingProperties,
//   approveProperty,
//   rejectProperty,
// };
