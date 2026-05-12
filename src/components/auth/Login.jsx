import React, { useEffect, useState } from "react";
import logo from "../../assets/logo-img.png";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

function Login() {
  //get rid of the current credentials from localStorage
  // useEffect(() => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userId");
  //   setCurrentUser(null); //now user is not logged in
  // });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      //send res to backend server
      const res = await axios.post(`${API_BASE_URL}/login`, {
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
      alert("Login Failed!");
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
          Login
        </h1>

        {/* Form */}
        <form className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="Email"
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
            onClick={handleLogin}
            //dynamic content
            disabled={loading}
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "loading..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400">
          <p>
            New to VCS? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
