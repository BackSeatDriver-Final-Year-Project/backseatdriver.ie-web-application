import { PieChart, Pie, Cell } from 'recharts';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button, Pagination } from 'react-bootstrap';
import Speedometer, {
    Background,
    Arc,
    Needle,
    Progress,
    Marks,
    Indicator,
    DangerPath,
} from 'react-speedometer';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import HeatmapLayer from "../../components/HeatMapLayer";

function Safety() {
    const heatmapPoints = [
        [53.2707, -9.0568, 0.5], // latitude, longitude, intensity
        [53.2717, -9.0565, 0.8],
        [53.2720, -9.0570, 1.0],
        // add more points here
    ];

    // Mock data for the dashboard
    const [safetyScore] = useState(86);

    const [trips] = useState([
        { date: 'Apr 24, 2025', description: 'Work Commute', distance: '18.3 km', safety: 'Safe', safetyColor: '#27ae60' },
        { date: 'Apr 23, 2025', description: 'Shopping Trip', distance: '7.2 km', safety: 'Fair', safetyColor: '#f1c40f' },
        { date: 'Apr 22, 2025', description: 'Airport Run', distance: '42.7 km', safety: 'Safe', safetyColor: '#27ae60' }
    ]);

    const [riskMetrics] = useState([
        { name: 'Hard Braking', incidents: 3, level: 30, color: '#e74c3c' },
        { name: 'Speeding', incidents: 7, level: 70, color: '#f1c40f' },
        { name: 'Acceleration', incidents: 2, level: 20, color: '#27ae60' }
    ]);

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

    // Gauge chart data for risk metrics
    const gaugeData = [
        { name: 'Danger', value: 33 },
        { name: 'Warning', value: 33 },
        { name: 'Safe', value: 34 }
    ];

    const GAUGE_COLORS = ['#e74c3c', '#f1c40f', '#27ae60'];

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
                <h1>Driver Safety Overview</h1>
                <Row>
                    <Col>
                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
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
                                {/* <div className="bg-blue-50 p-3 rounded-md flex items-center mt-4">
                                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                        <span className="font-bold">i</span>
                                    </div>
                                    <p className="text-sm text-gray-700">Tap incidents for details</p>
                                </div> */}
                            </div>
                        </div>
                        {/* </div> */}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* Second row */}
                        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"> */}
                        {/* Risk Metrics Panel - spans 3 columns */}
                        <div className="bg-white p-4 rounded-lg shadow md:col-span-3">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Risk Metrics</h3>
                            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
                            <Row>
                                {riskMetrics.map((metric, index) => (
                                    <Col>
                                        <div key={index} className="p-2">
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
                            {/* </div> */}
                        </div>
                    </Col>

                    <Col>
                    <div className="bg-white p-4 rounded-lg shadow md:col-span-3">
                    <MapContainer center={[53.2707, -9.0568]} zoom={13} style={{ width: '600px', height: '350px' }}>
                            <TileLayer
                                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
                            />
                            <HeatmapLayer points={heatmapPoints} />
                        </MapContainer>
                        </div>

                        {/* Recent Trips Panel - spans 2 columns */}
                        {/* <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Trips</h3>
                            <div className="space-y-2">
                                {trips.map((trip, index) => (
                                    <div key={index} className="bg-gray-100 p-3 rounded">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-gray-700">{trip.date} - {trip.description}</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-700">{trip.distance}</span>
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs text-white"
                                                    style={{ backgroundColor: trip.safetyColor }}
                                                >
                                                    {trip.safety}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        {/* </div> */}

                    </Col>
                </Row><div className="bg-gray-100 p-6 min-h-screen">



                </div>

            </Container>
        </>
    );
}

export default Safety;