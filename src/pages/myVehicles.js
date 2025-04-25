import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MyVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://backseatdriver-ie-api.onrender.com/vehicles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          console.error('Failed to fetch vehicles:', response.status);
          handleLogout();
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, [navigate]);

  const handleViewVehicle = (id) => {
    navigate(`/vehicles/${id}/dashboard`);
  };

  return (
    <Container style={{ background: 'linear-gradient(180deg,#2d0b4a,#4a1c6f)', padding: '20px', marginTop: '10px', borderRadius: '8px', color: 'white' }}>
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
          <br />
          <h2>Your Assets/ Vehicles</h2>
          <p>Manage and access data for each of your registered vehicles below.</p>
        </Col>
      </Row>

      <Row className="mt-4">
        {vehicles.length === 0 ? (
          <Col>
            <p>You haven't registered any vehicles on backseatdriver.ie yet. Download our app, connect it to your car, and get registered!</p>
          </Col>
        ) : (
          vehicles.map((vehicle) => (
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
          ))
        )}

        <Col>
          <div className='add-vehicle-button' style={{ width: '100%' }}>
            <Card.Body>
              <Button
                variant="link"
                onClick={handleShow}
                style={{ padding: 0, color: 'white' }}
              >
                + Create new Vehicle Profile
              </Button>
            </Card.Body>
          </div>
        </Col>
      </Row>

      {/* Modal for adding a new vehicle */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formVehicleName">
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Control type="text" placeholder="Enter vehicle name" />
            </Form.Group>

            <Form.Group controlId="formVehicleID" className="mt-3">
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control type="text" placeholder="Enter vehicle ID" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            // Add submit logic here
            handleClose();
          }}>
            Save Vehicle
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyVehicles;
