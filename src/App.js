import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

// import style
import './App.css';

//import components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './components/common/Login';
import Register from './components/common/Register';
import Vehicles from './pages/myVehicles';
import ViewVehicle from './pages/ViewVehicle';
import HomePage from './pages/HomePage';

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
