import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './components/common/Login';
import Register from './components/common/Register';
import Vehicles from './pages/myVehicles';
import ViewVehicle from './pages/ViewVehicle';
import HomePage from './pages/HomePage';

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith('/vehicles');

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id/dashboard" element={<ViewVehicle />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;
