import React, { useState } from 'react';
import './sidebar.css';
import { MDBIcon } from 'mdb-react-ui-kit';

const Sidebar = ({ setActiveView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <div
      className={`sidebar ${isHovered ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)} // Expand on hover
      onMouseLeave={() => setIsHovered(false)} // Collapse when not hovered
    >
      <div className="sidebar-header border-bottom">
        <div className="sidebar-brand">CM</div>
      </div>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <button className="btn btn-link" onClick={() => setActiveView('vehicleProfile')}>
            <MDBIcon fas icon="car" /> {/* Vehicle icon */}
            {isHovered && <small>Vehicle Profile</small>}
          </button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link" onClick={() => setActiveView('usageEfficiency')}>
            <MDBIcon fas icon="chart-line" /> {/* Usage/Efficiency icon */}
            {isHovered && <small>Usage & Efficiency</small>}
          </button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link" onClick={() => setActiveView('safety')}>
            <MDBIcon fas icon="shield-alt" /> {/* Safety icon */}
            {isHovered && <small>Safety</small>}
          </button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link" onClick={() => setActiveView('wiki')}>
            <MDBIcon fas icon="book" /> {/* Wiki icon */}
            {isHovered && <small>BackSeatDriver Wiki</small>}
          </button>
        </li>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          <MDBIcon fas icon="sign-out-alt" /> {/* Logout icon */}
          {isHovered && <small>Logout</small>}
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
