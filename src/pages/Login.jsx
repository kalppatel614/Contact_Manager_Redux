import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authLoading = useSelector((state) => state.auth.loading);
  const authError = useSelector((state) => state.auth.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-4 flex flex-col items-start">
          <label
            htmlFor="email"
            className="block mb-2 text-gray-300 text-sm font-bold"
          >
            Email
          </label>
          <input
            placeholder="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4 flex flex-col items-start">
          <label
            htmlFor="password"
            className="block mb-2 text-gray-300 text-sm font-bold"
          >
            Password
          </label>
          <input
            placeholder="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col justify-between items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-5 mt-4"
            disabled={authLoading}
            type="submit"
          >
            {authLoading ? "Loggin in..." : "Login"}
          </button>
          <Link
            to="/register"
            className="text-blue-500 hover:underline text-sm"
          >
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
