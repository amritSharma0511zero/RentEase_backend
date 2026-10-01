// const Property = require("../models/Property");
import Property from "../models/Property.js";
// const AppError = require("../utils/AppError");
import AppError from "../utils/AppError.js";

export const getPendingProperties = async () => {
  const properties = await Property.find({
    status: "PENDING",
  })
    .populate("owner", "name email phone")
    .sort({ createdAt: -1 });

  return properties;
};

export const approveProperty = async (propertyId) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.status === "APPROVED") {
    throw new AppError(
      "Property is already approved",
      400
    );
  }

  if (property.status === "REJECTED") {
    throw new AppError(
      "Rejected property cannot be approved directly",
      400
    );
  }

  property.status = "APPROVED";

  await property.save();

  return property;
};

export const rejectProperty = async (propertyId) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.status === "APPROVED") {
    throw new AppError(
      "Approved property cannot be rejected",
      400
    );
  }

  property.status = "REJECTED";

  await property.save();

  return property;
};

// module.exports = {
//   getPendingProperties,
//   approveProperty,
//   rejectProperty,
// };