import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Register.css'; // You can create this CSS file to style the register page

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Add logic for handling registration (e.g., API call)
    console.log('Register attempt:', { name, email, password });

    setValidated(true);
  };

  return (
    <div className="login-page">
      <br/><br/>
      <Container className="d-flex align-items-center justify-content-center h-100">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <div className="register-form bg-light p-4 shadow-sm">
              <h2 className="text-center mb-4">Register</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your full name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please confirm your password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <br/><br/>
    </div>
  );
}

export default Register;
