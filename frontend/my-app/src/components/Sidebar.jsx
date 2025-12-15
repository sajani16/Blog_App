import React from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, LogOut, Home, X } from "lucide-react";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "My Posts", icon: FileText, path: "/myposts" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100%-64px)] w-64 bg-white shadow-lg rounded-l-xl transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-lg">Menu</h2>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex flex-col mt-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              toggleSidebar();
            }}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 text-sm font-medium"
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 mt-2 text-red-600 hover:bg-red-50 font-medium rounded"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
