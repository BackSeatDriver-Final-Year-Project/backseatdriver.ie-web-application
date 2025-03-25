import { Container, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
// import ReactPlayer from 'react-player';

function HomePage() {
  return (
    <>
      {/* Full-Width Carousel */}
      {/* <Carousel className="mb-5">
        <Carousel.Item>
          <img
            src="https://via.placeholder.com/1920x600"
            alt="Driver Safety Insights"
            className="d-block w-100"
          />
          <Carousel.Caption>
            <h3>Driver Safety Insights</h3>
            <p>Monitor and improve driving habits to create safer roads.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="https://via.placeholder.com/1920x600"
            alt="Fleet Efficiency"
            className="d-block w-100"
          />
          <Carousel.Caption>
            <h3>Fleet Efficiency</h3>
            <p>Optimize routes and reduce operational costs for businesses.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="https://via.placeholder.com/1920x600"
            alt="Maintenance Alerts"
            className="d-block w-100"
          />
          <Carousel.Caption>
            <h3>Maintenance Alerts</h3>
            <p>Predict vehicle issues before they lead to costly breakdowns.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel> */}

      <Container>
        {/* Introduction Section */}
        {/* <Row className="mb-5">
          <Col>
            <h1>Welcome to BackSeatDriver</h1>
            <p className="lead">
              BackSeatDriver is a project dedicated to revolutionizing the way we understand driving behavior through the power of telematics. 
              By analyzing vehicle data and driver patterns, we aim to provide insights that promote safer roads, improve business efficiency, 
              and save lives.
            </p>
          </Col>
        </Row> */}

        {/* Why Telematics Matters */}
        {/* <Row className="mb-5">
          <Col md={8}>
            <h2>Why Telematics Matters</h2>
            <p>
              Telematics is at the heart of modern vehicle safety and efficiency. This technology involves collecting and analyzing data from vehicles in real-time, such as speed, location, braking patterns, and engine health. 
              By leveraging telematics, businesses can:
            </p>
            <ul>
              <li>Enhance driver safety through proactive behavior monitoring.</li>
              <li>Optimize fleet operations by reducing fuel costs and improving route efficiency.</li>
              <li>Identify vehicle maintenance needs before they become costly issues.</li>
              <li>Contribute to reducing road fatalities through data-driven insights and interventions.</li>
            </ul>
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <img
              src="https://via.placeholder.com/350x350"
              alt="Telematics illustration"
              className="img-fluid rounded shadow-sm"
            />
          </Col>
        </Row> */}

        {/* About Me Section */}
        {/* <Row className="mb-5">
          <Col md={4}>
            <img
              src="https://via.placeholder.com/350x350"
              alt="Caolán Maguire"
              className="rounded-circle shadow-sm mb-3"
            />
          </Col>
          <Col md={8}>
            <h2>About Me</h2>
            <p>
              My name is Caolán Maguire, and I’m passionate about using technology to solve real-world problems. 
              As part of my final-year project, I’ve created BackSeatDriver, a platform designed to empower drivers and businesses with actionable telematics insights.
            </p>
            <p>
              With a background in computing and software development, I’ve applied my expertise to explore how we can make driving safer, more efficient, and more environmentally friendly. This project reflects my dedication to innovation and the potential of technology to make a difference.
            </p>
          </Col>
        </Row> */}

        {/* Video Section */}
        {/* <Row className="mb-5">
          <Col>
            <h2>Telematics in Action</h2>
            <p>
              Watch how telematics transforms driving safety and efficiency in real-world scenarios:
            </p>

          </Col>
        </Row> */}

        {/* Call to Action */}
        {/* <Row className="mb-5">
          <Col>
            <h2>The Importance of Telematics in Reducing Road Fatalities</h2>
            <p>
              Road accidents are a leading cause of fatalities worldwide. Telematics has proven to be a powerful tool in reducing these numbers by identifying risky driving behaviors and enabling timely interventions. 
              With real-time monitoring and alerts, telematics empowers drivers to adopt safer habits and helps authorities respond to incidents more effectively.
            </p>
            <p>
              In addition, businesses leveraging telematics can ensure their fleets are not only efficient but also operated responsibly, contributing to a safer road environment for everyone.
            </p>
            <Button variant="primary" size="lg">
              Learn More About BackSeatDriver
            </Button>
          </Col>
        </Row> */}
      </Container>
    </>
  );
}

export default HomePage;
