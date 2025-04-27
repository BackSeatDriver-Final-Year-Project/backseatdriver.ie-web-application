import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const customMarker = new L.Icon({
    iconUrl: 'https://cdn3.iconfinder.com/data/icons/font-awesome-solid/640/car-crash-512.png', // Update this path
    iconSize: [41, 41],  // Default Leaflet marker size
    iconAnchor: [12, 41], // Center bottom point
    popupAnchor: [1, -34],
    // shadowUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // Optional
    shadowSize: [41, 41],
});

// https://cdn3.iconfinder.com/data/icons/basicolor-signs-warnings/24/182_warning_notice_error-256.png
const customSevereMarker = new L.Icon({
    iconUrl: 'https://cdn3.iconfinder.com/data/icons/basicolor-signs-warnings/24/182_warning_notice_error-256.png', // Update this path
    iconSize: [41, 41],  // Default Leaflet marker size
    iconAnchor: [12, 41], // Center bottom point
    popupAnchor: [1, -34],
    // shadowUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // Optional
    shadowSize: [41, 41],
});

function Safety() {
    // State for API data
    const [safetyData, setSafetyData] = useState(null);
    const { id } = useParams();

    // Fetching the safety data via API on component mount
    useEffect(() => {
        const fetchSafetyData = async () => {
            try {
                const response = await fetch(`https://backseatdriver-ie-api.onrender.com/crash-data-summary/${id}`); // Replace with your API URL
                const data = await response.json();
                setSafetyData(data); // Store the API response in state
            } catch (error) {
                console.error('Error fetching safety data:', error);
            }
        };

        fetchSafetyData();
    }, [id]); // Added id to dependency array

    // Mock data for the dashboard
    const [safetyScore] = useState(86);

    // Risk metrics are now set after safetyData is fetched
    const [riskMetrics, setRiskMetrics] = useState([]);

    useEffect(() => {
        if (safetyData) {
            const metrics = [
                {
                    name: 'Hard Braking',
                    incidents: safetyData?.crashData?.total_hard_braking_events ?? 0,
                    level: (safetyData?.crashData?.total_hard_braking_events ?? 0) + 20,
                    color: '#e74c3c'
                },
                {
                    name: 'Speeding',
                    incidents: safetyData?.crashData?.total_speeding_events ?? 0,
                    level: (safetyData?.crashData?.total_speeding_events ?? 0) + 20,
                    color: '#f1c40f'
                },
                {
                    name: 'Acceleration',
                    incidents: safetyData?.crashData?.total_hard_acceleration_events ?? 0,
                    level: (safetyData?.crashData?.total_hard_acceleration_events ?? 0) + 20,
                    color: '#27ae60'
                }
            ]
                ;
            setRiskMetrics(metrics);
        }
    }, [safetyData]); // This effect runs every time safetyData is updated

    const [incidents] = useState([
        { type: 'Hard Braking', date: 'Apr 23', location: 'R112 near Dundrum', severity: 'Severe', color: '#f9e7e7', severityColor: '#e74c3c' },
        { type: 'Speeding', date: 'Apr 22', location: 'M50 Southbound', severity: 'Medium', color: '#f9f5e5', severityColor: '#f1c40f' }
    ]);

    // Safety score gauge data
    const scoreData = [
        { name: 'Score', value: safetyScore },
        { name: 'Remaining', value: 100 - safetyScore }
    ];

    const COLORS = ['#27ae60', '#ecf0f1'];
    const GAUGE_COLORS = ['#e74c3c', '#f1c40f', '#27ae60'];

    // Gauge chart data for risk metrics
    const gaugeData = [
        { name: 'Danger', value: 33 },
        { name: 'Warning', value: 33 },
        { name: 'Safe', value: 34 }
    ];

    // Needle component for gauge charts
    const GaugeNeedle = ({ cx, cy, value, length }) => {
        const angle = 180 + value * 1.8; // Map 0-100 to 180-0 degrees
        const radian = (angle * Math.PI) / 180;
        const x = cx + length * Math.cos(radian);
        const y = cy + length * Math.sin(radian);

        return (
            <>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke="#2c3e50" strokeWidth={2} />
                <circle cx={x} cy={y} r={3} fill="#2c3e50" />
            </>
        );
    };

    return (
        <>
            <Container>
                <h1>Vehicle & Driver safety stats</h1>
                {safetyData ? (
                    <>
                        {/* {JSON.stringify(safetyData, null, 2)} */}

                        <Row>
                            <Col>
                                {/* Safety Score Panel */}
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-bold text-gray-700 mb-4">Safety Score</h3>
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <PieChart width={180} height={180}>
                                                <Pie
                                                    data={scoreData}
                                                    cx={90}
                                                    cy={90}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    startAngle={180}
                                                    endAngle={-180}
                                                    paddingAngle={0}
                                                    dataKey="value"
                                                >
                                                    {scoreData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-bold text-gray-700">{safetyScore}</span>
                                                <span className="text-xs text-gray-500">out of 100</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                {/* Incident Reports Panel */}
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-bold text-gray-700 mb-4">Incident Reports</h3>
                                    <div className="space-y-3">
                                        {incidents.map((incident, index) => (
                                            <div
                                                key={index}
                                                className="p-3 rounded-md"
                                                style={{ backgroundColor: incident.color }}
                                            >
                                                <p className="font-bold" style={{ color: incident.severityColor }}>{incident.type}</p>
                                                <p className="text-sm text-gray-700">{incident.date} - {incident.location}</p>
                                                <div className="flex justify-end mt-1">
                                                    <span
                                                        className="px-2 py-0.5 rounded-full text-xs text-white"
                                                        style={{ backgroundColor: incident.severityColor }}
                                                    >
                                                        {incident.severity}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                {/* Risk Metrics Panel */}
                                <div className="bg-white p-4 rounded-lg shadow md:col-span-3">
                                    <h3 className="text-lg font-bold text-gray-700 mb-4">Risk Metrics</h3>
                                    <Row>
                                        {riskMetrics.map((metric, index) => (
                                            <Col key={index}>
                                                <div className="p-2">
                                                    <h4 className="text-center text-gray-700 mb-2">{metric.name}</h4>
                                                    <div className="relative flex justify-center mb-6">
                                                        <svg height="120" width="120">
                                                            <g transform="translate(60,60)">
                                                                <path d="M0,0 v-50 a50,50 0 0,1 43.3,25 z" fill="#e74c3c" />
                                                                <path d="M0,0 v-50 a50,50 0 0,0 -43.3,25 z" fill="#27ae60" />
                                                                <path d="M0,0 l43.3,-25 a50,50 0 0,1 -86.6,0 z" fill="#f1c40f" />
                                                                <circle cx="0" cy="0" r="5" fill="#2c3e50" />
                                                                <GaugeNeedle cx={0} cy={0} value={metric.level} length={45} />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div className="bg-gray-100 rounded-md h-5 w-full">
                                                        <div
                                                            className="h-full rounded-md"
                                                            style={{
                                                                width: `${metric.incidents * 12}%`,
                                                                backgroundColor: metric.color,
                                                                maxWidth: '100%'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-center text-gray-700 text-sm mt-1">{metric.incidents} incidents</p>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Col>
                            <Col>
                                <div className="bg-white p-4 rounded-lg shadow md:col-span-3">
                                    <h4>Crash reports</h4>
                                    {
                                        <ul>
                                            {/* <li>Crash count : {safetyData['crashData']['crash_reports'][0].length}</li> */}
                                            <li>Crash count: {safetyData?.crashData?.crash_reports?.[0]?.length ?? 0}</li>

                                            <li>Severe Crash count: {safetyData?.crashData?.severe_crash_reports?.[0]?.length ?? 0}</li>
                                            {/* <li>Severe Crash count : {safetyData['crashData']['severe_crash_reports'][0].length}</li> */}
                                        </ul>
                                    }

                                    <MapContainer center={[53.2707, -9.0568]} zoom={6} style={{ width: '600px', height: '350px' }}>
                                        <TileLayer
                                            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                            attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
                                        />



                                        {safetyData['crashData']?.['crash_reports']?.flat().map((event, index) => {
                                            const loc = event.location;

                                            if (!Array.isArray(loc) || loc.length !== 2 || typeof loc[0] !== 'number' || typeof loc[1] !== 'number') {
                                                return null; // Skip if location is missing or invalid
                                            }

                                            return (
                                                <Marker key={index} position={{ lat: loc[0], lng: loc[1] }} icon={customMarker}>
                                                    <Popup>
                                                        <strong>Severity:</strong> {event.severity}<br />
                                                        <strong>Time:</strong> {new Date(event.time).toLocaleString()}
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}

                                        {safetyData['crashData']?.['severe_crash_reports']?.flat().map((event, index) => {
                                            const loc = event.location;

                                            if (!Array.isArray(loc) || loc.length !== 2 || typeof loc[0] !== 'number' || typeof loc[1] !== 'number') {
                                                return null; // Skip if location is missing or invalid
                                            }

                                            return (
                                                <Marker key={index} position={{ lat: loc[0], lng: loc[1] }} icon={customSevereMarker}>
                                                    <Popup>
                                                        <strong>Severity:</strong> {event.severity}<br />
                                                        <strong>Time:</strong> {new Date(event.time).toLocaleString()}
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}





                                        {/* <HeatmapLayer
                                        points={safetyData['crashData']['crash_reports']}
                                        radius={30}
                                        blur={25}
                                    /> */}
                                    </MapContainer>
                                </div>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </Container>
        </>
    );
}

export default Safety;
