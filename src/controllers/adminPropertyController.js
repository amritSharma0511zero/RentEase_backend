// const adminPropertyService = require("../services/adminPropertyService");
import { approveProperty, rejectProperty, getPropertyById, getPropertiesByStatus } from "../services/adminPropertyService.js";


export const getPropertiesController = async (
  req,
  res,
  next
) => {
  try {
    const properties =
      await 
        getPropertiesByStatus(
          req.query.status
        );

    res.status(200).json({
      success: true,
      data: {
        properties,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyByIdController = async (
  req,
  res,
  next
) => {
  try {
    const property =
      await getPropertyById(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        property,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const approvePropertyContoller = async (
  req,
  res,
  next
) => {
  try {
    const property =
      await approveProperty(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Property approved successfully",
      data: {
        property,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectPropertyController = async (
  req,
  res,
  next
) => {
  try {
    const property =
      await rejectProperty(
        req.params.id,
        rejectionReason
      );

    res.status(200).json({
      success: true,
      message: "Property rejected successfully",
      data: {
        property,
      },
    });
  } catch (error) {
    next(error);
  }
};

// module.exports = {
//   getPendingProperties,
//   approveProperty,
//   rejectProperty,
// };