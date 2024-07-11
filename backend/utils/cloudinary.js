import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return { url: response.url, publicId: response.public_id };
  } catch (error) {
    console.log("Error uploading file to cloudinary");
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    // Delete file from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return response.result === "ok";
  } catch (error) {
    console.error("Error deleting file from Cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
