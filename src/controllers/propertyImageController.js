// const Property = require("../models/Property");
import Property from "../models/Property.js";
// const AppError = require("../utils/AppError");
import AppError from "../utils/AppError.js";
// const uploadToCloudinary = require("../utils/uploadToCloudinary");
import { uploadToCloudinary,deleteFromCloudinary } from "../utils/uploadToCloudinary.js";

export const uploadPropertyImages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    // Check property ownership
    if (property.owner.toString() !== req.user.id.toString()) {
      throw new AppError(
        "You are not allowed to upload images to this property",
        403,
      );
    }

    if (!req.files || req.files.length === 0) {
      throw new AppError("Please upload at least one image", 400);
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    property.images.push(...uploadedImages);

    await property.save();

    // property.images.push(...uploadedImages.map((image) => image.url));
    property.images.push(...uploadedImages);

    await property.save();

    res.status(200).json({
      success: true,
      message: "Property images uploaded successfully",
      data: {
        images: property.images,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePropertyImage = async (
  req,
  res,
  next
) => {
  try {
    const { id, imageId } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      throw new AppError(
        "Property not found",
        404
      );
    }

    // Check ownership
    if (
      property.owner.toString() !==
      req.user.id.toString()
    ) {
      throw new AppError(
        "You are not allowed to modify this property",
        403
      );
    }

    // Find image by MongoDB subdocument ID
    const image = property.images.id(imageId);

    if (!image) {
      throw new AppError(
        "Property image not found",
        404
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(
      image.publicId
    );

    // Delete from MongoDB
    image.deleteOne();

    await property.save();

    res.status(200).json({
      success: true,
      message: "Property image deleted successfully",
      data: {
        images: property.images,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const replacePropertyImage = async (
  req,
  res,
  next
) => {
  try {
    const { id, imageId } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      throw new AppError(
        "Property not found",
        404
      );
    }

    // Check ownership
    if (
      property.owner.toString() !==
      req.user.id.toString()
    ) {
      throw new AppError(
        "You are not allowed to modify this property",
        403
      );
    }

    if (!req.file) {
      throw new AppError(
        "Please upload an image",
        400
      );
    }

    const image = property.images.id(imageId);

    if (!image) {
      throw new AppError(
        "Property image not found",
        404
      );
    }

    // Delete old image
    await deleteFromCloudinary(
      image.publicId
    );

    // Upload new image
    const result = await uploadToCloudinary(
      req.file.buffer
    );

    // Update MongoDB
    image.url = result.secure_url;
    image.publicId = result.public_id;

    await property.save();

    res.status(200).json({
      success: true,
      message: "Property image replaced successfully",
      data: {
        image,
      },
    });
  } catch (error) {
    next(error);
  }
};
// module.exports = {
//   uploadPropertyImages,
// };
