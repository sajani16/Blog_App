const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  createComment,
  deleteComment,
  updateComment,
  getComment,
} = require("../controllers/blogController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/multer");
const route = express.Router();

route.post("/createblogs", protect, upload.single("image"), createBlog);
route.get("/getblogs", getBlogs);
route.get("/getblog/:id", getBlog);
route.put("/updateblog/:id", protect, upload.single("image"), updateBlog);
route.delete("/deleteblog/:id", protect, deleteBlog);

//likes
route.post("/likeblog/:id", protect, likeBlog);

//comment
route.post("/createcomment/:id", protect, createComment);
route.get("/getcomment/:id", protect, getComment);
route.delete("/deletecomment/:id", protect, deleteComment);
route.put("/updatecomment/:id", protect, updateComment);

module.exports = route;
