import Property from "../models/Property.js";

import AppError from "../utils/AppError.js";

export const createProperty = async (propertyData, ownerId) => {
  const property = await Property.create({
    ...propertyData,
    owner: ownerId,
  });

  return property;
};

export const getAllProperties = async () => {
  const properties = await Property.find({
    status: "APPROVED",
  })
    .populate("owner", "name email phone")
    .sort({ createdAt: -1 });

  return properties;
};

export const getPropertyById = async (propertyId) => {
  const property = await Property.findById(propertyId).populate(
    "owner",
    "name email phone"
  );

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  return property;
};

export const getMyProperties = async (ownerId) => {
  const properties = await Property.find({
    owner: ownerId,
  }).sort({ createdAt: -1 });

  return properties;
};

export const updateProperty = async (
  propertyId,
  ownerId,
  updateData
) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.owner.toString() !== ownerId.toString()) {
    throw new AppError(
      "You are not allowed to update this property",
      403
    );
  }

  const updatedProperty =
    await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

  return updatedProperty;
};

export const deleteProperty = async (
  propertyId,
  ownerId
) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.owner.toString() !== ownerId.toString()) {
    throw new AppError(
      "You are not allowed to delete this property",
      403
    );
  }

  await Property.findByIdAndDelete(propertyId);

  return true;
};

// module.exports = {
//   createProperty,
//   getAllProperties,
//   getPropertyById,
//   getMyProperties,
//   updateProperty,
//   deleteProperty,
// };