const { pool } = require('../config/db'); // Use MySQL pool from config
const { insertAttendance, updateAttendanceStatus } = require('../models/attendanceModel');

const handleRFID = async (req, res) => {
  console.log('Received request body:', req.body); // Log the incoming body
  console.log('Received headers:', req.headers); // Log the incoming headers

  const { rfidTag } = req.body;
  if (!rfidTag) {
    return res.status(400).send({ message: 'rfidTag is missing in the request body.' });
  }

  try {
    const connection = await pool.getConnection();

    // Retrieve student information based on RFID Tag
    const [studentResult] = await connection.query(`
      SELECT s.student_id, s.first_name, s.last_name, s.email, s.username, s.address, 
             s.enrollment_date, s.payment, s.nic, s.photo, s.password, s.gender, 
             s.guardian_name, s.guardian_contact, s.st_type, c.courseName 
      FROM students s 
      JOIN courses c ON s.course_name = c.courseName 
      WHERE s.RFIDTagID = ?
    `, [rfidTag]);

    if (studentResult.length > 0) {
      const student = studentResult[0];

      // Check the most recent attendance record for today
      const today = new Date().toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'
      const [attendanceCheck] = await connection.query(`
        SELECT status 
        FROM Attendances 
        WHERE studentID = ? AND DATE(TimeStamp) = ? 
        ORDER BY TimeStamp DESC 
        LIMIT 1
      `, [student.student_id, today]);

      if (attendanceCheck.length > 0) {
        // Toggle the status based on the last recorded status
        const lastStatus = attendanceCheck[0].status;
        const newStatus = lastStatus === 'Present' ? 'Out' : 'Present';

        // Update the attendance record for today
        await updateAttendanceStatus(connection, student.student_id, newStatus);

        res.status(200).send({
          message: `Attendance status updated to "${newStatus}".`,
          student,
        });
      } else {
        // No attendance record for today; insert a new "Present" record
        await insertAttendance(connection, student);

        res.status(200).send({
          message: 'Attendance marked as "Present".',
          student,
        });
      }
    } else {
      res.status(404).send({ message: 'Student not found.' });
    }

    connection.release();
  } catch (error) {
    console.error('Error handling RFID:', error); // Log the error
    res.status(500).send({ message: 'An error occurred.', error: error.message });
  }
};

module.exports = { handleRFID };
