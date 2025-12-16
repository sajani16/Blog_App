import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: null, // new file
    oldImage: "", // url from DB
  });

  const [loading, setLoading] = useState(true);

  // Fetch old blog
  useEffect(() => {
    async function fetchBlog() {
      try {
        const base_url = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${base_url}/blog/getblog/${id}`);

        if (res.data.success) {
          const b = res.data.blog;

          setBlog({
            title: b.title,
            description: b.description,
            image: null, // nothing selected yet
            oldImage: b.image, // cloudinary url
          });
        }
      } catch (err) {
        toast.error(err.message);
      }

      setLoading(false);
    }

    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  // Update handler (same pattern as AddBlog)
  async function handleUpdateBlog() {
    try {
      const base_url = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.put(
        `${base_url}/blog/updateblog/${id}`,
        blog, // ✅ same pattern as AddBlog
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Updated successfully");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="flex justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>

        {/* Title */}
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded-md"
          value={blog.title}
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        {/* Description */}
        <label className="block font-medium mb-1">Description</label>
        <textarea
          rows="4"
          className="w-full mb-4 p-2 border rounded-md"
          value={blog.description}
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        {/* Image preview (same UX as AddBlog) */}
        <label htmlFor="image" className="block cursor-pointer mb-4">
          {blog.image ? (
            // new image preview
            <img
              src={URL.createObjectURL(blog.image)}
              className="w-full rounded-md object-cover aspect-video"
            />
          ) : (
            // old image
            <img
              src={blog.oldImage}
              className="w-full rounded-md object-cover aspect-video"
            />
          )}
        </label>

        {/* hidden file input */}
        <input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, image: e.target.files[0] }))
          }
        />

        <button
          onClick={handleUpdateBlog}
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
        >
          Update Blog
        </button>
      </div>
    </div>
  );
}

export default EditBlog;
