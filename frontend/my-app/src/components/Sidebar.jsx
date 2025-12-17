import React from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, LogOut, Home, X, Plus } from "lucide-react";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "My Posts", icon: FileText, path: "/myposts" },
    { label: "Profile", icon: User, path: "/profile" },
    { label: "Write Blog", icon: Plus, path: "/addblog" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100%-64px)] w-64 md:w-72 bg-white shadow-lg rounded-l-xl transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header with cross */}
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="font-bold text-2xl md:text-3xl">Menu</h2>
        <button
          onClick={toggleSidebar} // only close when clicking X
          className="p-2 rounded hover:bg-gray-100"
        >
          <X size={24} />
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex flex-col mt-5">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)} // don't toggle sidebar
            className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 transition-colors text-gray-700 text-base md:text-lg font-semibold"
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-3 mt-4 text-red-600 hover:bg-red-50 font-semibold rounded"
        >
          <LogOut size={22} /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
