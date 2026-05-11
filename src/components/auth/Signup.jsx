import React, { useState } from "react";
import logo from "../../assets/logo-img.png";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      //calls at backend server
      const res = await axios.post(`${API_BASE_URL}/signup`, {
        username: username, //passing this info to server during signup
        email: email,
        password: password,
      });

      //server sends token and userId as response , so extract them and store them in localstorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId); //sets current user on basis of id
      setLoading(false);

      //redirect
      window.location.href = "/"; //home
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16 w-auto rounded-2xl" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Sign Up
        </h1>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="Username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="enter username"
              id="Username"
              name="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <input
              type="email"
              placeholder="enter email address"
              id="email"
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="Password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="enter password"
              id="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="Password"
              autoComplete="off"
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            onClick={handleSignup}
            //dynamic content
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "loading..." : "Signup"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400">
          <p>
            Already have an account?{" "}
            <Link to='/auth'>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
