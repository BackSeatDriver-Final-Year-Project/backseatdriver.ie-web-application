// import { Container, Row, Col, Table, Badge, ProgressBar, Card, ListGroup, Form, Button, Pagination } from 'react-bootstrap';

// function Wiki() {
//   return (
//     <>
//       <Container>
//         <Row className="mb-4">
//           <Col>
//             <h1>Back Seat Driver AI Client</h1>
//             <Form.Select aria-label="show prediction over next ">
//               <option>Open this select menu</option>
//               <option value="1 week">1 Week</option>
//               <option value="1 month">1 Month</option>
//               <option value="1 year">1 Year</option>
//             </Form.Select>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <div className="bg-white p-4 shadow-sm rounded">
//               <h4>Wiki</h4>
//               <p>Here you can find detailed articles about vehicle telematics, safety, and efficiency.</p>
//             </div>
//           </Col>
//           <Col>
//             <div className="bg-white p-4 shadow-sm rounded">
//               <h4>Wiki</h4>
//               <p>Here you can find detailed articles about vehicle telematics, safety, and efficiency.</p>
//             </div>
//           </Col>
//           <Col>
//             <div className="bg-white p-4 shadow-sm rounded">
//               <h4>Wiki</h4>
//               <p>Here you can find detailed articles about vehicle telematics, safety, and efficiency.</p>
//             </div>
//           </Col>
//           <Col>
//             <div className="bg-white p-4 shadow-sm rounded">
//               <h4>Wiki</h4>
//               <p>Here you can find detailed articles about vehicle telematics, safety, and efficiency.</p>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// }
// export default Wiki;



// src/components/AITools/AIToolsPage.jsx
import React, { useState, useEffect } from 'react';
import './AITools.css';

const Wiki = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('maintenance-prediction');
  const [predictionResults, setPredictionResults] = useState(null);
  const [runningPrediction, setRunningPrediction] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data summary when component mounts
    fetchUserDataSummary();
  }, []);

  const fetchUserDataSummary = async () => {
    try {
      // Get current user ID from local storage or context
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`/api/user-data/summary/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserData(data);
      } else {
        setError('Failed to load your driving data');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    setRunningPrediction(true);
    setPredictionResults(null);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      
      const response = await fetch('/api/ai-tools/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          modelType: selectedModel
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPredictionResults(data);
      } else {
        setError(data.error || 'Failed to generate prediction');
      }
    } catch (err) {
      setError('Error running prediction model');
      console.error('Error running prediction:', err);
    } finally {
      setRunningPrediction(false);
    }
  };

  // List of AI models available
  const aiModels = [
    {
      id: 'maintenance-prediction',
      name: 'Maintenance Prediction',
      description: 'Predicts when your vehicle will need maintenance based on OBD-II data patterns',
      requiredDataPoints: ['engineLoad', 'coolantTemp', 'fuelSystem', 'vehicleSpeed', 'engineRPM']
    },
    {
      id: 'fuel-efficiency-optimization',
      name: 'Fuel Efficiency Optimization',
      description: 'Suggests optimized routes and driving habits to improve fuel economy',
      requiredDataPoints: ['vehicleSpeed', 'throttlePosition', 'fuelLevel', 'gpsCoordinates', 'tripDistance']
    },
    {
      id: 'driving-style-analysis',
      name: 'Driving Style Analysis',
      description: 'Uses machine learning to analyze your driving patterns and compare them to ideal driving behaviors',
      requiredDataPoints: ['vehicleSpeed', 'acceleration', 'braking', 'steering', 'engineRPM']
    },
    {
      id: 'route-optimization',
      name: 'Route Optimization',
      description: 'Learns your common routes and suggests alternatives that might save time or fuel',
      requiredDataPoints: ['gpsCoordinates', 'tripTimestamps', 'vehicleSpeed', 'fuelConsumption']
    },
    {
      id: 'vehicle-health-prediction',
      name: 'Vehicle Health Prediction',
      description: 'Predicts potential component failures before they occur',
      requiredDataPoints: ['dtcCodes', 'engineLoad', 'coolantTemp', 'oilPressure', 'batteryVoltage']
    }
  ];

  // Check if user has enough data for a model
  const hasRequiredData = (modelId) => {
    if (!userData || !userData.availableDataPoints) return false;
    
    const model = aiModels.find(m => m.id === modelId);
    if (!model) return false;
    
    return model.requiredDataPoints.every(
      dataPoint => userData.availableDataPoints.includes(dataPoint)
    );
  };

  // Renders the prediction results based on model type
  const renderPredictionResults = () => {
    if (!predictionResults) return null;

    switch (selectedModel) {
      case 'maintenance-prediction':
        return <MaintenancePredictionResults data={predictionResults} />;
      case 'fuel-efficiency-optimization':
        return <FuelEfficiencyResults data={predictionResults} />;
      case 'driving-style-analysis':
        return <DrivingStyleResults data={predictionResults} />;
      case 'route-optimization':
        return <RouteOptimizationResults data={predictionResults} />;
      case 'vehicle-health-prediction':
        return <VehicleHealthResults data={predictionResults} />;
      default:
        return <div>No visualization available for this model</div>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="ai-tools-container loading">
        <div className="loading-spinner"></div>
        <p>Loading your driving data...</p>
      </div>
    );
  }

  return (
    <div className="ai-tools-container">
      <div className="ai-tools-header">
        <h1>AI Insights Tools</h1>
        <p>Leverage artificial intelligence to gain deeper insights from your OBD-II data</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="model-selection-container">
        <h2>Select AI Model</h2>
        <div className="models-grid">
          {aiModels.map(model => (
            <div 
              key={model.id}
              className={`model-card ${selectedModel === model.id ? 'selected' : ''} ${!hasRequiredData(model.id) ? 'disabled' : ''}`}
              onClick={() => hasRequiredData(model.id) && setSelectedModel(model.id)}
            >
              <h3>{model.name}</h3>
              <p>{model.description}</p>
              {!hasRequiredData(model.id) && (
                <div className="data-missing-badge">
                  Insufficient data
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="selected-model-info">
          <h3>Selected: {aiModels.find(m => m.id === selectedModel)?.name}</h3>
          <p>Required data: {aiModels.find(m => m.id === selectedModel)?.requiredDataPoints.join(', ')}</p>
          <button 
            className="run-model-button" 
            onClick={runPrediction}
            disabled={runningPrediction || !hasRequiredData(selectedModel)}
          >
            {runningPrediction ? 'Running Analysis...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      <div className="prediction-results-container">
        {runningPrediction ? (
          <div className="running-prediction">
            <div className="loading-spinner"></div>
            <p>Running AI analysis on your driving data...</p>
          </div>
        ) : predictionResults ? (
          renderPredictionResults()
        ) : (
          <div className="no-results">
            <p>Select a model and run the analysis to see insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for Maintenance Prediction Results
const MaintenancePredictionResults = ({ data }) => {
  return (
    <div className="prediction-results maintenance">
      <h2>Maintenance Predictions</h2>
      
      <div className="prediction-urgency-scale">
        <div className="urgency-scale-header">
          <span>Low Urgency</span>
          <span>High Urgency</span>
        </div>
        <div className="urgency-scale-bar"></div>
      </div>
      
      <div className="maintenance-items">
        {data.predictions.map((item, index) => (
          <div key={index} className={`maintenance-item urgency-${item.urgency}`}>
            <div className="item-header">
              <h3>{item.component}</h3>
              <span className="urgency-badge">{item.urgency} urgency</span>
            </div>
            <p className="prediction">Predicted issue: {item.issue}</p>
            <p className="timeline">Estimated timeline: {item.timeline}</p>
            <p className="confidence">Confidence: {item.confidence}%</p>
            <div className="recommendation">
              <h4>Recommendation:</h4>
              <p>{item.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="data-insights">
        <h3>Data Insights</h3>
        <p>These predictions are based on patterns detected in your vehicle's sensor data compared with similar vehicles in our database.</p>
        <p>Total data points analyzed: {data.dataPointsAnalyzed}</p>
        <p>Model confidence score: {data.overallConfidence}%</p>
      </div>
    </div>
  );
};

// Component for Fuel Efficiency Results
const FuelEfficiencyResults = ({ data }) => {
  return (
    <div className="prediction-results fuel-efficiency">
      <h2>Fuel Efficiency Optimization</h2>
      
      <div className="efficiency-score">
        <div className="score-circle">
          <span className="score-value">{data.efficiencyScore}</span>
          <span className="score-label">Score</span>
        </div>
        <div className="score-description">
          <p>{data.scoreDescription}</p>
        </div>
      </div>
      
      <div className="optimization-recommendations">
        <h3>Recommendations to Improve Efficiency</h3>
        <div className="recommendations-list">
          {data.recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
              <div className="impact">
                <span>Potential impact:</span>
                <div className="impact-bars">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`impact-bar ${i < rec.impactLevel ? 'filled' : ''}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="route-optimization">
        <h3>Common Routes Analysis</h3>
        <p>{data.routeAnalysis.summary}</p>
        <div className="routes-list">
          {data.routeAnalysis.routes.map((route, index) => (
            <div key={index} className="route-item">
              <h4>{route.name}</h4>
              <p>Current efficiency: {route.currentEfficiency} MPG</p>
              <p>Potential efficiency: {route.potentialEfficiency} MPG</p>
              <p>Suggested improvement: {route.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component for Driving Style Results
const DrivingStyleResults = ({ data }) => {
  return (
    <div className="prediction-results driving-style">
      <h2>Driving Style Analysis</h2>
      
      <div className="style-profile">
        <h3>Your Driving Profile</h3>
        <div className="profile-traits">
          {data.drivingProfile.map((trait, index) => (
            <div key={index} className="trait-meter">
              <div className="trait-label">
                <span>{trait.name}</span>
                <span>{trait.value}/10</span>
              </div>
              <div className="trait-bar">
                <div 
                  className="trait-fill" 
                  style={{ width: `${trait.value * 10}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="style-classification">
        <h3>Driving Style Classification</h3>
        <div className="classification-result">
          <p>Your driving style is most similar to: <strong>{data.styleClassification.primaryStyle}</strong></p>
          <p className="classification-description">{data.styleClassification.description}</p>
        </div>
      </div>
      
      <div className="style-recommendations">
        <h3>Personalized Recommendations</h3>
        <div className="style-recommendations-list">
          {data.recommendations.map((rec, index) => (
            <div key={index} className="style-recommendation">
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
              <div className="benefits">
                <span>Benefits:</span>
                <ul>
                  {rec.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component for Route Optimization Results
const RouteOptimizationResults = ({ data }) => {
  return (
    <div className="prediction-results route-optimization">
      <h2>Route Optimization Analysis</h2>
      
      <div className="detected-routes">
        <h3>Frequently Detected Routes</h3>
        <div className="routes-summary">
          <p>We've analyzed {data.routesAnalyzed} trips and identified {data.frequentRoutes.length} frequent routes.</p>
        </div>
        
        <div className="routes-list">
          {data.frequentRoutes.map((route, index) => (
            <div key={index} className="route-card">
              <div className="route-header">
                <h4>{route.name}</h4>
                <span className="frequency">{route.frequency} trips/month</span>
              </div>
              
              <div className="route-details">
                <div className="detail-item">
                  <span className="label">Current avg. time:</span>
                  <span className="value">{route.currentTime} mins</span>
                </div>
                <div className="detail-item">
                  <span className="label">Current avg. fuel:</span>
                  <span className="value">{route.currentFuel} gal</span>
                </div>
              </div>
              
              <div className="optimization-suggestion">
                <h5>Suggested Optimization:</h5>
                <p>{route.optimizationSuggestion}</p>
                <div className="potential-savings">
                  <div className="saving-item">
                    <span className="label">Time saving:</span>
                    <span className="value highlight">{route.timeSaving} mins</span>
                  </div>
                  <div className="saving-item">
                    <span className="label">Fuel saving:</span>
                    <span className="value highlight">{route.fuelSaving} gal</span>
                  </div>
                </div>
              </div>
              
              <div className="departure-optimization">
                <h5>Optimal Departure Times:</h5>
                <div className="time-slots">
                  {route.optimalTimes.map((time, i) => (
                    <span key={i} className="time-slot">{time}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="annual-impact">
        <h3>Estimated Annual Impact</h3>
        <div className="impact-metrics">
          <div className="impact-item">
            <span className="impact-value">{data.annualImpact.timeSaving}</span>
            <span className="impact-label">Hours saved</span>
          </div>
          <div className="impact-item">
            <span className="impact-value">${data.annualImpact.fuelCostSaving}</span>
            <span className="impact-label">Fuel cost saved</span>
          </div>
          <div className="impact-item">
            <span className="impact-value">{data.annualImpact.CO2Reduction}</span>
            <span className="impact-label">CO2 reduction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for Vehicle Health Results
const VehicleHealthResults = ({ data }) => {
  return (
    <div className="prediction-results vehicle-health">
      <h2>Vehicle Health Prediction</h2>
      
      <div className="health-overview">
        <div className="health-score">
          <svg viewBox="0 0 100 100" className="score-gauge">
            <path 
              className="gauge-background" 
              d="M10,50 A40,40 0 1,1 90,50"
            />
            <path 
              className="gauge-fill" 
              d="M10,50 A40,40 0 1,1 90,50"
              style={{ 
                strokeDasharray: 126,
                strokeDashoffset: 126 - (data.overallHealth / 100) * 126 
              }}
            />
            <text x="50" y="50" className="gauge-text">{data.overallHealth}</text>
            <text x="50" y="65" className="gauge-label">Health Score</text>
          </svg>
        </div>
        
        <div className="health-summary">
          <p className="health-status">{data.healthSummary}</p>
        </div>
      </div>
      
      <div className="system-predictions">
        <h3>System Health Predictions</h3>
        <div className="systems-grid">
          {data.systemPredictions.map((system, index) => (
            <div key={index} className={`system-card health-level-${system.healthLevel}`}>
              <h4>{system.name}</h4>
              <div className="health-indicator">
                <div className="health-bar">
                  <div 
                    className="health-fill" 
                    style={{ width: `${system.healthScore}%` }}
                  ></div>
                </div>
                <span className="health-percentage">{system.healthScore}%</span>
              </div>
              <p className="prediction">{system.prediction}</p>
              <div className="timeline">
                <span className="label">Estimated time to service:</span>
                <span className={`value ${system.timeToService < 30 ? 'urgent' : ''}`}>
                  {system.timeToService} days
                </span>
              </div>
              <p className="recommendation">{system.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="data-indicators">
        <h3>Key Data Indicators</h3>
        <div className="indicators-list">
          {data.keyIndicators.map((indicator, index) => (
            <div key={index} className="indicator-item">
              <span className="indicator-name">{indicator.name}:</span>
              <span className={`indicator-value ${indicator.status}`}>
                {indicator.value} {indicator.unit}
              </span>
              <span className="indicator-range">
                Normal range: {indicator.normalRange}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wiki;