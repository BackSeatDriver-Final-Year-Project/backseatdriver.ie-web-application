import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button, Pagination } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Speedometer, {
    Background,
    Arc,
    Needle,
    Progress,
    Marks,
    Indicator,
    DangerPath,
} from 'react-speedometer';
import { Chart } from "react-google-charts";
import L from 'leaflet';

const customMarker = new L.Icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // Update this path
    iconSize: [41, 41],  // Default Leaflet marker size
    iconAnchor: [12, 41], // Center bottom point
    popupAnchor: [1, -34],
    // shadowUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // Optional
    shadowSize: [41, 41],
});

const socket = io('https://backseatdriver-ie-api.onrender.com'); // Replace with your actual API endpoint

const JourneyMap = ({ journey }) => {
    return (
        <MapContainer center={journey[0]} zoom={20} style={{ width: '100%', height: '100%' }}>
            <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
            />

            {/* Draw the journey on the map */}
            <Marker position={journey[0]} icon={customMarker}>
                <Popup>Start Point</Popup>
            </Marker>

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
                <Row>
                    <Col>
                        <div className="bg-white p-4 shadow-sm rounded">

                            <ul class="pulsing-list">
                                <li><h1>Live Data</h1></li>
                            </ul>

                        </div>

                        <div className="bg-white p-4 shadow-sm rounded" style={{ height: '450px' }}>
                            <h4>Location</h4>
                            <JourneyMap style={{ height: '90%' }} journey={obdData.jounrey} />

                        </div>

                        <div className="bg-white p-4 shadow-sm rounded">
                            <h4>Fuel Usage</h4>
                            {obdData.fuelLevel && (
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
                            )}
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
                            <br/>
                        </Row>

                        <Row>
                            {
                            <div id='live-console-output'>{JSON.stringify(obdData)}</div>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <div className='moderate_crash_report_card'>
                                    <small>Crash Reports</small> <br />
                                    <h1>{obdData.crash_reports.length}</h1><h4>Verified accidents during this journey</h4>
                                    {/* <button class="glossy-red-black-button">Click Me</button> */}
                                </div>
                            </Col>
                            <Col>
                                <div className='crash_report_card'>
                                    <small>Crash Reports</small> <br />
                                    <h1>{obdData.severe_crash_reports.length}</h1><h4>Verified accidents during this journey</h4>
                                    {/* <button class="glossy-red-black-button">Click Me</button> */}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <br/><br/>
                        </Row>

                        {/* <Row> */}
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

                            <Row>
                                <div className="bg-white p-4 shadow-sm rounded">
                                    <h4>Pie chart</h4>
                                    {obdData.speed_clock != null &&
                                        <><Chart
                                            chartType="PieChart"
                                            data={obdData.speed_clock}
                                            options={{
                                                title: "Travelling Speed",
                                            }}
                                            width={"600px"}
                                            height={"300px"} /></>
                                    }
                                </div>
                            </Row>

                    </Col>

                </Row>
            ) : (
                <>
                    <div id="overlay" onclick="off()">
                        <div id="text">Vehicle currently not running</div>
                    </div>
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

                                    <Col>
                                        <div className='moderate_crash_report_card'>
                                            <small>Crash Reports</small> <br />
                                            <h1>0</h1><h4>Verified accidents registerd to this vehicle</h4>
                                            <button class="glossy-red-black-button">Click Me</button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='crash_report_card'>
                                            <small>Crash Reports</small> <br />
                                            <h1>0</h1><h4>Verified accidents registerd to this vehicle</h4>
                                            <button class="glossy-red-black-button">Click Me</button>
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
}

export default VehicleProfile;