import React, { useState } from "react";
import { useSelector } from "react-redux";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Navbar() {
  const { name } = useSelector((state) => state.user) || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login"); // redirect if not logged in
      return;
    }
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="bg-white shadow sticky top-0 z-50 px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-xl cursor-pointer">MyBlog</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <User size={20} />
            <span className="hidden md:inline">{name || "Profile"}</span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

export default Navbar;
