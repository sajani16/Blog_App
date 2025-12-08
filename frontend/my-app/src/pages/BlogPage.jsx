import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "../utils/Avatar";
import { useSelector } from "react-redux";
import { Heart, HeartOff, MessageCircle } from "lucide-react";

function BlogPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  // const user = JSON.parse(localStorage.getItem("user"));
  const { _id: user_Id, token } = useSelector((slice) => slice.user);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  // const [likes, setLikes] = useState([]);
  const base_url = import.meta.env.VITE_BACKEND_URL;
  async function fetchBlogById() {
    try {
      const res = await axios.get(`${base_url}/getblog/${id}`);
      const fetchedBlog = res.data.blog;
      setBlog(fetchedBlog);
      // setLikes(blog.like.length);

      // FIX: check inside object array
      setIsLiked(fetchedBlog.like.some((likeUser) => likeUser._id === user_Id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike() {
    if (token) {
      setIsLiked((prev) => !prev);
      let res = await axios.post(
        `${base_url}/likeblog/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
    } else {
      navigate("/login");
      toast.error("Please login");
    }
  }
  useEffect(() => {
    fetchBlogById();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">Blog not found</p>
      </div>
    );
  }

  const isAuthor = token && blog.author?._id === user_Id;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
        {/* AUTHOR BOX */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={blog.author?.image || Avatar(blog.author?.name)}
            alt="author"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-800">{blog.author?.name}</p>
            <p className="text-sm text-gray-500">Author</p>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>

        {/* MAIN IMAGE */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full rounded-lg mb-6 object-cover"
          />
        )}

        {/* DESCRIPTION */}
        <p className="text-gray-800 leading-relaxed">{blog.description}</p>

        {/* EDIT BUTTON */}
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
        <div>
          <div className="flex space-x-4 px-4 py-2 text-gray-600">
            <div onClick={handleLike}>
              {isLiked ? (
                <Heart className="text-red-600 fill-red-600" />
              ) : (
                <Heart className="cursor-pointer hover:text-blue-500" />
              )}
              {/* {blog.like && likes.length} */}
            </div>
            <MessageCircle className="cursor-pointer hover:text-blue-500" />{" "}
            {blog.comment && blog.comment.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
