import { useParams, useNavigate } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button, Pagination } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
// import Graph from './Graph'; // Import the Graph component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import L from 'leaflet';
import Modal from 'react-bootstrap/Modal';


import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-speedometer';

const socket = io('https://backseatdriver-ie-api.onrender.com'); // Replace with your actual API endpoint
// const socket = io('http://localhost:3000'); // Replace with your actual API endpoint


const customMarker = new L.Icon({
  iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // Update this path
  iconSize: [41, 41],  // Default Leaflet marker size
  iconAnchor: [12, 41], // Center bottom point
  popupAnchor: [1, -34],
  // shadowUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // Optional
  shadowSize: [41, 41],
});

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 53.2707,
  lng: -9.0568,
};

const today = new Date();

// Dummy data for heatmap
const heatmapData = [
  { date: '2024-10-01', count: 2 },
  { date: '2024-10-02', count: 3 },
  { date: '2024-10-03', count: 1 },
  { date: '2024-10-04', count: 5 },
  { date: '2024-10-05', count: 4 },
  { date: '2024-10-06', count: 6 },
  { date: '2024-10-07', count: 2 },
  // Add more dates as necessary
];

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

function getRange(count) {
  return Array.from({ length: count }, (_, i) => i);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomValues = getRange(200).map(index => {
  return {
    date: shiftDate(today, -index),
    count: getRandomInt(1, 3),
  };
});

// const vehicleData = {
//   make: 'Toyota',
//   model: 'Corolla',
//   year: '2020',
//   fuelType: 'Petrol',
//   mileage: '50,000 km',
//   fuelEfficiency: '15 km/L',
//   engineHealth: 'Good',
//   tirePressure: 'Optimal',
//   engineHealthScore: 85,
//   trips: [
//     { date: '2024-11-15', distance: '120 km', fuelUsed: '8 L' },
//     { date: '2024-11-14', distance: '90 km', fuelUsed: '6 L' },
//   ],
// };

const JourneyMap = ({ journey }) => {
  return (
    <MapContainer center={journey[0]} zoom={13} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Draw the journey on the map */}
      <Polyline positions={journey} color="blue" />
    </MapContainer>
  );
};

const VehicleProfile = () => {
  const { id } = useParams(); // Get vehicle ID from the URL
  const [checked, setChecked] = useState(false);
  const [vin, setVin] = useState(null);
  const [obdData, setObdData] = useState(null);
  const token = localStorage.getItem('token');

  // Example usage with journey data
  const journeyData = [
    [53.3498, -6.2603], // Dublin
    [53.3382, -6.2553], // Nearby location
    [53.3271, -6.2521], // Another point
  ];

  useEffect(() => {
    const fetchVin = async () => {
      try {
        const response = await fetch(`https://backseatdriver-ie-api.onrender.com/vehicles/id/${id}`, {
          // const response = await fetch(`http://localhost:3000/vehicles/id/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching VIN: ${response.statusText}`);
        }
        const data = await response.json();
        setVin(data.VID);
        console.log(`Fetched VIN: ${data.vin}`);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchVin();
    }
  }, [id]);

  useEffect(() => {
    if (vin) {
      socket.emit('subscribeToVin', vin); // Subscribe using the VIN
      console.log(`Subscribed to VIN: ${vin}`);
    }

    socket.on('updateObdData', (data) => {
      setObdData(data);
    });

    return () => socket.off('updateObdData');
  }, [vin]);

  const handleToggle = () => {
    setChecked(!checked);
  };


  return (
    <Container>

      {obdData ? (
        <>
          <Row>
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Location</h4>

                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={checked ? "Live view" : "Historic Data View"}
                    checked={checked}
                    onChange={handleToggle}
                  />
                </Form>

              </div>

              <div className="bg-white p-4 shadow-sm rounded" style={{ height: '400px' }}>
                <h4>Location</h4>
                <JourneyMap journey={obdData.jounrey} />
              </div>

              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Fuel Usage</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[{ name: 0, value: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Dash</h4>
                <Row>
                  <Col>
                    <Speedometer
                      width={200}
                      value={0}
                      fontFamily='squada-one'
                    >
                      <Background />
                      <Arc />
                      <Needle />
                      <Progress />
                      <Marks />
                      <Indicator />
                    </Speedometer>
                  </Col>
                  <Col>
                    <Speedometer
                      width={200}
                      value={0}
                      fontFamily='squada-one'
                    >
                      <Background />
                      <Arc />
                      <Needle />
                      <Progress />
                      <Marks />
                      <Indicator />
                    </Speedometer>
                  </Col>
                </Row>
              </div>

              <Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Signal</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Engine RPM</strong></td>
                      <td>0 RPM</td>
                    </tr>
                    <tr>

                      <td><strong>Fuel Level</strong></td>
                      <td>0%</td>
                    </tr>
                    <tr>

                      <td><strong>Mass Air Flow</strong></td>
                      <td>0g/s</td>
                    </tr>

                    <tr>

                      <td><strong>Coolant Temp</strong></td>
                      <td>0°C</td>
                    </tr>
                    <tr>

                      <td><strong>Vehicle Speed</strong></td>
                      <td>0km/h</td>
                    </tr>
                    <tr>

                      <td><strong>Throttle Position</strong></td>
                      <td>0%</td>
                    </tr>
                    <tr>

                      <td><strong>Intake Air Temp</strong></td>
                      <td>0°C</td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
              <Row>
                <Col className="col-info"><strong>Engine RPM:</strong> {obdData.engineRPM}RPM</Col>
                <Col className="col-info"><strong>Vehicle Speed:</strong> {obdData.vehicleSpeed}km/h</Col>
              </Row>
              <Row>
                <Col className="col-info"><strong>Fuel Level:</strong> {obdData.fuel_usage}%</Col>
                <Col className="col-info"><strong>Throttle Position:</strong> {obdData.throttlePosition}%</Col>
              </Row>
              <Row>
                <Col className="col-info"><strong>Mass Air Flow:</strong> 0 g/s</Col>
                <Col className="col-info"><strong>Intake Air Temp:</strong> 0°C</Col>
              </Row>
              <Row>
                <Col className="col-info"><strong>Coolant Temp:</strong> 0°C</Col>
              </Row>
            </Col>
            <Row>
              <Col>
                <div className="bg-white p-4 shadow-sm rounded">
                  <h4>Fuel Usage</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={obdData.fuel_usage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Col>
            </Row>
          </Row>
        </>

        // <Row>

        //   <Col className="col-info">
        //     <Row><Col className="col-info"><strong>Last Login:</strong>  Live</Col></Row>

        //     <div className="bg-white p-4 shadow-sm rounded" style={{ height: '400px' }}>
        //       <JourneyMap journey={obdData.jounrey} />
        //     </div>
        //   </Col>
        //   <Col>
        //     <Row>

        //       <div className="bg-white p-4 shadow-sm rounded">
        //         <h4>Dash</h4>
        //         <Col>
        //           <Speedometer
        //             width={190}
        //             value={obdData.engineRPM}
        //             fontFamily='squada-one'
        //           >
        //             <Background />
        //             <Arc />
        //             <Needle />
        //             <Progress />
        //             <Marks />
        //             <Indicator />
        //           </Speedometer>
        //         </Col>

        //         <Col>
        //           <Speedometer
        //             width={190}
        //             value={obdData.vehicleSpeed}
        //             fontFamily='squada-one'
        //           >
        //             <Background />
        //             <Arc />
        //             <Needle />
        //             <Progress />
        //             <Marks />
        //             <Indicator />
        //           </Speedometer>
        //         </Col>
        //       </div>
        //     </Row>
        //     <Row>
        //       <Col className="col-info"><strong>Engine RPM:</strong> {obdData.engineRPM} RPM</Col>
        //       <Col className="col-info"><strong>Vehicle Speed:</strong> {obdData.vehicleSpeed} km/h</Col>
        //     </Row>
        //     <Row>
        //       <Col className="col-info"><strong>Fuel Level:</strong> {obdData.fuelLevel}%</Col>
        //       <Col className="col-info"><strong>Throttle Position:</strong> {obdData.throttlePosition}%</Col>
        //     </Row>
        //     <Row>
        //       <Col className="col-info"><strong>Mass Air Flow:</strong> {obdData.massAirFlow} g/s</Col>
        //       <Col className="col-info"><strong>Intake Air Temp:</strong> {obdData.intakeAirTemp}°C</Col>
        //     </Row>
        //     <Row>
        //       <Col className="col-info"><strong>Coolant Temp:</strong> {obdData.coolantTemp}°C</Col>
        //       {/* <li><strong>Latitude :</strong> {obdData.latitude}°C</li>
        //       <li><strong>Longitude :</strong> {obdData.longitude}°C</li> */}
        //     </Row>
        //   </Col>
        //   <Row>
        //     <Col>
        //       <div className="bg-white p-4 shadow-sm rounded">
        //         <h4>Fuel Usage</h4>
        //         <ResponsiveContainer width="100%" height={300}>
        //           <LineChart data={obdData.fuel_usage}>
        //             <CartesianGrid strokeDasharray="3 3" />
        //             <XAxis dataKey="name" />
        //             <YAxis />
        //             <Tooltip />
        //             <Legend />
        //             <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        //           </LineChart>
        //         </ResponsiveContainer>
        //       </div>
        //     </Col>
        //   </Row>
        // </Row>
      ) : (
        <>
          <Row>
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Location</h4>

                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={checked ? "Live view" : "Historic Data View"}
                    checked={checked}
                    onChange={handleToggle}
                  />
                </Form>

              </div>

              <div className="bg-white p-4 shadow-sm rounded" style={{ height: '400px' }}>
                <h4>Location</h4>
                <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ width: '100%', height: '90%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                  <Marker position={[37.7749, -122.4194]} icon={customMarker}>
                    <Popup>Vehicle Location</Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Fuel Usage</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[{ name: 0, value: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Dash</h4>
                <Row>
                  <Col>
                    <Speedometer
                      width={280}
                      value={0}
                      fontFamily='squada-one'
                    >
                      <Background />
                      <Arc />
                      <Needle />
                      <Progress />
                      <Marks />
                      <Indicator />
                    </Speedometer>
                  </Col>
                  <Col>
                    <Speedometer
                      width={280}
                      value={0}
                      fontFamily='squada-one'
                    >
                      <Background />
                      <Arc />
                      <Needle />
                      <Progress />
                      <Marks />
                      <Indicator />
                    </Speedometer>
                  </Col>
                </Row>
              </div>

              <Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Signal</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Engine RPM</strong></td>
                      <td>0 RPM</td>
                    </tr>
                    <tr>

                      <td><strong>Fuel Level</strong></td>
                      <td>0%</td>
                    </tr>
                    <tr>

                      <td><strong>Mass Air Flow</strong></td>
                      <td>0g/s</td>
                    </tr>

                    <tr>

                      <td><strong>Coolant Temp</strong></td>
                      <td>0°C</td>
                    </tr>
                    <tr>

                      <td><strong>Vehicle Speed</strong></td>
                      <td>0km/h</td>
                    </tr>
                    <tr>

                      <td><strong>Throttle Position</strong></td>
                      <td>0%</td>
                    </tr>
                    <tr>

                      <td><strong>Intake Air Temp</strong></td>
                      <td>0°C</td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Col>
            <Row>
              <Col>
                <div className="bg-white p-4 shadow-sm rounded">
                  <h4>Fuel Usage</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[{ name: 0, value: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Col>
            </Row>
          </Row>
        </>
      )}
    </Container>
  );
};

const fetchAddress = async (lat, lon) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name; // Full address
    }
    return "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
};

// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Row, Col, ListGroup, Button, Modal, Pagination } from 'react-bootstrap';
// import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

const UsageEfficiency = () => {
  const { id } = useParams();
  const [journeyData, setJourneyData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const itemsPerPage = 15;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        const response = await fetch(`https://backseatdriver-ie-api.onrender.com/journeys/${id}`, {
          // const response = await fetch(`http://localhost:3000/journeys/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching journey data: ${response.statusText}`);
        }
        const data = await response.json();
        setJourneyData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchJourneyData();
    }
  }, [id]);

  const handleShowModal = (journey) => {
    console.log(journey);
    setSelectedJourney(journey.journey_dataset[(journey.journey_dataset.length) - 1].jounrey);
    console.log(journey.journey_dataset[(journey.journey_dataset.length) - 1].jounrey);
    // {journeyData?.journey_dataset?.at(-1)?.journey}
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = journeyData ? journeyData.slice(indexOfFirstItem, indexOfLastItem) : [];

  const totalPages = journeyData ? Math.ceil(journeyData.length / itemsPerPage) : 1;

  return (
    <Container>
      {journeyData ? (
        <>
          <Row className="mb-4">
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Your Journeys</h4>
                <ListGroup>
                  {currentItems.map((journey) => (
                    <ListGroup.Item key={journey.journey_id}>
                      Journey from {journey.journey_dataset[journey.journey_dataset.length - 1].jounrey[0].toString()} to
                      {journey.journey_dataset[journey.journey_dataset.length - 1].jounrey[journey.journey_dataset[journey.journey_dataset.length - 1].jounrey[3].length - 1].toString()} <br />
                      {/* Journey ID: {journey.journey_id} */}
                      Duration : {journey.journey_duration}
                      <Button
                        variant="primary"
                        className="ms-2"
                        onClick={() => handleShowModal(journey)}
                      >
                        View Journey
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Pagination className="mt-3">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                      key={page + 1}
                      active={page + 1 === currentPage}
                      onClick={() => setCurrentPage(page + 1)}
                    >
                      {page + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </Col>
          </Row>

          {/* Modal with Map */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Journey Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>{journeyData.journey_duration}</h5>
              {journeyData && (
                <>
                  <ListGroup>
                    <ListGroup.Item>{journeyData.journey_duration}</ListGroup.Item>
                    {/* <ListGroup.Item>Route: {selectedJourney}</ListGroup.Item> */}
                    {/* <ListGroup.Item>Distance: {selectedJourney.journey_dataset.distance_km} km</ListGroup.Item>
                    <ListGroup.Item>Duration: {selectedJourney.journey_dataset.duration_min} min</ListGroup.Item>
                    <ListGroup.Item>Start Time: {new Date(selectedJourney.journey_start_time).toLocaleString()}</ListGroup.Item> */}
                  </ListGroup>
                  {/* {selectedJourney && ( */}
                  <MapContainer
                    center={[53.34804851027272, -6.253359479333355]}
                    zoom={13}
                    style={{ height: '400px', width: '100%', marginTop: '20px' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline
                      positions={selectedJourney}
                      color="blue"
                    />
                  </MapContainer>
                  {/* )} */}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Row>
          <Col>
            <div className="bg-white p-4 shadow-sm rounded"><h4>No Journeys for this vehicle available.</h4></div>
          </Col>
        </Row>
      )}
    </Container>
  );
};



function Safety() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Safety Overview</h4>

          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Safety Tips</h4>
          </div>
        </Col>
      </Row>
    </>
  );
}

function Wiki() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Wiki</h4>
            <p>Here you can find detailed articles about vehicle telematics, safety, and efficiency.</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Chat with Our Bot</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Type your question here..." />
              </Form.Group>
              <Button variant="primary">Send</Button>
            </Form>
            <div className="mt-3">
              {/* <p><strong>Bot:</strong> How can I help you today?</p> */}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}



function ViewVehicle() {
  const [activeView, setActiveView] = useState('vehicleProfile');

  const renderView = () => {
    switch (activeView) {
      case 'vehicleProfile':
        return <VehicleProfile />;
      case 'usageEfficiency':
        return <UsageEfficiency />; //usage={usageData} />;
      // return <VehicleProfile vehicle={vehicleData} />;
      case 'safety':
        return <Safety />;
        return <VehicleProfile />;
      case 'wiki':
        return <Wiki />;
      default:
        return <div>Select a view from the sidebar.</div>;
    }
  };

  return (
    <main className="App">
      <div className="d-flex">
        <Sidebar setActiveView={setActiveView} />
        <Container className="flex-grow-1">{renderView()}</Container>
      </div>
    </main>
  );
}

export default ViewVehicle;
