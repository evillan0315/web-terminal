import React from "react";

const COGNITO_DOMAIN = "https://your-cognito-domain.auth.ap-southeast-2.amazoncognito.com";
const CLIENT_ID = "YOUR_COGNITO_CLIENT_ID";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = `${COGNITO_DOMAIN}/oauth2/authorize
      ?identity_provider=Google
      &response_type=CODE
      &client_id=${CLIENT_ID}
      &redirect_uri=${encodeURIComponent(REDIRECT_URI)}
      &scope=email openid profile`;
  };

  return (
    <button onClick={handleLogin} style={{ padding: "10px 20px", backgroundColor: "#4285F4", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;

