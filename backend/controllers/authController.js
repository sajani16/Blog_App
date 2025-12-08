const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({
        message: "All fields required",
      });
    const existinguser = await User.findOne({ email });
    if (existinguser)
      return res.json({ success: false, message: "User already exist." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    //await bcrypt.hash(password,10) shortcut

    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user._id, user.name, user.email);
    console.log(token);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      success: true,
      message: "Register successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({
        message: "All fields required",
      });
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User doesnt exist signin" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.json({
        message: "Invalid credentails",
      });
    const token = generateToken(user._id, user.email);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,

        message: "Login successful",
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "login in failed" });
  }
}

module.exports = { register, login };
