import './App.css'
import React from 'react';
import HomePage from './HomePage';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';
import TerminalPage from './TerminalPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terminal" element={<TerminalPage />} />
      </Routes>

  );
}

export default App;
