import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button, Pagination } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { Chart } from "react-google-charts";
import { FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const handleDelete = (id) => {
  // Add confirmation if needed
  // Then call your delete API or update state
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const customIcon = new L.Icon({
  iconUrl: 'https://cdn2.iconfinder.com/data/icons/app-user-interface-6/48/Flag-256.png', // Update this path
  iconSize: [41, 41],  // Default Leaflet marker size
  iconAnchor: [12, 41], // Center bottom point
  popupAnchor: [1, -34],
  // shadowUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // Optional
  shadowSize: [41, 41],
});

const UsageEfficiency = () => {
  const { id } = useParams();
  const [journeyData, setJourneyData] = useState(null);
  const [journeyInfoData, setJourneyInfoData] = useState(null);
  const [journeySpeedometerData, setSpeedometerData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const itemsPerPage = 5;
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);

  const [aiResponse, setAiResponse] = useState('');

  // Function to fetch ChatGPT response
  // Function to fetch ChatGPT response
  // Function to fetch AI actionables with the journeyData object
  const getAIActionables = async () => {
    setLoading(true);
    try {
      // Construct the message using the journeyData object
      const userMessage = `
        Given the following driving habits, provide actionable advice for improving driving efficiency and safety:
        - Calender of when the user has driven: ${journeyInfoData.calendarHeatmap}
        - total number of jourenys taken in car: ${journeyInfoData.totalJourneys[0].total_journeys} liters/100km
        - total distance travelled in car: ${journeyInfoData.average_distance[0].total_distance_km}
        - average duration of a journey taken in this car in minutes ${journeyInfoData.averageDurationMinutes[0].avg_duration_minutes}
        - the grouped speeds at which the vehicle was traelling in ${journeySpeedometerData.speedClock}
      `;
      
      // Send the data to the ChatGPT API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer `, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: "You're an AI advisor for a telematics service. Provide driving advice and actionables based on the user's individual journey data provided." },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const actionables = data.choices[0].message.content;

      // Update state with AI response
      setAiResponse(actionables);
    } catch (error) {
      console.error("Error fetching response:", error);
      setAiResponse("Sorry, there was an error fetching the AI response.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchJourneyData = async () => {
      // try {
      const response = await fetch(`https://backseatdriver-ie-api.onrender.com/journeys/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return; //throw new Error(`Error fetching journey data: ${response.statusText}`);
      const data = await response.json();
      const updatedData = await Promise.all(
        data.map(async (journey) => {
          try {
            const coords = journey.journey_dataset?.jounrey;

            // Check if coords is a valid array with at least 2 points
            if (!Array.isArray(coords) || coords.length < 2) {
              return {
                ...journey,
                startAddress: 'Unknown (no valid coordinates)',
                endAddress: 'Unknown (no valid coordinates)',
              };
            }

            const start = coords[0];
            const end = coords[coords.length - 1];

            // Check if start or end are null or invalid
            if (!start || !end || start.length < 2 || end.length < 2) {
              return {
                ...journey,
                startAddress: 'Unknown (invalid start/end)',
                endAddress: 'Unknown (invalid start/end)',
              };
            }

            // Try reverse geocoding, catch any failures
            let startAddr = 'Unknown';
            let endAddr = 'Unknown';
            try {
              startAddr = 'start address';//await reverseGeocode(start[0], start[1]);
              endAddr = 'end address';//await reverseGeocode(end[0], end[1]);
            } catch (geoErr) {
              console.log(`Reverse geocoding failed for journey ${journey.id}:`, geoErr);
            }

            return {
              ...journey,
              startAddress: startAddr,
              endAddress: endAddr,
            };
          } catch (err) {
            console.error(`Error processing journey ${journey.id}:`, err);
            return {
              ...journey,
              startAddress: 'Unknown (processing error)',
              endAddress: 'Unknown (processing error)',
            };
          }
        })
      );


      setJourneyData(updatedData);
    };

    const fetchVehicleInfoData = async () => {
      try {
        const response = await fetch(`https://backseatdriver-ie-api.onrender.com/vehicle-summary/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`Error fetching journey data: ${response.statusText}`);
        const data = await response.json();
        setJourneyInfoData(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchVehicleSpeedometers = async () => {
      try {
        const response = await fetch(`https://backseatdriver-ie-api.onrender.com/vehicle-speed-summary/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`Error fetching journey data: ${response.statusText}`);
        const data = await response.json();
        const processedData = {
          speedClock: data.speedClock.map(([label, value], index) => {
            // Skip the header row or rows where value is null
            if (index === 0 || value === null) return [label, value];
            return [label, Number(value)];
          }),
        };
        setSpeedometerData(processedData);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchJourneyData();
      fetchVehicleInfoData();
      fetchVehicleSpeedometers();
    }
  }, [id]);

  const handleShowModal = (journey) => {
    const coords = journey.journey_dataset.jounrey;
    setSelectedJourney(journey);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = journeyData ? journeyData.slice(indexOfFirstItem, indexOfLastItem) : [];

  const totalPages = journeyData ? Math.ceil(journeyData.length / itemsPerPage) : 1;


  // Pie chart
  return (
    <Container>
      <h1>Vehicle Usage</h1>
      {journeyData ? (
        <>
          <Row className="mb-4">
            <Col>
              <div className="bg-white p-4 shadow-sm rounded">
                {journeyInfoData?.calendarHeatmap?.length > 0 && (
                  <>
                    <CalendarHeatmap
                      values={journeyInfoData.calendarHeatmap}
                      classForValue={(value) => {
                        if (!value) return 'color-empty';
                        return `color-scale-${value.count}`;
                      }}
                      tooltipDataAttrs={(value) => {
                        if (!value || !value.date) return null;
                        return {
                          'data-tip': `${value.date} — ${value.count} journeys`,
                        };
                      }}
                    />
                    <ReactTooltip />
                  </>
                )}
              </div>

              <Row>
                <Col>
                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>TOTAL JOURNEYS</small><br />
                    {/* <h1>{journeyInfoData['totalJourneys'][0]['total_journeys'] ?? ''}</h1> */}
                    <h1>{journeyInfoData?.totalJourneys?.[0]?.total_journeys ?? '0'}</h1>

                  </div>
                </Col>

                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>TOTAL DISTANCE TRAVELLED (KM)</small><br />
                    {/* <h1>{journeyInfoData['average_distance'][0]['total_distance_km']}</h1> */}
                    <h1>{journeyInfoData?.average_distance?.[0]?.total_distance_km ?? '0'}</h1>

                  </div>
                </Col>
              </Row>

              <Row>
                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>AVERAGE ECO SCORE</small><br />
                    <h1>~</h1>
                  </div>
                </Col>

                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>AVERAGE JOURNEY DURATION</small><br />
                    {/* <h1>{journeyInfoData['averageDurationMinutes'][0]['avg_duration_minutes'] ?? ''}</h1> */}
                    <h1>{journeyInfoData?.averageDurationMinutes?.[0]?.avg_duration_minutes ?? '0'}</h1>

                  </div>
                </Col>
              </Row>

              <Row>
                <Col>

                  <div className="bg-white p-4 shadow-sm rounded">
                    <small>DAYS ACTIVE</small><br />
                    {/* <h1>{journeyInfoData['activeDays'][0]['active_days'] ?? ''}</h1> */}
                    <h1>{journeyInfoData?.activeDays?.[0]?.active_days ?? '0'}</h1>

                  </div>
                </Col>

              </Row>

            </Col>
            <Col>
              <Chart
                chartType="PieChart"
                data={journeySpeedometerData && journeySpeedometerData.speedClock ? journeySpeedometerData.speedClock : []}  // Defaulting to an empty array if speedClock is missing
                options={{
                  title: "Travelling Speed",
                }}
                width={"100%"}
                height={"300px"}
              />



              <div className="bg-white p-4 shadow-sm rounded">
                <h4>Your Journeys</h4>
                <ListGroup>

                  {currentItems.map((journey) => (
                    <ListGroup.Item key={journey.journey_id ?? ''}>
                      Journey from <strong>{journey.startAddress}</strong> to <strong>{journey.endAddress}</strong> <br />
                      Duration: {journey.journeyDuration ?? ''} <br />
                      {/* Date: <br /> */}

                      {/* Delete Button */}
                      {/* <Button
                        variant="danger"
                        className="ms-2"
                        style={{ float: 'right' }}
                        onClick={() => handleDelete(journey.journey_id)}
                      >
                        <FaTrash />
                      </Button> */}

                      {/* View Journey Button */}
                      <Button
                        style={{ background: 'rgb(74, 28, 111)', float: 'right' }}
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

                  {totalPages > 1 && (
                    <>
                      {/* Always show the first page */}
                      <Pagination.Item
                        active={1 === currentPage}
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </Pagination.Item>

                      {/* Show leading ellipsis if needed */}
                      {currentPage > 4 && <Pagination.Ellipsis disabled />}

                      {/* Show up to 3 pages before/after current */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => page !== 1 && page !== totalPages)
                        .filter((page) => Math.abs(currentPage - page) <= 2)
                        .map((page) => (
                          <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Pagination.Item>
                        ))}

                      {/* Show trailing ellipsis if needed */}
                      {currentPage < totalPages - 3 && <Pagination.Ellipsis disabled />}

                      {/* Always show the last page */}
                      {totalPages > 1 && (
                        <Pagination.Item
                          active={currentPage === totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Pagination.Item>
                      )}
                    </>
                  )}

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
                  center={selectedJourney['journey_dataset']['jounrey'][0]}
                  zoom={20}
                  style={{ height: '400px', width: '100%', marginTop: '20px' }}
                >
                  <TileLayer
                    url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
                  />
                  <Polyline positions={selectedJourney['journey_dataset']['jounrey']} color="blue" />

                  <Marker position={selectedJourney['journey_dataset']['jounrey'][0]} icon={customIcon}>
                    <Popup>Start Point</Popup>
                  </Marker>

                  <Marker position={selectedJourney['journey_dataset']['jounrey'][selectedJourney['journey_dataset']['jounrey'].length - 1]} icon={customIcon}>
                    <Popup>End Point</Popup>
                  </Marker>

                </MapContainer>
              )}

              <br/>
              <br/>

              {/* Button to trigger AI actionables */}
              <button
                onClick={getAIActionables}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Loading..." : "Get AI Actionables"}
              </button>

              {/* Div to display AI response */}
              <div id="aiResponse" className="mt-3">
                {aiResponse && <p>{aiResponse}</p>}
              </div>

              <br/>
              <br/>

              {selectedJourney && (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Signal</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Journey ID</strong></td>
                      <td>{selectedJourney['journey_id'] ?? ''}</td>
                    </tr>


                    <tr>
                      <td><strong>Journey Start time</strong></td>
                      <td>{selectedJourney['journey_start_time']}</td>
                    </tr>


                    <tr>
                      <td><strong>Journey Start time</strong></td>
                      <td>{selectedJourney['journey_commence_time']}</td>
                    </tr>

                    <tr>
                      <td><strong>Journey Duration</strong></td>
                      <td>{selectedJourney['journeyDuration']}</td>
                    </tr>

                    <tr>
                      <td><strong>Start Address</strong></td>
                      <td>{selectedJourney['startAddress']}</td>
                    </tr>

                    <tr>
                      <td><strong>End Address</strong></td>
                      <td>{selectedJourney['endAddress']}</td>
                    </tr>


                    <tr>
                      <td><strong>Fuel Usage</strong></td>
                      <td>{JSON.stringify(selectedJourney['fuel_usage_dataset'][0].fuelLevel)}</td>
                    </tr>

                    <tr>
                      <td><strong>Fuel Usage</strong></td>
                      <td>{JSON.stringify(selectedJourney['fuel_usage_dataset'][selectedJourney['fuel_usage_dataset'].length - 1]['fuelLevel'])}</td>
                    </tr>


                  </tbody>
                </Table>
              )}

              {/* {selectedJourney && (
                <td>
                  {JSON.stringify(selectedJourney['journey_dataset']['jounrey'])}
                </td>
              )} */}

              {selectedJourney != null &&
                <><Chart
                  chartType="PieChart"
                  data={selectedJourney.journey_dataset.speed_clock}
                  options={{
                    title: "Travelling Speed",
                  }}
                  width={"600px"}
                  height={"300px"} /></>
              }
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
}


export default UsageEfficiency;