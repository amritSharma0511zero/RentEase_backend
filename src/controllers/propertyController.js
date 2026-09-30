import {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
} from "../services/propertyService.js";

export const createPropertyController = async (req, res, next) => {
  try {
    const property = await createProperty(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPropertiesController = async (req, res, next) => {
  try {
    const properties = await getAllProperties(req.query);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyByIdController = async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);

    res.status(200).json({
      success: true,
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPropertiesController = async (req, res, next) => {
  try {
    const properties = await getMyProperties(req.user.id);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePropertyController = async (req, res, next) => {
  try {
    const property = await updateProperty(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePropertyController = async (req, res, next) => {
  try {
    await deleteProperty(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};