// src/Terminal.tsx
import React, { useState, useEffect } from 'react';
import DashboardComponent from './components/DashboardComponent';
import axios from "axios";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("No access token found.");
          return;
        }

        const response = await axios.post("https://board-api.duckdns.org/api/auth/google/userinfo", {
          accessToken,
        });

        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {userInfo ? (
        <div>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Picture:</strong> <img src={userInfo.picture} alt="User" /></p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
      <DashboardComponent />
    </div>
  );
};

export default Dashboard;

