const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rfidRoutes = require('./routes/rfid');
const os = require('os');
const app = express();

const student = require("./routes/Student/StudentRoute");

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Middleware to parse JSON requests
app.use(express.json()); 

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use("/student", student);

const PORT = 5000;

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use(rfidRoutes); // Attach RFID routes

// Start the server
app.listen(5000, () => {
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
