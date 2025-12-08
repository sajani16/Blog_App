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
        select: "name",
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
    console.log(author);
    const blog = await Blog.findById(id);
    if (!blog) return res.json({ message: "No blog found" });
    console.log(blog.author);
    if (author !== blog.author)
      return res.json({
        success: false,
        message: "Accessed denied to delete.",
      });
    await uploadImage.deleteImageCloudinary(blog.imageId);
    const deleted = await Blog.findByIdAndDelete(id);
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
async function createComment(req, res) {
  try {
    const { comment } = req.body;
    const blogId = req.params.id;
    const userId = req.user.id;
    if (!comment)
      return res.json({ success: false, message: "Comment required" });
    const newComment = await Comment.create({
      blog: blogId,
      user: userId,
      comment,
    });

    await Blog.findByIdAndUpdate(blogId, {
      $push: { comment: newComment._id },
    });
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

async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const comment = await Comment.findById(commentId).populate({
      path: "blog",
      select: "author",
    });
    console.log(comment);
    console.log(userId, comment.user, comment.blog.author);
    console.log(userId == comment.blog.author);
    console.log(comment.user == userId);
    if (
      comment.user.toString() != userId &&
      comment.blog.author.toString() != userId
    )
      return res.json({
        success: false,
        message: "Not authorized to delete",
      });
    await Comment.findByIdAndDelete(commentId);
    await Blog.findByIdAndUpdate(comment.blog._id, {
      $pull: { comment: commentId },
    });
    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting comment on blog" });
  }
}

async function updateComment(req, res) {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;
    const { updatedComment } = req.body;
    const comment = await Comment.findById(commentId);
    console.log(userId, comment.user);
    if (comment.user.toString() !== userId)
      return res.json({
        success: false,
        message: "You are not authorized to update the comment",
      });
    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { comment: updatedComment },
      { new: true }
    );
    res.json({
      success: true,
      message: "Comment updated",
      updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating comment on blog" });
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
  deleteComment,
  updateComment,
};

//comment
