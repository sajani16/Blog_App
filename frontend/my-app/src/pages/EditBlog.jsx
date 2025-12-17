import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use Redux for user token
  const { token } = useSelector((state) => state.user);

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: null, // new file
    oldImage: "", // url from DB
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const base_url = import.meta.env.VITE_BACKEND_URL;

  // Fetch old blog
  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(`${base_url}/blog/getblog/${id}`);
        if (res.data.success) {
          const b = res.data.blog;
          setBlog({
            title: b.title,
            description: b.description,
            image: null,
            oldImage: b.image,
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  // Update blog
  const handleUpdateBlog = async () => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("description", blog.description);
      if (blog.image) formData.append("image", blog.image);

      const res = await axios.put(
        `${base_url}/blog/updateblog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Blog updated successfully");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Delete blog
  const handleDeleteBlog = async () => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      await axios.delete(`${base_url}/blog/deleteblog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog deleted successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    }
  };

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

        {/* Image Preview */}
        <label htmlFor="image" className="block cursor-pointer mb-4">
          {blog.image ? (
            <img
              src={URL.createObjectURL(blog.image)}
              className="w-full rounded-md object-cover aspect-video"
            />
          ) : (
            blog.oldImage && (
              <img
                src={blog.oldImage}
                className="w-full rounded-md object-cover aspect-video"
              />
            )
          )}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, image: e.target.files[0] }))
          }
        />

        {/* Update & Delete Buttons */}
        <button
          onClick={handleUpdateBlog}
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
        >
          Update Blog
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full mt-2 bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700"
        >
          Delete Blog
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowDeleteModal(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteBlog();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditBlog;
