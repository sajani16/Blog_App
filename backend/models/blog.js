const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: String,
  draft: {
    type: Boolean,
    default: false,
  },
  imageId: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //connecting user model with blog
    require: true,
  },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
