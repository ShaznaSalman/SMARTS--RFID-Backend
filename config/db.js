const mysql = require('mysql2/promise');

const config = {
  host: 'localhost', // Your MySQL server address
  user: 'root', // Your MySQL username
  password: 'admin123', // Your MySQL password
  database: 'rfid_attendanceone', // Your database name
};

const pool = mysql.createPool(config);

pool.getConnection()
  .then((connection) => {
    console.log('Connected to MySQL Database');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error('Database Connection Failed: ', err);
  });

module.exports =  {pool} ;
