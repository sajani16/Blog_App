const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
async function cloudinaryConfig(params) {
  try {
    // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("cloudinary running");
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = cloudinaryConfig;
