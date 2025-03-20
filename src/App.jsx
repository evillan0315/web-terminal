import './App.css'
import React from 'react';
import HomePage from './HomePage';
import Dashboard from './Dashboard.js';
import LoginPage from './LoginPage.js';
import TerminalPage from './TerminalPage';
import AuthCallback from "./AuthCallback.js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terminal" element={<TerminalPage />} />
      </Routes>

  );
}

export default App;
