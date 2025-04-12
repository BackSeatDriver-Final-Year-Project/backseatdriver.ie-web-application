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
        {/* <div className="sidebar-brand">CM</div> */}
        <img
      src="https://avatars.githubusercontent.com/u/188066935?s=200&v=4"
      alt="Avatar"
      style={{
        width: "100%",
        maxWidth: "50px",
        borderRadius: "50%",
      }}/>
      </div>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <button className="btn btn-link sidebarLink" onClick={() => setActiveView('vehicleProfile')}>
            <MDBIcon fas icon="fas fa-bolt" /> {/* Vehicle icon */}
            {isHovered && <small>Live Data</small>}
          </button>
        </li>
        <hr></hr>
        <li className="nav-item">
          <button className="btn btn-link sidebarLink" onClick={() => setActiveView('usageEfficiency')}>
            <MDBIcon fas icon="chart-line" /> {/* Usage/Efficiency icon */}
            {isHovered && <small>Usage & Efficiency</small>}
          </button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link sidebarLink" onClick={() => setActiveView('safety')}>
            <MDBIcon fas icon="shield-alt" /> {/* Safety icon */}
            {isHovered && <small>Safety</small>}
          </button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link sidebarLink" onClick={() => setActiveView('wiki')}>
            <MDBIcon fas icon="fas fa-brain" /> {/* Wiki icon */}
            {isHovered && <small>BackSeatDriver AI Client</small>}
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
