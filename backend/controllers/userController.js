const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { uploadImage } = require("../config/uploadImage");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let imageUrl = "";
    let imageId = "";

    if (req.file) {
      const upload = await uploadImage(req.file.path);
      imageUrl = upload.secure_url;
      imageId = upload.public_id;
      fs.unlinkSync(req.file.path);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      image: imageUrl,
      imageId,
    });

    // const token = generateToken(user._id, user.email);

    return res.json({
      success: true,
      message: "User created successfully",
      user,
      // token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    if (users.length == 0)
      return res.json({ success: false, message: "No user found" });
    return res.json({
      success: true,
      message: "User fetched successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
}

async function getUser(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ success: false, message: "No user found" });

    return res.json({
      success: true,
      message: "User fetched successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || null, // always defined
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
}

async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;

    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // ---- basic field updates ----
    if (name) user.name = name;
    if (email) user.email = email;

    // ---- password update (ONLY if provided) ----
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    // ---- image update (ONLY if file uploaded) ----
    if (req.file) {
      const { secure_url, public_id } = await uploadImage(req.file.path);

      if (user.imageId) {
        await cloudinary.uploader.destroy(user.imageId);
      }

      user.image = secure_url;
      user.imageId = public_id;

      fs.unlinkSync(req.file.path);
    }

    await user.save();

    return res.json({
      success: true,
      message: "User updated successfully",
      updatedUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    console.log(user);
    return res.json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
}

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
