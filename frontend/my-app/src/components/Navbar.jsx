import React, { useState } from "react";
import { useSelector } from "react-redux";
import { User, Pencil, Home, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "./Sidebar";

function Navbar() {
  const { name, isAdmin } = useSelector((state) => state.user) || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="bg-white shadow sticky top-0 z-50 px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="font-extrabold text-2xl cursor-pointer text-blue-600 hover:text-blue-700"
          onClick={() => navigate("/")}
        >
          BlogIt
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4 font-medium text-gray-700">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <Home size={18} /> Home
          </Link>

          <Link
            to="/addblog"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <Pencil size={18} /> Write Blog
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              <Shield size={18} /> Admin
            </Link>
          )}

          {/* Profile button styled as blue button */}
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            <User size={20} />
            <span>{name || "Profile"}</span>
          </button>
        </div>

        {/* Mobile profile button */}
        <div className="md:hidden">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-gray-900"
          >
            <User size={24} />
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

export default Navbar;
