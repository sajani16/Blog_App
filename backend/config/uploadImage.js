const cloudinary = require("cloudinary").v2;

async function uploadImage(imagePath) {
  if (!imagePath) {
    throw new Error("Image path is required");
  }
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "blog-app",
    });
    return { secure_url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
  }
}

async function deleteImageCloudinary(imageId) {
  try {
    const result = await cloudinary.uploader.destroy(imageId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
}

module.exports = { uploadImage, deleteImageCloudinary };
