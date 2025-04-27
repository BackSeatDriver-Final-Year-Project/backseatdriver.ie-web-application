import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap'; // Simplified imports
import { Link } from 'react-router-dom'; // Import Link for routingf

function Header() {

  return (<Navbar bg="purple" expand="lg" variant="dark" className="py-3" style={{ background: 'linear-gradient(0deg, #2d0b4a, #4a1c6f)' }}>
    <Container>
      {/* Logo */}
      <Navbar.Brand href="/">
        {<img src="https://github.com/BackSeatDriver-Final-Year-Project/.github/blob/main/BackSeatDriverLogo.bb0f13939ee94e83aaf7.png?raw=true" height="50px"/>}
      </Navbar.Brand>

      {/* Toggle for mobile view */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      {/* Navbar links and Logout button */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {/* Add additional nav links here if needed */}
        </Nav>

        {/* Logout Button */}
        <Link to="/login">
          <Button variant="outline-light">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="outline-light" style={{marginLeft: '7px'}}>Register</Button>
        </Link>
        {<a href="https://github.com/BackSeatDriver-Final-Year-Project"><img src='https://cdn0.iconfinder.com/data/icons/shift-logotypes/32/Github-512.png' style={{width:'45px', borderRadius: '50%', margin: '5px'}} /></a>}
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}

export default Header;