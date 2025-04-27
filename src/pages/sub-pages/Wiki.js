import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button, Pagination } from 'react-bootstrap';
import { Scatter } from "react-chartjs-2";
import { SimpleLinearRegression } from "ml-regression-simple-linear";

// Register required Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const journeys = [
  { km: 10, fuelUsed: 0.8 },
  { km: 25, fuelUsed: 2.0 },
  { km: 40, fuelUsed: 3.2 },
  { km: 60, fuelUsed: 4.5 },
  { km: 80, fuelUsed: 6.0 },
];

export default function Wiki() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const X = journeys.map(j => j.km);
    const y = journeys.map(j => j.fuelUsed);

    const regression = new SimpleLinearRegression(X, y);
    setModel(regression);

    const predictedFuel = regression.predict(100); // Example: predict fuel for 100km
    setPrediction(predictedFuel);
  }, []);

  const data = {
    datasets: [
      {
        label: "Journey Data",
        data: journeys.map(j => ({ x: j.km, y: j.fuelUsed })),
        backgroundColor: "blue",
        showLine: false,
      },
      model && {
        label: "Regression Line",
        data: [
          { x: 0, y: model.predict(0) },
          { x: 100, y: model.predict(100) },
        ],
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        showLine: true,
        pointRadius: 0,
      },
    ].filter(Boolean),
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Kilometers Travelled",
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Fuel Used (Litres)",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Fuel Usage vs. Distance Travelled",
      },
    },
  };

  return (
    <Container>
      <Row>

        <h1>Prediction models</h1>

        <Col>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4>Fuel Prediction Model</h4>
            {prediction && <p>Predicted fuel for 100 km: {prediction.toFixed(2)} L</p>}
            <Scatter key={JSON.stringify(data)} data={data} options={options} />
          </div>
        </Col>


        <Col>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4>Fuel Prediction Model</h4>
            {prediction && <p>Predicted fuel for 100 km: {prediction.toFixed(2)} L</p>}
            <Scatter key={JSON.stringify(data)} data={data} options={options} />
          </div>
        </Col>


        <Col>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4>Fuel Prediction Model</h4>
            {prediction && <p>Predicted fuel for 100 km: {prediction.toFixed(2)} L</p>}
            <Scatter key={JSON.stringify(data)} data={data} options={options} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
