// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const rfidRoutes = require('./routes/rfid');
// const os = require('os');
// const app = express();

// const student = require("./routes/Student/StudentRoute");

// // Middleware
// app.use(cors()); // Enable Cross-Origin Resource Sharing

// // Middleware to parse JSON requests
// app.use(express.json()); 

// // Middleware to parse URL-encoded data
// app.use(express.urlencoded({ extended: true }));

// app.use("/student", student);

// const PORT = 5000;

// // Middleware
// app.use(bodyParser.json()); // Parse incoming JSON requests

// // Routes
// app.use(rfidRoutes); // Attach RFID routes

// // Start the server
// app.listen(5000, () => {
//     console.log(`Server is running on port ${PORT}`);

//     // Display accessible network IP addresses
//     const networkInterfaces = os.networkInterfaces();
//     console.log('Server accessible at:');
//     for (const interfaceName in networkInterfaces) {
//         networkInterfaces[interfaceName].forEach((iface) => {
//             if (iface.family === 'IPv4' && !iface.internal) {
//                 console.log(`http://${iface.address}:${PORT}`);
//             }
//         });
//     }
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rfidRoutes = require('./routes/rfid');
const os = require('os');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: 'shaznasalman10@gmail.com', // Your email
    pass: '', // Your email password or app password
  },
});

// Email sending route
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'shaznasalman10@gmail.com',
    to,
    subject,
    text,
  };
  console.log('Attempting to send email...');
  console.log('Email details:', mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred while sending email:', error); // Log error
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

// Student routes
const student = require("./routes/Student/StudentRoute");
app.use("/student", student);

// RFID routes
app.use(rfidRoutes); // Attach RFID routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Display accessible network IP addresses
  const networkInterfaces = os.networkInterfaces();
  console.log('Server accessible at:');
  for (const interfaceName in networkInterfaces) {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`http://${iface.address}:${PORT}`);
      }
    });
  }
});