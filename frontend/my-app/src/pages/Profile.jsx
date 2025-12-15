// Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/updateuser/${user._id}`,
        { name, email, password }
      );
      localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
      setMessage("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-md p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {message && <p className="text-green-600">{message}</p>}
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        className="border rounded px-3 py-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        className="border rounded px-3 py-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
      />
      <button
        onClick={updateProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Profile
      </button>
    </div>
  );
}

export default Profile;
