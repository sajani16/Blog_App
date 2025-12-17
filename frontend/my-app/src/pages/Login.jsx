import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addUser } from "../redux/slices/userSlice";

function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleLogin(e) {
    e.preventDefault();

    try {
      //   const res = await fetch("http://localhost:3000/api/auth/login", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(userData),
      //   });
      //   const data = await res.json();
      //   console.log(data.name);
      //   console.log("what");
      //   if (data) {
      //     localStorage.setItem("token", data.token);
      //     toast.success("Login successful");
      //   } else {
      //     toast.error(data.message || "Login failed");
      //   }
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        userData
      );

      dispatch(addUser(res.data.user));

      // localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.user.message);
      if (res.data.user) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Login Failed");
      console.log(err.res.data.user.message);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[750px] bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 bg-blue-500 text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-2xl font-semibold">Welcome Back!</h2>
          <p className="mt-2 text-sm opacity-90">Already have an account?</p>
          <button
            className="mt-5 border border-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
        {/* Right PANEL */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6">Registration</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-10"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-10"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg"
            >
              Login
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
      </div>
    </div>
  );
}

export default Login;
