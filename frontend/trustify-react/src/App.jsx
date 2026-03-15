import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import { ContractProvider } from './context/ContractContext';
import './style.css';

function App() {
  return (
    <ContractProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer" element={<FreelancerDashboard />} />
        </Routes>
      </Router>
    </ContractProvider>
  );
}

export default App;
