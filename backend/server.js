const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cloudinaryConfig = require("./config/cloudinary");
dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.get("/", (req, res) => {
res.send("Get is running");
});

app.listen(PORT, () => {
  dbConnect();
  cloudinaryConfig();
  console.log("Server Running Successfully");
});
