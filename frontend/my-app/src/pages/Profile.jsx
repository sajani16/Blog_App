import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    image: null, // File
    oldImage: "", // URL
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    setProfile({
      name: user.name,
      email: user.email,
      password: "",
      image: null,
      oldImage: user.image,
    });

    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  async function updateProfile() {
    if (!profile.name || !profile.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const base_url = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.put(
        `${base_url}/user/updateuser/${user._id}`,
        profile, // ✅ SAME as EditBlog
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated");

        localStorage.setItem("user", JSON.stringify(res.data.updatedUser));

        setProfile((prev) => ({
          ...prev,
          password: "",
          image: null,
          oldImage: res.data.updatedUser.image,
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="flex justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>

        {/* Image */}
        <label htmlFor="image" className="block cursor-pointer mb-4">
          {profile.image ? (
            <img
              src={URL.createObjectURL(profile.image)}
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          ) : (
            <img
              src={profile.oldImage || "/avatar.png"}
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          )}
        </label>

        <input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev,
              image: e.target.files[0],
            }))
          }
        />

        <input
          type="text"
          className="w-full mb-3 p-2 border rounded-md"
          value={profile.name}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Name"
        />

        <input
          type="email"
          className="w-full mb-3 p-2 border rounded-md"
          value={profile.email}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email"
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded-md"
          value={profile.password}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder="New password (optional)"
        />

        <button
          onClick={updateProfile}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
