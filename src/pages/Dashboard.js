import React from 'react';
import Sidebar from '../components/sidebar';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; // Import the heatmap styles

import Card from 'react-bootstrap/Card';

function myVehicles() {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </Card.Body>
    </Card>
  );
}

export default myVehicles;