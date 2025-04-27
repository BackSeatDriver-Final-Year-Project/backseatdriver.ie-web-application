import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MyVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [vehicleName, setVehicleName] = useState(''); // Vehicle name state
  const [vehicleID, setVehicleID] = useState(''); // Vehicle ID state
  const [error, setError] = useState(''); // Error handling state

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const registerVehicle = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You need to be logged in to register a vehicle');
      return;
    }

    if (!vehicleName || !vehicleID) {
      setError('Vehicle name and ID are required');
      return;
    }

    try {
      const response = await fetch('https://backseatdriver-ie-api.onrender.com/register-vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: vehicleName,
          VID: vehicleID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the response contains the vehicle ID and a success message
        alert('Vehicle registered successfully');
        handleClose();  // Close the modal
        setVehicleName('');  // Clear the vehicle name input
        setVehicleID('');  // Clear the vehicle ID input
        // Optionally, you can refresh the list of vehicles
        fetchVehicles();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Vehicle registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering vehicle:', error);
      setError('An error occurred. Please try again.');
    }
  };

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

  useEffect(() => {
    fetchVehicles();
  }, [navigate]);

  const handleViewVehicle = (id) => {
    navigate(`/vehicles/${id}/dashboard`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
            <p>You haven't registered any vehicles on backseatdriver.ie yet. Download our app, connect it to your car, and get registered, or register a car here and connect later!</p>
          </Col>
        ) : (
          vehicles.map((vehicle) => (
            <Col md={6} lg={3} className="mb-4" key={vehicle.vehicle_id || vehicle._id || vehicle.id}>
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <FaTruck size={20} style={{ marginBottom: '5px', color: 'black' }} />
                  <Card.Title style={{ color: 'black' }}>{vehicle.vehicle_id || vehicle._id || vehicle.id}</Card.Title>
                  <Card.Title style={{ color: 'black' }}>{vehicle.name}</Card.Title>
                  {/* <Card.Subtitle className="mb-2 text-muted">Last login: {vehicle.lastLogin}</Card.Subtitle> */}
                  <Button
                    variant="link"
                    onClick={() => handleViewVehicle(vehicle.unique_id || vehicle._id || vehicle.id)}
                    style={{ color: 'blue', padding: 0 }}
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
                className="white-button"
                style={{ padding: 0, color: 'white!important' }}
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
          <Form onSubmit={registerVehicle}>
            <Form.Group controlId="formVehicleName">
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter vehicle name"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)} // Update state on input change
              />
            </Form.Group>

            <Form.Group controlId="formVehicleID" className="mt-3">
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter vehicle ID"
                value={vehicleID}
                onChange={(e) => setVehicleID(e.target.value)} // Update state on input change
              />
            </Form.Group>

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={registerVehicle}>
            Save Vehicle
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyVehicles;
