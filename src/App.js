import React from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Vehicles from './pages/myVehicles';
import ViewVehicle from './pages/ViewVehicle';
import HomePage from './pages/HomePage';
import Dashboard from './pages/vehicle';

function MainLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Apply MainLayout to routes that include header and footer */}
          <Route path="/*" element={<MainLayout />} />

          {/* Full-screen route for Dashboard without header and footer */}
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id/dashboard" element={<ViewVehicle />} />
          <Route path="/caolan" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
