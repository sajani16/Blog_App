import React from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import EditBlog from "./pages/EditBlog";

function App() {
  return (
    <div className="bg-white w-screen h-screen">
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/addblog" element={<AddBlog />}></Route>
          <Route path="/editblog/:id" element={<EditBlog />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/blog/:id" element={<BlogPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
