import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addUser } from "../redux/slices/userSlice";

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const base_url = import.meta.env.VITE_BACKEND_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleRegister(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${base_url}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        // localStorage.setItem("token", data.token);
        dispatch(addUser(data));
        toast.success("Registered successful");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[750px] bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6">Registration</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-10"
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />

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

            <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
              Register
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-blue-500 text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-2xl font-semibold">Welcome Back!</h2>
          <p className="mt-2 text-sm opacity-90">Already have an account?</p>
          <button
            className="mt-5 border border-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
