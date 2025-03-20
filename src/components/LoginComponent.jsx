import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthHeaders } from '../utils/http';
import { getAuthToken } from '../utils/auth';

const COGNITO_DOMAIN = "https://your-cognito-domain.auth.ap-southeast-2.amazoncognito.com";
const CLIENT_ID = "YOUR_COGNITO_CLIENT_ID";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

const LoginComponent = () => {
  const token = getAuthToken();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const headers = setAuthHeaders();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://board-api.duckdns.org/api/auth/signin", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data, "data");

      if (response.ok) {
        localStorage.setItem("accessToken", JSON.stringify(data));
        console.log("Login successful:", data.AccessToken);
        navigate("/terminal");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${COGNITO_DOMAIN}/oauth2/authorize
      ?identity_provider=Google
      &response_type=CODE
      &client_id=${CLIENT_ID}
      &redirect_uri=${encodeURIComponent(REDIRECT_URI)}
      &scope=email openid profile`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {errorMessage && (
          <div id="errorMessage" className="error-message text-red-500 text-sm mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Username"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <img src="https://www.svgrepo.com/show/512317/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

