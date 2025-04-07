import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
// import ReactPlayer from 'react-player';


function HomePage() {
return (

  <div>
  {/* Hero Section */}
  <div className="bg-dark text-light py-5 text-center">
    <Container>
      <h1 className="display-4 fw-bold">Advanced Telematics Solutions</h1>
      <p className="lead">
        Empowering OEMs with secure, scalable, and intelligent telematics
        solutions worldwide.
      </p>
      <Button variant="warning" size="lg" className="mt-3">
        Learn More
      </Button>
    </Container>
  </div>

  {/* Feature Cards Section */}
  <Container className="my-5">
    <Row className="g-4">
      <Col md={4}>
        <Card className="h-100 shadow-lg border-0">
          <Card.Body>
            <Card.Title>Connectivity Platform</Card.Title>
            <Card.Text>
              A robust platform enabling seamless and secure communication
              between vehicles and the cloud.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="h-100 shadow-lg border-0">
          <Card.Body>
            <Card.Title>Data Intelligence</Card.Title>
            <Card.Text>
              Transform raw telematics data into actionable insights to boost
              operational efficiency.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="h-100 shadow-lg border-0">
          <Card.Body>
            <Card.Title>OEM Integration</Card.Title>
            <Card.Text>
              Tailored solutions that align with OEM standards and integrate
              seamlessly into your existing systems.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>

  {/* Benefits Section */}
  <div className="bg-light py-5">
    <Container>
      <Row className="text-center">
        <Col>
          <h2 className="fw-bold">Why Choose Our Telematics?</h2>
          <p className="text-muted">
            Discover the advantages of working with a trusted industry leader
            in OEM telematics.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4} className="text-center">
          <h4>Global Coverage</h4>
          <p>
            Operate confidently with reliable connectivity across regions
            worldwide.
          </p>
        </Col>
        <Col md={4} className="text-center">
          <h4>Real-Time Monitoring</h4>
          <p>
            Gain access to up-to-date performance and usage data in real-time.
          </p>
        </Col>
        <Col md={4} className="text-center">
          <h4>Custom Dashboards</h4>
          <p>
            Visualize key metrics and KPIs with flexible and intuitive dashboards.
          </p>
        </Col>
      </Row>
    </Container>
  </div>

  {/* CTA Section */}
  <div className="bg-warning text-dark py-5 text-center">
    <Container>
      <h2 className="fw-bold">Ready to Elevate Your Telematics Strategy?</h2>
      <p className="lead">
        Contact us to see how our OEM solutions can work for your business.
      </p>
      <Button variant="dark" size="lg">
        Get in Touch
      </Button>
    </Container>
  </div>
</div>
);
} 

export default HomePage;
