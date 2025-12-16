import axios from "axios";
import { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "../utils/Avatar";

function Home() {
  const [blogs, setBlogs] = useState([]);

  async function getBlogs() {
    const base_url = import.meta.env.VITE_BACKEND_URL;

    try {
      const res = await axios.get(`${base_url}/blog/getblogs`);
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  }

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-6">
      {blogs.map((blog) => (
        <Link
          to={`/blog/${blog._id}`}
          key={blog._id}
          className="bg-white w-full max-w-3xl rounded-lg shadow p-6 mb-6 flex gap-6 hover:bg-gray-50 transition"
        >
          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* Author */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={
                  blog.author?.image
                    ? blog.author.image
                    : Avatar(blog.author?.name)
                }
                alt="author"
                className="w-8 h-8 rounded-full object-cover"
              />
              <p className="text-sm text-gray-700 font-medium">
                {blog.author?.name || "Author"}
              </p>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {blog.title.length > 60
                ? blog.title.slice(0, 60) + "..."
                : blog.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-1">
              {blog.description.length > 90
                ? blog.description.slice(0, 90) + "..."
                : blog.description}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-6 mt-4 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <Heart className="w-5 cursor-pointer " />
                {blog.like?.length || 0}
              </div>{" "}
              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 cursor-pointer" />
                {blog.comment?.length || 0}
              </div>{" "}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-40 h-32 object-cover rounded-md"
            />
          )}
        </Link>
      ))}
    </div>
  );
}

export default Home;
