import { useParams, useNavigate } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
// import Graph from './Graph'; // Import the Graph component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import L from 'leaflet';


import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-speedometer';

const socket = io('https://backseatdriver-ie-api.onrender.com'); // Replace with your actual API endpoint


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


  return (
    <Container>

      {obdData ? (
        <Row>

          <Col className="col-info">
            <Row><Col className="col-info"><strong>Last Login:</strong>  Live</Col></Row>

            <div className="bg-white p-4 shadow-sm rounded" style={{ height: '400px' }}>
              <JourneyMap journey={obdData.jounrey} />
            </div>
          </Col>
          <Col>
            <Row>
              <Col>
                <Speedometer
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
            <Row>
              <Col className="col-info"><strong>Engine RPM:</strong> {obdData.engineRPM} RPM</Col>
              <Col className="col-info"><strong>Vehicle Speed:</strong> {obdData.vehicleSpeed} km/h</Col>
            </Row>
            <Row>
              <Col className="col-info"><strong>Fuel Level:</strong> {obdData.fuelLevel}%</Col>
              <Col className="col-info"><strong>Throttle Position:</strong> {obdData.throttlePosition}%</Col>
            </Row>
            <Row>
              <Col className="col-info"><strong>Mass Air Flow:</strong> {obdData.massAirFlow} g/s</Col>
              <Col className="col-info"><strong>Intake Air Temp:</strong> {obdData.intakeAirTemp}°C</Col>
            </Row>
            <Row>
              <Col className="col-info"><strong>Coolant Temp:</strong> {obdData.coolantTemp}°C</Col>
              {/* <li><strong>Latitude :</strong> {obdData.latitude}°C</li>
              <li><strong>Longitude :</strong> {obdData.longitude}°C</li> */}
            </Row>
          </Col>
          <Row>
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
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
      ) : (
        <Row>

          <Col>
            <Row><Col className="col-info"><strong>Last Login:</strong>  Yesterday</Col></Row>

            <div className="bg-white p-4 shadow-sm rounded" style={{ height: '400px' }}>
              <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[37.7749, -122.4194]} icon={customMarker}>
                  <Popup>Vehicle Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </Col>
          <Col>
            <Row>
              <Col>
                <Speedometer
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
            <Row>
              <Col className="col-info"><strong>Engine RPM:</strong> 0 RPM</Col>
              <Col className="col-info"><strong>Vehicle Speed:</strong> 0 km/h</Col>
            </Row>
            <Row>
              <Col className="col-info"><strong>Fuel Level:</strong> 0%</Col>
              <Col className="col-info"><strong>Throttle Position:</strong> 0%</Col>
            </Row>
            <Row>
              <Col className="col-info"><strong>Mass Air Flow:</strong> 0 g/s</Col>
              <Col className="col-info"><strong>Intake Air Temp:</strong> 0°C</Col>
            </Row>
            <Row>
              <Col className="col-info"><strong>Coolant Temp:</strong> 0°C</Col>
              {/* <li><strong>Latitude :</strong> {obdData.latitude}°C</li>
              <li><strong>Longitude :</strong> {obdData.longitude}°C</li> */}
            </Row>
          </Col>
          <Row>
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
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

      )}

    </Container>
  );
};


function UsageEfficiency() {//({ usage }) {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Usage & Efficiency</h4>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <th>Total Fuel Cost</th>
                  {/* <td>{usage.fuelCost}</td> */}
                </tr>
                <tr>
                  <th>Average Fuel Efficiency</th>
                  {/* <td>{usage.averageFuelEfficiency}</td> */}
                </tr>
                <tr>
                  <th>Total Distance Driven</th>
                  {/* <td>{usage.totalDistance}</td> */}
                </tr>
                <tr>
                  <th>Eco-Driving Score</th>
                  {/* <td>
                    <ProgressBar now={usage.ecoDrivingScore} label={`${usage.ecoDrivingScore}%`} variant="success" />
                  </td> */}
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Tips for Better Efficiency</h4>
            {/* <ListGroup>
              {usage.efficiencyTips.map((tip, index) => (
                <ListGroup.Item key={index}>{tip}</ListGroup.Item>
              ))}
            </ListGroup> */}
          </div>
        </Col>
      </Row>
    </>
  );
}

function Safety({ safety }) {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Safety Overview</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Incident</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {safety.incidents.map((incident, index) => (
                  <tr key={index}>
                    <td>{incident.date}</td>
                    <td>{incident.description}</td>
                    <td>
                      <Badge bg={incident.severity === 'High' ? 'danger' : 'warning'}>
                        {incident.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Safety Tips</h4>
            <ListGroup>
              {safety.safetyTips.map((tip, index) => (
                <ListGroup.Item key={index}>{tip}</ListGroup.Item>
              ))}
            </ListGroup>
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
        // return <Safety safety={safetyData} />;
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
