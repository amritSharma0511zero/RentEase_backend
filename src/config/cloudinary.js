import "dotenv/config";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configuration:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    ? "FOUND"
    : "MISSING",

  api_key: process.env.CLOUDINARY_API_KEY
    ? "FOUND"
    : "MISSING",

  api_secret: process.env.CLOUDINARY_API_SECRET
    ? "FOUND"
    : "MISSING",
});

export default cloudinary;