import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthHeaders } from '../utils/http';
import { getAuthToken } from '../utils/auth';
const LoginComponent = () => {
  const token = getAuthToken();
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const headers = setAuthHeaders();
  useEffect(() => {
    
    if (token) {
      // If a token exists, navigate to the terminal page
      navigate("/terminal");
    }
  }, [token]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const response = await fetch("https://board-api.duckdns.org/login", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", JSON.stringify(data.AuthenticationResult));
        console.log("Login successful:", data.AuthenticationResult.AccessToken);
	navigate('/terminal');
        /*const headers = new Headers({
          "Authorization": `Bearer ${data.AuthenticationResult.AccessToken}`,
          "Content-Type": "application/json",
        });

        const res = await fetch("https://board-api.duckdns.org/api/files", {
          method: "GET",
          headers: headers,
        });

        const files = await res.json();
        console.log(files, "files");
        setErrorMessage(JSON.stringify(files)); // Display files*/
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
          <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

