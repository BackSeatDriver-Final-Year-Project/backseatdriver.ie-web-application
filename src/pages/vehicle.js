// import React from 'react';
// import Sidebar from '../components/sidebar';
// import { Container, Row, Col, Button, Table } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
// import CalendarHeatmap from 'react-calendar-heatmap';
// import 'react-calendar-heatmap/dist/styles.css'; // Import the heatmap styles
// // import ReactTooltip from 'react-tooltip';

// const mapContainerStyle = {
//   width: '100%',
//   height: '100%',
// };

// const center = {
//   lat: 53.2707,
//   lng: -9.0568,
// };

// const today = new Date();

// // Dummy data for heatmap
// const heatmapData = [
//   { date: '2024-10-01', count: 2 },
//   { date: '2024-10-02', count: 3 },
//   { date: '2024-10-03', count: 1 },
//   { date: '2024-10-04', count: 5 },
//   { date: '2024-10-05', count: 4 },
//   { date: '2024-10-06', count: 6 },
//   { date: '2024-10-07', count: 2 },
//   // Add more dates as necessary
// ];

// function Dashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBaFbI9gXbbJ334P10IRIenzDvBlyVvoqE",
//   });

//   if (!token) {
//     return <div className="text-center mt-5">Not logged in</div>;
//   }

//   function shiftDate(date, numDays) {
//     const newDate = new Date(date);
//     newDate.setDate(newDate.getDate() + numDays);
//     return newDate;
//   }
  
//   function getRange(count) {
//     return Array.from({ length: count }, (_, i) => i);
//   }
  
//   function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }

//   const randomValues = getRange(200).map(index => {
//     return {
//       date: shiftDate(today, -index),
//       count: getRandomInt(1, 3),
//     };
//   });


//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <main className="App">
//       <div className="d-flex">
//         <Sidebar />
//         <Container className="flex-grow-1">

//           {/* Three white divs side by side */}
//           <Row className="mt-5">
//             {/* Div 1 - with table */}
//             <Col md={5}>
//               <div className="bg-white p-3 shadow-sm" style={{ height: '350px', overflowY: 'auto' }}>
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>Vehicle</th>
//                       <th>Connected Datetime</th>
//                       <th>Last Login</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>Car 1</td>
//                       <td>2024-10-16 14:35</td>
//                       <td>2024-10-16 15:50</td>
//                     </tr>
//                     <tr>
//                       <td>Car 2</td>
//                       <td>2024-10-15 11:20</td>
//                       <td>2024-10-15 12:45</td>
//                     </tr>
//                     <tr>
//                       <td>Truck A</td>
//                       <td>2024-10-14 09:10</td>
//                       <td>2024-10-14 10:30</td>
//                     </tr>
//                     <tr>
//                       <td>Van X</td>
//                       <td>2024-10-13 08:55</td>
//                       <td>2024-10-13 09:40</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>
//             </Col>

//             <Col md={7}>
//             <div>
//       <h1>react-calendar-heatmap demos</h1>
//       <p>Random values with onClick and react-tooltip</p>
//       <CalendarHeatmap
//         startDate={shiftDate(today, -150)}
//         endDate={today}
//         values={randomValues}
//         classForValue={value => {
//           if (!value) {
//             return 'color-empty';
//           }
//           return `color-github-${value.count}`;
//         }}
//         // tooltipDataAttrs={value => {
//         //   return {
//         //     'data-tip': `${value.date.toISOString().slice(0, 10)} has count: ${
//         //       value.count
//         //     }`,
//         //   };
//         // }}
//         showWeekdayLabels={true}
//         onClick={value => alert(`Clicked on value with count: ${value.count}`)}
//       />
//       {/* <ReactTooltip /> */}
//     </div>
//     </Col>



//           </Row>

//           {/* Google Maps in the long div */}
//           <Row className="mt-3">
//             <Col>
//               <div className="bg-white p-4 shadow-sm" style={{ height: '400px' }}>
//                 <GoogleMap
//                   mapContainerStyle={mapContainerStyle}
//                   zoom={10}
//                   center={center}
//                 >
//                   <Marker position={center} />
//                 </GoogleMap>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </main>
//   );
// }

// export default Dashboard;
