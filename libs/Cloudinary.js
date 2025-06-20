import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});


 export const FileUploadToCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) {
      throw new Error("Local file path is missing");
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
    });

    // Remove the locally saved temporary file after uploading
    fs.unlinkSync(localFilePath);

    return result.secure_url; // or return result if you need more data
  } catch (error) {
    console.error("Error uploading image to Cloudinary", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};