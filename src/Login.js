import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // Import the navigation hook for redirection

function Login() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // State to handle errors
  const navigate = useNavigate();  // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    
    try {
      const response = await fetch('https://backseatdriver-ie-api.onrender.com/login', {
        // const response = await fetch('http://localhost:3000/login', {
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
        if (data.token) {
          localStorage.setItem('token', data.token);  // Save token in sessionStorage
          navigate('/vehicles');  // Redirect to myVehicles
        } else {
          setError('Authentication failed. No token returned.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <br/><br/>
      <Container className="h-100">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <div className="login-form bg-light p-4 shadow-sm">
              <h2 className="text-center mb-4">Login</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter email"
                    value={username}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
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

export default Login;
