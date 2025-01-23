const { pool } = require('../config/db');

// Function to insert attendance
const insertAttendance = async (connection, student) => {
  const query = `
    INSERT INTO Attendances (studentID, first_name, last_name, phone_number, address, enrollment_date, courseName, TimeStamp, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'Present')
  `;
  const values = [
    student.student_id,
    student.first_name,
    student.last_name,
    student.phone_number,
    student.address,
    student.enrollment_date,
    student.courseName
  ];

  await connection.query(query, values);
};

// Function to update attendance status
const updateAttendanceStatus = async (connection, studentID, status) => {
  const query = `
    UPDATE Attendances 
    SET status = ?, TimeStamp = NOW() 
    WHERE studentID = ? AND DATE(TimeStamp) = CURDATE()
  `;
  const values = [status, studentID];

  await connection.query(query, values);
};

module.exports = { insertAttendance, updateAttendanceStatus };
