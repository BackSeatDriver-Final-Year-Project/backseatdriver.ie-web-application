import CalendarHeatmap from 'react-calendar-heatmap';
import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button } from 'react-bootstrap';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

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

const vehicleData = {
  make: 'Toyota',
  model: 'Corolla',
  year: '2020',
  fuelType: 'Petrol',
  mileage: '50,000 km',
  fuelEfficiency: '15 km/L',
  engineHealth: 'Good',
  tirePressure: 'Optimal',
  engineHealthScore: 85,
  trips: [
    { date: '2024-11-15', distance: '120 km', fuelUsed: '8 L' },
    { date: '2024-11-14', distance: '90 km', fuelUsed: '6 L' },
  ],
};

const usageData = {
  fuelCost: '€500',
  averageFuelEfficiency: '13 km/L',
  totalDistance: '5,000 km',
  ecoDrivingScore: 80,
  efficiencyTips: [
    'Avoid unnecessary acceleration.',
    'Maintain optimal tire pressure.',
    'Use cruise control on highways.',
  ],
};

const safetyData = {
  incidents: [
    { date: '2024-10-10', description: 'Harsh Braking Detected', severity: 'Moderate' },
    { date: '2024-09-22', description: 'Over Speeding Event', severity: 'High' },
  ],
  driverRating: 4.5,
  safetyTips: [
    'Maintain a safe following distance.',
    'Avoid distractions while driving.',
    'Stick to speed limits.',
  ],
};

function VehicleProfile({ vehicle }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBaFbI9gXbbJ334P10IRIenzDvBlyVvoqE',
  });

  return (
    <>
      {/* Vehicle Overview */}
      <Row className="mb-4">
        <Col>
          <div className="bg-white p-4 shadow-sm rounded">
            <h4>Vehicle Overview</h4>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <th>Make</th>
                  <td>{vehicle.make}</td>
                </tr>
                <tr>
                  <th>Model</th>
                  <td>{vehicle.model}</td>
                </tr>
                <tr>
                  <th>Year</th>
                  <td>{vehicle.year}</td>
                </tr>
                <tr>
                  <th>Fuel Type</th>
                  <td>{vehicle.fuelType}</td>
                </tr>
                <tr>
                  <th>Mileage</th>
                  <td>{vehicle.mileage}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <CalendarHeatmap
        startDate={shiftDate(today, -150)}
        endDate={today}
        values={randomValues}
        classForValue={value => {
          if (!value) {
            return 'color-empty';
          }
          return `color-github-${value.count}`;
        }}
        // tooltipDataAttrs={value => {
        //   return {
        //     'data-tip': `${value.date.toISOString().slice(0, 10)} has count: ${
        //       value.count
        //     }`,
        //   };
        // }}
        showWeekdayLabels={true}
        onClick={value => alert(`Clicked on value with count: ${value.count}`)}
      />

      {/* Current Location */}
      <Row>
        <Col>
          <div className="bg-white p-4 shadow-sm rounded" style={{ height: '400px' }}>
            <h4>Current Location</h4>
            {isLoaded ? (
              <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center}>
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}

function UsageEfficiency({ usage }) {
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
                  <td>{usage.fuelCost}</td>
                </tr>
                <tr>
                  <th>Average Fuel Efficiency</th>
                  <td>{usage.averageFuelEfficiency}</td>
                </tr>
                <tr>
                  <th>Total Distance Driven</th>
                  <td>{usage.totalDistance}</td>
                </tr>
                <tr>
                  <th>Eco-Driving Score</th>
                  <td>
                    <ProgressBar now={usage.ecoDrivingScore} label={`${usage.ecoDrivingScore}%`} variant="success" />
                  </td>
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
            <ListGroup>
              {usage.efficiencyTips.map((tip, index) => (
                <ListGroup.Item key={index}>{tip}</ListGroup.Item>
              ))}
            </ListGroup>
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
            <ListGroup>
              <ListGroup.Item>What is Telematics?</ListGroup.Item>
              <ListGroup.Item>How Telematics Improves Fleet Management</ListGroup.Item>
              <ListGroup.Item>Driving Safely with Real-Time Feedback</ListGroup.Item>
            </ListGroup>
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
              <p><strong>Bot:</strong> How can I help you today?</p>
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
        return <VehicleProfile vehicle={vehicleData} />;
      case 'usageEfficiency':
        return <UsageEfficiency usage={usageData} />;
      case 'safety':
        return <Safety safety={safetyData} />;
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
