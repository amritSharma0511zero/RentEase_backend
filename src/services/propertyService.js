import Property from "../models/Property.js";

import AppError from "../utils/AppError.js";

export const createProperty = async (propertyData, ownerId) => {
  const property = await Property.create({
    ...propertyData,
    owner: ownerId,
  });

  return property;
};

// export const getAllProperties = async () => {
//   const properties = await Property.find({
//     status: "APPROVED",
//   })
//     .populate("owner", "name email phone")
//     .sort({ createdAt: -1 });

//   return properties;
// };

export const getAllProperties = async (queryParams) => {
  const {
    search,
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    amenities,
    sort,
    page = 1,
    limit = 10,
  } = queryParams;

  // Base filter
  const filter = {
    status: "APPROVED",
  };

  // Search by title, description or city
  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        "location.city": {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // City filter
  if (city) {
    filter["location.city"] = {
      $regex: city,
      $options: "i",
    };
  }

  // Property type
  if (propertyType) {
    filter.propertyType = propertyType;
  }

  // Listing type
  if (listingType) {
    filter.listingType = listingType;
  }

  // Minimum price
  if (minPrice) {
    filter.price = {
      ...filter.price,
      $gte: Number(minPrice),
    };
  }

  // Maximum price
  if (maxPrice) {
    filter.price = {
      ...filter.price,
      $lte: Number(maxPrice),
    };
  }

  // Bedrooms
  if (bedrooms) {
    filter.bedrooms = Number(bedrooms);
  }

  // Bathrooms
  if (bathrooms) {
    filter.bathrooms = Number(bathrooms);
  }

  // Amenities
  if (amenities) {
    const amenitiesArray = amenities
      .split(",")
      .map((item) => item.trim());

    filter.amenities = {
      $all: amenitiesArray,
    };
  }

  // Pagination
  const currentPage = Math.max(Number(page), 1);
  const itemsPerPage = Math.min(
    Math.max(Number(limit), 1),
    50
  );

  const skip =
    (currentPage - 1) * itemsPerPage;

  // Sorting
  let sortOption = {
    createdAt: -1,
  };

  if (sort === "price_asc") {
    sortOption = {
      price: 1,
    };
  }

  if (sort === "price_desc") {
    sortOption = {
      price: -1,
    };
  }

  if (sort === "newest") {
    sortOption = {
      createdAt: -1,
    };
  }

  if (sort === "oldest") {
    sortOption = {
      createdAt: 1,
    };
  }

  if (sort === "popular") {
    sortOption = {
      views: -1,
    };
  }

  // Get properties
  const properties = await Property.find(filter)
    .populate("owner", "name email phone")
    .sort(sortOption)
    .skip(skip)
    .limit(itemsPerPage);

  // Total count
  const totalProperties =
    await Property.countDocuments(filter);

  const totalPages = Math.ceil(
    totalProperties / itemsPerPage
  );

  return {
    properties,
    pagination: {
      currentPage,
      itemsPerPage,
      totalProperties,
      totalPages,
      hasNextPage:
        currentPage < totalPages,
      hasPreviousPage:
        currentPage > 1,
    },
  };
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