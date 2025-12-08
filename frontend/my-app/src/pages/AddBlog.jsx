import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function AddBlog() {
  const navigate = useNavigate();
  const { token } = useSelector((slice) => slice.user);
  // const token = JSON.parse(localStorage.getItem("token"));
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (!token) {
      return navigate("/register");
    }
  }, []);
  console.log(blog);

  async function handlePostBlog() {
    const base_url = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await axios.post(`${base_url}/createblogs`, blog, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
      console.log(blog);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className=" flex justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Create Blog</h2>

        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded-md outline-none focus:border-black"
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <label className="block font-medium mb-1">Description</label>
        <textarea
          rows="4"
          className="w-full mb-4 p-2 border rounded-md outline-none focus:border-black"
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, description: e.target.value }))
          }
        ></textarea>

        <label htmlFor="image" className="block cursor-pointer mb-4">
          {blog.image ? (
            <img
              src={URL.createObjectURL(blog.image)}
              alt=""
              className="w-full rounded-md object-cover aspect-video"
            />
          ) : (
            <div className="w-full aspect-video rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
              Select Image
            </div>
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

        <button
          onClick={handlePostBlog}
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
        >
          Publish
        </button>
      </div>
    </div>
  );
}

export default AddBlog;
