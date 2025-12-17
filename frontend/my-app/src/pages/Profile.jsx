import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "../utils/Avatar";

function Profile() {
  const { _id: userId, token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
    oldImage: null,
  });

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const base_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${base_url}/user/getuser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data.user;
        setProfile({
          name: u.name || "",
          email: u.email || "",
          password: "",
          image: null,
          oldImage: u.image || null,
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  if (loading) return <p>Loading...</p>;

  const imageSrc = profile.image
    ? URL.createObjectURL(profile.image)
    : profile.oldImage || Avatar(profile.name);

  const updateProfile = async () => {
    if (!profile.name || !profile.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      if (profile.password) formData.append("password", profile.password);
      if (profile.image) formData.append("image", profile.image);

      const res = await axios.put(
        `${base_url}/user/updateuser/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Profile updated");
        const updated = res.data.updatedUser;
        setProfile((prev) => ({
          ...prev,
          password: "",
          image: null,
          oldImage: updated.image || null,
        }));
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await axios.delete(`${base_url}/user/deleteuser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Account deleted successfully");
        setShowDeleteModal(false);
        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Redirect to register page
        navigate("/register");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>

        <label htmlFor="image" className="block cursor-pointer mb-4">
          <img
            src={imageSrc}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        </label>

        <input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, image: e.target.files[0] }))
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
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mb-3"
        >
          Update Profile
        </button>

        {/* Delete Account Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
        >
          Delete Account
        </button>

        {/* Simple UI Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-white ">
            <div className="bg-white p-5 rounded-lg shadow-md w-80">
              <p className="mb-4 font-medium text-center">
                Are you sure you want to delete your account?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
