import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { _id: userId, token } = useSelector((state) => state.user) || {};
  const base_url = import.meta.env.VITE_BACKEND_URL;

  // Fetch user posts
  const fetchPosts = async () => {
    if (!userId) return setLoading(false);

    try {
      const res = await axios.get(`${base_url}/blog/getblogs`);
      const allPosts = res.data.blogs || [];
      const userPosts = allPosts.filter((p) => p.author._id === userId);
      setPosts(userPosts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!token) {
      toast.error("Login required");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await axios.delete(`${base_url}/blog/deleteblog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Post deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading posts...</p>
      </div>
    );

  if (posts.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No posts yet</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4 flex flex-col flex-1">
            <h2 className="text-lg font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.description}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Author: {post.author.name}
            </p>
            <div className="mt-auto flex gap-2">
              <button
                onClick={() => navigate(`/editblog/${post._id}`)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyPosts;
