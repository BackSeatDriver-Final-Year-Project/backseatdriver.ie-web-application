import { useParams, useNavigate } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button, Pagination } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import L from 'leaflet';
import Modal from 'react-bootstrap/Modal';
import { Chart } from "react-google-charts";
import ChatbotWidget from "../chatbot/chatbot";
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
  DangerPath,
} from 'react-speedometer';
import { FaTrash } from 'react-icons/fa';
import HeatmapLayer from "../components/HeatMapLayer";

import UsageEfficiency from './sub-pages/UsageEfficiency';
import Wiki from './sub-pages/Wiki';
import Safety from './sub-pages/Safety';
import VehicleProfile from './sub-pages/VehicleProfile';

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

const handleDelete = (id) => {
  // Add confirmation if needed
  // Then call your delete API or update state
};

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
      <ChatbotWidget />
      <div className="d-flex">
        <Sidebar setActiveView={setActiveView} />
        <Container className="flex-grow-1">{renderView()}</Container>
      </div>
    </main>
  );
}

export default ViewVehicle;
