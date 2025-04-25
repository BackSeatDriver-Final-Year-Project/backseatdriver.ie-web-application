// import React from 'react';
// import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'; // Simplified imports
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Link for routing
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import Offcanvas from 'react-bootstrap/Offcanvas';

// function Header() {

//   return (

//     // <>
//     //   {[false].map((expand) => (
//     //     <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
//     //       <Container fluid>
//     //         <Navbar.Brand href="#">backseatdriver</Navbar.Brand>
//     //         <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
//     //         <Navbar.Offcanvas
//     //           id={`offcanvasNavbar-expand-${expand}`}
//     //           aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
//     //           placement="end"
//     //         >
//     //           <Offcanvas.Header closeButton>
//     //             <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
//     //               Menu
//     //             </Offcanvas.Title>
//     //           </Offcanvas.Header>
//     //           <Offcanvas.Body>
//     //             <Nav className="justify-content-end flex-grow-1 pe-3">
//     //               <Nav.Link as={Link} to="/login">Login</Nav.Link> {/* Use Link instead of href */}
//     //               <Nav.Link as={Link} to="/register">Register</Nav.Link> {/* Use Link instead of href */}
//     //             </Nav>
//     //             <Form className="d-flex">
//     //               <Form.Control
//     //                 type="search"
//     //                 placeholder="Search"
//     //                 className="me-2"
//     //                 aria-label="Search"
//     //               />
//     //               <Button variant="outline-success">Search</Button>
//     //             </Form>
//     //           </Offcanvas.Body>
//     //         </Navbar.Offcanvas>
//     //       </Container>
//     //     </Navbar>
//     //   ))}
//     // </>

//     <Navbar expand="lg" className="bg-body-tertiary">
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/">Back Seat Driver</Navbar.Brand> {/* Use Link for internal navigation */}
//         <Navbar.Toggle aria-controls="navbarScroll" />
//         <Navbar.Collapse id="navbarScroll">
//           <Nav
//             className="me-auto my-2 my-lg-0"
//             style={{ maxHeight: '100px' }}
//             navbarScroll
//           >
//             <Nav.Link as={Link} to="/login">Login</Nav.Link> {/* Use Link instead of href */}
//             <Nav.Link as={Link} to="/register">Register</Nav.Link> {/* Use Link instead of href */}
//           </Nav>
//           <Form className="d-flex">
//             <Form.Control
//               type="search"
//               placeholder="Search"
//               className="me-2"
//               aria-label="Search"
//             />
//             <Button variant="outline-success">Search</Button>
//           </Form>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default Header;

import React from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'; // Simplified imports
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Link for routing
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn
} from 'mdb-react-ui-kit';
import logo from './images/BackSeatDriverLogo.png';
import { Radius } from 'lucide-react';

function Header() {

  return (<Navbar bg="purple" expand="lg" variant="dark" className="py-3" style={{ background: 'linear-gradient(0deg, #2d0b4a, #4a1c6f)' }}>
    <Container>
      {/* Logo */}
      <Navbar.Brand href="/">
        <img
          src={logo} // Replace with your logo image path
          height="50"
          // alt="Logo"
        />
        {/* <MDBIcon fas icon="bold" /> */}
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