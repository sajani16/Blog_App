const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");
const { uploadImage, deleteImageCloudinary } = require("../config/uploadImage");
const fs = require("fs");

async function createBlog(req, res) {
  try {
    const { title, description, draft } = req.body;
    const image = req.file;
    const author = req.user.id;
    if (!title || !description || !author || !image) {
      return res.json({ success: false, message: "All fields are required." });
    }
    const validAuthor = await User.findById(author);
    if (!validAuthor)
      return res.json({
        message: "Invalid user",
      });

    const { secure_url, public_id } = await uploadImage(image.path);
    const blog = await Blog.create({
      title,
      description,
      draft,
      author,
      image: secure_url,
      imageId: public_id,
    });
    fs.unlinkSync(image.path);

    await User.findByIdAndUpdate(author, { $push: { blogs: blog._id } });
    return res.json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating blog" });
  }
}
async function getBlogs(req, res) {
  try {
    const blogs = await Blog.find({})
      .populate({
        path: "author",
        select: "name image",
      })
      .populate({
        path: "like",
        select: "name",
      })
      .populate({
        path: "comment",
        // select: "user",
        populate: {
          path: "user",
          select: "name",
        },
      });
    // const blogs = await Blog.find({}).populate("author");
    // const blogs1 = await Blog.find({draft:false});
    if (blogs.length == 0) return res.json({ message: "No blogs posted" });
    return res.json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching blog" });
  }
}
async function getBlog(req, res) {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id)
      .populate({
        path: "author",
        select: "name",
      })
      .populate({
        path: "like",
        select: "name",
      });
    console.log(blog);
    return res.json({
      success: true,
      message: "Fetched successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching blog" });
  }
}
async function updateBlog(req, res) {
  try {
    const blogId = req.params.id;
    const { title, description } = req.body;
    const image = req.file;
    const author = req.user.id; //comes from middleware we are modifying request decoding token and getting value
    const blog = await Blog.findById(blogId);
    if (!blog) return res.json({ message: "No blog found" });
    if (!(author == blog.author))
      return res.json({
        success: false,
        message: "Accessed denied to update.",
      });

    if (image) {
      await deleteImageCloudinary(blog.imageId);
      const { secure_url, public_id } = await uploadImage(image.path);
      blog.image = secure_url;
      blog.imageId = public_id;
      fs.unlinkSync(image.path);
    }

    // blog.title = title || blog.title;
    // blog.description = description || blog.description
    // blog.draft = draft || blog.draft

    // await blog.save()
    // return ma blog nai garni
    const updated = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        description,
        image: blog.image,
        imageId: blog.imageId,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Updated successfully",
      updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
async function deleteBlog(req, res) {
  try {
    const id = req.params.id;
    const author = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog)
      return res.status(404).json({ success: false, message: "No blog found" });

    if (author !== blog.author.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to delete." });
    }

    // Delete image from Cloudinary if exists
    if (blog.imageId) {
      await deleteImageCloudinary(blog.imageId);
    }

    // Delete blog document
    const deleted = await Blog.findByIdAndDelete(id);

    // Remove blog reference from user's blogs array
    await User.findByIdAndUpdate(author, { $pull: { blogs: id } });

    return res.json({
      success: true,
      message: "Deleted successfully",
      deleted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting blog" });
  }
}

//likes controller
async function likeBlog(req, res) {
  try {
    const user = req.user.id;
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog.like.includes(user)) {
      await Blog.findByIdAndUpdate(id, { $pull: { like: user } });
      return res.json({
        success: true,
        message: "Blog disliked successfully",
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $push: { like: user } });
      return res.json({
        success: true,
        message: "Blog liked successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error liking blog" });
  }
}

//comments controller

// Create comment
async function createComment(req, res) {
  try {
    const { comment } = req.body;
    const blogId = req.params.id;
    const userId = req.user.id;

    if (!comment)
      return res.json({ success: false, message: "Comment required" });

    let newComment = await Comment.create({
      blog: blogId,
      user: userId,
      comment,
    });

    // Push to blog
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comment: newComment._id },
    });

    // Populate user before sending to frontend
    newComment = await newComment.populate("user", "name");

    res.json({
      success: true,
      message: "Comment added successfully",
      newComment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error commenting on blog" });
  }
}

// Get comments
async function getComment(req, res) {
  try {
    const blogId = req.params.id;

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching comments" });
  }
}

// Delete comment
async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId).populate(
      "blog",
      "author"
    );

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    // Only comment owner or blog author can delete
    if (
      comment.user.toString() !== userId &&
      comment.blog.author.toString() !== userId
    )
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    await Comment.findByIdAndDelete(commentId);
    await Blog.findByIdAndUpdate(comment.blog._id, {
      $pull: { comment: commentId },
    });

    res.json({
      success: true,
      message: "Comment deleted successfully",
      commentId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting comment" });
  }
}

// Update comment
async function updateComment(req, res) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { comment: updatedComment } = req.body; // match frontend key

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    if (comment.user.toString() !== userId)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    comment.comment = updatedComment;
    await comment.save();

    await comment.populate("user", "name");

    res.json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating comment" });
  }
}

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  createComment,
  getComment,
  deleteComment,
  updateComment,
};

//comment
