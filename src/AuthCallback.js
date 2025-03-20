import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      // Send the code to the backend for token exchange
      axios
        .post("https://board-api.duckdns.org/api/auth/google/login", { code: authCode })
        .then((response) => {
          const { access_token, id_token } = response.data;
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("idToken", id_token);
          navigate("/dashboard"); // Redirect to the dashboard
        })
        .catch((error) => {
          console.error("Login failed:", error);
          navigate("/");
        });
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default AuthCallback;

