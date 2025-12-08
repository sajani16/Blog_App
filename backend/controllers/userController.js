const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { uploadImage } = require("../config/uploadImage");
const fs = require("fs");

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const { secure_url, public_id } = await uploadImage();
    const image = req.file;
    if (!name || !email || !password)
      return res.json({
        message: "All fields required",
      });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashed,
      image: secure_url,
      imageId: public_id,
    });
    const token = generateToken(user._id, user.email);
    fs.unlinkSync(image.path);
    return res.json({
      success: true,
      message: "User created successfully",
      user,
      token,
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
    const token = generateToken(user._id, user.email);
    // const user = User.findOne(id);
    if (!user) return res.json({ message: "No user found" });
    console.log(user);

    return res.json({
      success: true,
      message: "User fetched successfully",
      user,
      token,
      // user: {
      //   name: user.name,
      //   email: user.email,
      // },
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
    const hashed = await bcrypt.hash(password, 10);

    const updateduser = await User.findByIdAndUpdate(
      id,
      { name, email, password: hashed },
      { new: true }
    );

    console.log(updateduser);
    return res.json({
      success: true,
      message: "User updated successfully",
      updateduser: {
        name: updateduser.name,
        email: updateduser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating user" });
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
