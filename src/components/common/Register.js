import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../styling/Register.css'; // You can create this CSS file to style the register page
import { useNavigate } from 'react-router-dom';  // Import the navigation hook for redirection

function Register() {
  const [name, setName] = useState('');
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');  // State to handle errors
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();  // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Add logic for handling registration (e.g., API call)
    console.log('Register attempt:', { name, username, password });

    e.preventDefault();
    setError('');  // Clear previous errors

    try {
      const response = await fetch('https://backseatdriver-ie-api.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the token is returned as data.token
        alert(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
    setValidated(true);
  };

  return (
    <div className="login-page">
      <br /><br />
      <Container className="d-flex align-items-center justify-content-center h-100">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <div className="register-form bg-light p-4 shadow-sm">
              <h2 className="text-center mb-4">Register</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName" className="mb-3">
                  <Form.Control.Feedback type="invalid">
                    Please provide your full name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={username}
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
      <br /><br />
    </div>
  );
}

export default Register;
