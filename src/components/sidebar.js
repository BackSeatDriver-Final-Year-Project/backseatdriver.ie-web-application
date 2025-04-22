import React, { useState } from 'react';
import './sidebar.css';
import { MDBIcon } from 'mdb-react-ui-kit';

const Sidebar = ({ setActiveView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // Track active button

  const handleClick = (view) => {
    setActiveItem(view);
    setActiveView(view);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div
      className={`sidebar ${isHovered ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-header border-bottom">
        <img
          src="https://avatars.githubusercontent.com/u/188066935?s=200&v=4"
          alt="Avatar"
          style={{
            width: "100%",
            maxWidth: "50px",
            borderRadius: "50%",
          }}
        />
      </div>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <button
            className={`btn btn-link sidebarLink ${activeItem === 'vehicleProfile' ? 'active' : ''}`}
            onClick={() => handleClick('vehicleProfile')}
          >
            <MDBIcon fas icon="fas fa-bolt" />
            {isHovered && <small>Live Data</small>}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-link sidebarLink ${activeItem === 'usageEfficiency' ? 'active' : ''}`}
            onClick={() => handleClick('usageEfficiency')}
          >
            <MDBIcon fas icon="chart-line" />
            {isHovered && <small>Usage & Efficiency</small>}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-link sidebarLink ${activeItem === 'safety' ? 'active' : ''}`}
            onClick={() => handleClick('safety')}
          >
            <MDBIcon fas icon="shield-alt" />
            {isHovered && <small>Safety</small>}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-link sidebarLink ${activeItem === 'wiki' ? 'active' : ''}`}
            onClick={() => handleClick('wiki')}
          >
            <MDBIcon fas icon="fas fa-brain" />
            {isHovered && <small>BackSeatDriver AI Client</small>}
          </button>
        </li>
        
        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          <MDBIcon fas icon="sign-out-alt" />
          {isHovered && <small>Logout</small>}
        </button>
      </ul>
      <div style={{padding:0}} className="sidebar-header border-bottom"></div>
    </div>
  );
};

export default Sidebar;
