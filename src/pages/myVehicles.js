import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MyVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]); // State to store vehicle data

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    // Fetch vehicles data from API
    const fetchVehicles = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (!token) {
        // Redirect to login if token is missing
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://backseatdriver-ie-api.onrender.com/vehicles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json(); // Parse JSON response
          setVehicles(data); // Set vehicles state with data from API
        } else {
          // Handle errors (e.g., unauthorized)
          console.error('Failed to fetch vehicles:', response.status);
          handleLogout(); // Log out and redirect to login
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, [navigate]); // Dependency on navigate to ensure redirection if needed

  const handleViewVehicle = (id) => {
    navigate(`/vehicles/${id}/dashboard`); // Navigate to the view page with the vehicle ID in the URL
  };

  return (
    <Container style={{ backgroundColor: 'navy', padding: '20px', marginTop: '10px', borderRadius: '8px', color: 'white' }}>
      <Row>
        <Col xs="auto">
          <Button onClick={handleLogout}
            variant="outline-light"
            style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            Logout
          </Button>
        </Col>
      </Row>
      <Row className="align-items-center mb-3">
        <Col>
          <h2>Your Vehicles</h2>
        </Col>
      </Row>
      <p>Manage and access data for each of your registered vehicles below.</p>

      <Row className="mt-4">
        {/* Check if vehicles array is empty */}
        {vehicles.length === 0 ? (
          <Col>
            <p>You haven't registered any vehicles on backseatdriver.ie yet. Download our app, connect it to your car, and get registered!</p>
          </Col>
        ) : (
          vehicles.map((vehicle) => {
            console.log(vehicle); // Log each vehicle object to see available properties
            return (
              <Col md={6} lg={3} className="mb-4" key={vehicle.vehicle_id || vehicle._id || vehicle.id}>
                <Card style={{ width: '100%' }}>
                  <Card.Body>
                    <FaTruck size={20} style={{ marginBottom: '5px', color: 'black' }} />
                    <Card.Title style={{ color: 'black' }}>{vehicle.vehicle_id || vehicle._id || vehicle.id}</Card.Title>
                    <Card.Title style={{ color: 'black' }}>{vehicle.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Last login: {vehicle.lastLogin}</Card.Subtitle>
                    <Button 
                      variant="link" 
                      onClick={() => handleViewVehicle(vehicle.unique_id || vehicle._id || vehicle.id)}
                      style={{ padding: 0 }}
                    >
                      Access Vehicle Data
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
}

export default MyVehicles;
