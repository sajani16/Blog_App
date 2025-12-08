const cloudinary = require("cloudinary").v2;

async function uploadImage(imagePath) {
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
    await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadImage, deleteImageCloudinary };
