import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import EditBlog from "./pages/EditBlog";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";
import Sidebar from "./components/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" />

      {/* Persistent Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addblog" element={<AddBlog />} />
          <Route path="/editblog/:id" element={<EditBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:id" element={<BlogPage />} />

          {/* Top-level routes for sidebar links */}
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/profile" element={<Profile />} />

          {/* Catch-all route (optional) */}
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
