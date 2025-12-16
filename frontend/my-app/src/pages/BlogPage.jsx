import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Heart, MessageCircle } from "lucide-react";
import Avatar from "../utils/Avatar";
import Comment from "../components/Comment";
import { setIsOpen } from "../redux/slices/commentSlice";

function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { _id: userId, token } = useSelector((state) => state.user);
  const { isOpen } = useSelector((state) => state.comment);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const base_url = import.meta.env.VITE_BACKEND_URL;

  // Fetch blog
  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${base_url}/blog/getblog/${id}`);
      const fetchedBlog = res.data.blog;
      setBlog(fetchedBlog);
      setIsLiked(fetchedBlog.like?.some((likeUser) => likeUser._id === userId));
    } catch (err) {
      toast.error("Failed to fetch blog");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Like/unlike blog
  const handleLike = async () => {
    if (!token) {
      navigate("/login");
      return toast.error("Please login");
    }

    try {
      setIsLiked((prev) => !prev);
      const res = await axios.post(
        `${base_url}/blog/likeblog/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error liking blog");
    }
  };

  useEffect(() => {
    fetchBlog();
    dispatch(setIsOpen(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Blog not found</p>
      </div>
    );

  const isAuthor = token && blog.author?._id === userId;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={blog.author?.image || Avatar(blog.author?.name)}
            alt="author"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{blog.author?.name}</p>
            <p className="text-sm text-gray-500">Author</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>

        {/* Main image */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full rounded-lg mb-6 object-cover"
          />
        )}

        {/* Description */}
        <p className="text-gray-800 leading-relaxed">{blog.description}</p>

        {/* Edit button */}
        {isAuthor && (
          <div className="mt-6">
            <Link
              to={`/editblog/${blog._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </Link>
          </div>
        )}

        {/* Likes & Comments */}
        <div className="flex space-x-4 px-4 py-2 text-gray-600 mt-4">
          <div onClick={handleLike}>
            {isLiked ? (
              <Heart className="text-red-600 fill-red-600 cursor-pointer" />
            ) : (
              <Heart className="cursor-pointer hover:text-blue-500" />
            )}
            <span className="ml-1">{blog.like?.length || 0}</span>
          </div>

          <div
            className="flex items-center cursor-pointer hover:text-blue-500"
            onClick={() => dispatch(setIsOpen(!isOpen))}
          >
            <MessageCircle />
            <span className="ml-1">{blog.comment?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Comment sidebar */}
      {isOpen && <Comment blogId={blog._id} blogAuthorId={blog.author?._id} />}
    </div>
  );
}

export default BlogPage;
