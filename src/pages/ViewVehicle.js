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
  DangerPath,
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


// Cache to avoid repeated API calls
const addressCache = {};

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=e4e285c2d4824e47997cecd555f2c65c`
    );
    const data = await response.json();
    return data.results[0]?.formatted || `${lat}, ${lon}`;
  } catch (error) {
    console.error("Reverse geocode error:");
    return `${lat}, ${lon}`;
  }
};


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

// Custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [1, -34],
});


const JourneyMap = ({ journey }) => {
  return (
    <MapContainer center={journey[0]} zoom={13} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
      />

      {/* Draw the journey on the map */}
      <Marker position={journey[0]} icon={customIcon}>
        <Popup>Start Point</Popup>
      </Marker>

      {/* <Marker position={endPoint} icon={customIcon}>
        <Popup>End Point</Popup>
      </Marker> */}
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


  console.log(obdData);


  return (
    <Container>

      {obdData ? (
        <Row>
          <Col>
            <div className="bg-white p-4 shadow-sm rounded">
              <h1>Live Data</h1>
              <b>Last login:</b> <i></i>

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

            <div className="bg-white p-4 shadow-sm rounded" style={{ height: '450px' }}>
              <h4>Location</h4>
              <JourneyMap style={{ height: '90%' }} journey={obdData.jounrey} />

            </div>

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
          <Col>
            <Row>
              <Col>
                <div className="bg-white p-4 shadow-sm rounded">
                  <h4>Dash</h4>
                  <Row>
                    <Col>
                      <Speedometer
                        width={200}
                        value={obdData.vehicleSpeed}
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
                        value={obdData.engineRPM}
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
              </Col>
            </Row>
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
                    <td>{obdData.engineRPM} RPM</td>
                  </tr>
                  <tr>

                    <td><strong>Fuel Level</strong></td>
                    <td>{obdData.fuelLevel}%</td>
                  </tr>
                  <tr>

                    <td><strong>Mass Air Flow</strong></td>
                    <td>{obdData.massAirFlow}g/s</td>
                  </tr>

                  <tr>

                    <td><strong>Coolant Temp</strong></td>
                    <td>{obdData.coolantTemp}°C</td>
                  </tr>
                  <tr>

                    <td><strong>Vehicle Speed</strong></td>
                    <td>{obdData.vehicleSpeed}km/h</td>
                  </tr>
                  <tr>

                    <td><strong>Throttle Position</strong></td>
                    <td>{obdData.throttlePosition}%</td>
                  </tr>
                  <tr>

                    <td><strong>Intake Air Temp</strong></td>
                    <td>{obdData.massAirFlow}°C</td>
                  </tr>
                </tbody>
              </Table>
            </Row>

          </Col>

        </Row>
      ) : (
        <>
          <div id="inactive-panel">
            <Row>
              <Col>
                <h1>Live Data</h1>
                <div className="bg-white p-4 shadow-sm rounded">

                  <b>Last login:</b> <i></i>

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
                      url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                      subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                      attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
                    />
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
          </div>
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
  const itemsPerPage = 5;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        const response = await fetch(`https://backseatdriver-ie-api.onrender.com/journeys/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`Error fetching journey data: ${response.statusText}`);
        const data = await response.json();

        const updatedData = await Promise.all(
          data.map(async (journey) => {
            const coords = journey.journey_dataset[journey.journey_dataset.length - 1].jounrey;
            const start = coords[0];
            const end = coords[coords.length - 1];

            const startAddr = await reverseGeocode(start[0], start[1]);
            const endAddr = await reverseGeocode(end[0], end[1]);

            return {
              ...journey,
              startAddress: startAddr,
              endAddress: endAddr,
            };
          })
        );

        setJourneyData(updatedData);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchJourneyData();
    }
  }, [id]);

  const handleShowModal = (journey) => {
    const coords = journey.journey_dataset[journey.journey_dataset.length - 1].jounrey;
    setSelectedJourney(coords);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = journeyData ? journeyData.slice(indexOfFirstItem, indexOfLastItem) : [];

  const totalPages = journeyData ? Math.ceil(journeyData.length / itemsPerPage) : 1;

  console.log(journeyData);

  return (
    <Container>
      <h1>Vehicle Usage</h1>
      {journeyData ? (
        <>
          <Row className="mb-4">
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                <CalendarHeatmap
                  values={[
                    { date: '2025-01-01', count: 1 },
                    { date: '2025-01-03', count: 4 },
                    { date: '2025-01-06', count: 2 },
                  ]}
                  classForValue={(value) => {
                    if (!value) return 'color-empty';
                    return `color-scale-${value.count}`;
                  }}
                />
              </div>

              <Row>
                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>TOTAL JOURNEYS</small><br />
                    <h1>10</h1>
                  </div>
                </Col>

                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>TOTAL DISTANCE TRAVELLED (KM)</small><br />
                    <h1>10</h1>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>AVERAGE ECO SCORE</small><br />
                    <h1>10</h1>
                  </div>
                </Col>

                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>AVERAGE JOURNEY DURATION</small><br />
                    <h1>10</h1>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>DAYS ACTIVE</small><br />
                    <h1>10</h1>
                  </div>
                </Col>

                {/* <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>TOTAL JOURNEYS</small><br />
                    <h1>10</h1>
                  </div>
                </Col> */}
              </Row>

            </Col>
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Your Journeys</h4>
                <ListGroup>
                  {currentItems.map((journey) => (
                    <ListGroup.Item key={journey.journey_id}>
                      Journey from <strong>{journey.startAddress}</strong> to <strong>{journey.endAddress}</strong> <br />
                      Duration: {journey.journeyDuration} <br/>
                      Date:  <br/>
                      <Button
                        style={{ background: 'rgb(74, 28, 111)' }}
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
              {selectedJourney && (
                <MapContainer
                  center={selectedJourney[0]}
                  zoom={13}
                  style={{ height: '400px', width: '100%', marginTop: '20px' }}
                >
                  <TileLayer
                    url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
                  />
                  <Polyline positions={selectedJourney} color="blue" />

                  <Marker position={selectedJourney[0]} icon={customIcon}>
                    <Popup>Start Point</Popup>
                  </Marker>

                  <Marker position={selectedJourney[selectedJourney.length - 1]} icon={customIcon}>
                    <Popup>End Point</Popup>
                  </Marker>

                </MapContainer>
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
            <small>Loading...</small>
          </Col>
        </Row>
      )
      }
    </Container >
  );
};


function Safety() {
  return (
    <>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1>Vehicle Safety</h1>
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
      </Container>
    </>
  );
}

function Wiki() {
  return (
    <>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1>Wiki</h1>
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
      </Container>
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
