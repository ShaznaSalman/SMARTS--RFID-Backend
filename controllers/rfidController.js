// const { pool } = require('../config/db'); // Use MySQL pool from config
// const { insertAttendance, updateAttendanceStatus } = require('../models/attendanceModel');

// const handleRFID = async (req, res) => {
//   console.log('Received request body:', req.body); // Log the incoming body
//   console.log('Received headers:', req.headers); // Log the incoming headers

//   const { rfidTag, location } = req.body; // Destructure both rfidTag and location
//   if (!rfidTag || !location) {
//     return res.status(400).send({ message: 'rfidTag or location is missing in the request body.' });
//   }

//   let connection;
//   try {
//     connection = await pool.getConnection();

//     if (location === 'guard') {
//       // Retrieve student information based on RFID Tag
//       const [studentResult] = await connection.query(`
//         SELECT s.student_id, s.first_name, s.last_name, s.email, s.username, s.address, 
//                s.enrollment_date, s.payment, s.nic, s.photo, s.password, s.gender, 
//                s.guardian_name, s.guardian_contact, s.st_type, c.courseName 
//         FROM students s 
//         JOIN courses c ON s.course_name = c.courseName 
//         WHERE s.RFIDTagID = ?
//       `, [rfidTag]);

//       if (studentResult.length > 0) {
//         const student = studentResult[0];

//         // Check the most recent attendance record for today
//         const today = new Date().toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'
//         const [attendanceCheck] = await connection.query(`
//           SELECT status 
//           FROM Attendances 
//           WHERE studentID = ? AND DATE(TimeStamp) = ? 
//           ORDER BY TimeStamp DESC 
//           LIMIT 1
//         `, [student.student_id, today]);

//         if (attendanceCheck.length > 0) {
//           // Toggle the status based on the last recorded status
//           const lastStatus = attendanceCheck[0].status;
//           const newStatus = lastStatus === 'Present' ? 'Out' : 'Present';

//           // Update the attendance record for today
//           await updateAttendanceStatus(connection, student.student_id, newStatus);

//           res.status(200).send({
//             message: `Attendance status updated to "${newStatus}".`,
//             student,
//           });
//         } else {
//           // No attendance record for today; insert a new "Present" record
//           await insertAttendance(connection, student);

//           res.status(200).send({
//             message: 'Attendance marked as "Present".',
//             student,
//           });
//         }
//       } else {
//         res.status(404).send({ message: 'Student not found.' });
//       }
//     } else if (location === 'hall01') {
//       // Retrieve student information based on RFID Tag
//       const [studentResult] = await connection.query(`
//         SELECT s.student_id, s.first_name, s.last_name
//         FROM Students s 
//         WHERE s.RFIDTagID = ?
//       `, [rfidTag]);

//       if (studentResult.length > 0) {
//         const student = studentResult[0];
//         const currentTime = new Date();
//         const currentHour = currentTime.getHours();
//         const currentDate = currentTime.toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'

//         // Format the current time as HH:mm:ss
//         const formattedTime = currentTime.toTimeString().split(' ')[0]; // Get time in HH:mm:ss format

//         // Determine if it's morning or evening session
//         let sessionColumnAttendance;
//         let sessionColumnDateTime;
//         let isValidAttendance = false;

//         // Check for morning session (8 AM to 11 AM)
//         if (currentHour >= 8 && currentHour < 12) {
//           sessionColumnAttendance = 'MorningAttendance';
//           sessionColumnDateTime = 'Morning_time'; // Updated to match the new column name
//           isValidAttendance = true;
//         }
//         // Check for evening session (12 PM to 5 PM)
//         else if (currentHour >= 12 && currentHour < 17) {
//           sessionColumnAttendance = 'EveningAttendance';
//           sessionColumnDateTime = 'Evening_time'; // Updated to match the new column name
//           isValidAttendance = true;
//         }

//         if (!isValidAttendance) {
//           return res.status(400).send({ message: 'Attendance can only be marked between 8 AM - 11 AM for morning and 12 PM - 5 PM for evening.' });
//         }

//         // Check if the student has already marked attendance for today
//         const [attendanceCheck] = await connection.query(`
//           SELECT * 
//           FROM lecture_attendance 
//           WHERE StudentID = ? AND AttendanceDate = ?
//         `, [student.student_id, currentDate]);

//         if (attendanceCheck.length > 0) {
//           // Update the existing record
//           await connection.query(`
//             UPDATE lecture_attendance 
//             SET ${sessionColumnAttendance} = 'Present', ${sessionColumnDateTime} = ?, Hall_no = 'hall01' 
//             WHERE StudentID = ? AND AttendanceDate = ?
//           `, [formattedTime, student.student_id, currentDate]);

//           res.status(200).send({
//             message: `Attendance updated for ${sessionColumnAttendance}.`,
//             student,
//           });
//         } else {
//           // Insert a new record
//           await connection.query(`
//             INSERT INTO lecture_attendance (StudentID, StudentName, MorningAttendance, Morning_time, EveningAttendance, Evening_time, AttendanceDate, Hall_no) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//           `, [
//             student.student_id,
//             `${student.first_name} ${student.last_name}`, // Correctly concatenate first and last names
//             sessionColumnAttendance === 'MorningAttendance' ? 'Present' : null,
//             sessionColumnAttendance === 'MorningAttendance' ? formattedTime : null,
//             sessionColumnAttendance === 'EveningAttendance' ? 'Present' : null,
//             sessionColumnAttendance === 'EveningAttendance' ? formattedTime : null,
//             currentDate,
//             'hall01' // Set Hall_no to 'hall01'
//           ]);

//           res.status(200).send({
//             message: 'Attendance marked successfully.',
//             student,
//           });
//         }
//       } else {
//         res.status(404).send({ message: 'Student not found.' });
//       }
//     } else {
//       res.status(400).send({ message: 'Invalid location provided.' });
//     }
//   } catch (error) {
//     console.error('Error handling RFID:', error); // Log the error
//     res.status(500).send({ message: 'An error occurred.', error: error.message });
//   } finally {
//     if (connection) connection.release(); // Ensure the connection is released
//   }
// };

// module.exports = { handleRFID };


// const { pool } = require('../config/db'); // Use MySQL pool from config
// const { insertAttendance, updateAttendanceStatus } = require('../models/attendanceModel');

// const handleRFID = async (req, res) => {
//   console.log('Received request body:', req.body); // Log the incoming body
//   console.log('Received headers:', req.headers); // Log the incoming headers

//   const { rfidTag, location } = req.body; // Destructure both rfidTag and location
//   if (!rfidTag || !location) {
//     return res.status(400).send({ message: 'rfidTag or location is missing in the request body.' });
//   }

//   let connection;
//   try {
//     connection = await pool.getConnection();

//     if (location === 'guard') {
//       // Retrieve student information based on RFID Tag
//       const [studentResult] = await connection.query(`
//         SELECT s.student_id, s.first_name, s.last_name, s.email, s.username,s.phone_number, s.address, 
//                s.enrollment_date, s.payment, s.nic, s.photo, s.password, s.gender, 
//                s.guardian_name, s.guardian_contact, s.st_type, c.courseName 
//         FROM students s 
//         JOIN courses c ON s.course_name = c.courseName 
//         WHERE s.RFIDTagID = ?
//       `, [rfidTag]);

//       if (studentResult.length > 0) {
//         const student = studentResult[0];

//         // Check the most recent attendance record for today
//         const today = new Date().toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'
//         const [attendanceCheck] = await connection.query(`
//           SELECT status 
//           FROM Attendances 
//           WHERE studentID = ? AND DATE(TimeStamp) = ? 
//           ORDER BY TimeStamp DESC 
//           LIMIT 1
//         `, [student.student_id, today]);

//         if (attendanceCheck.length > 0) {
//           // Toggle the status based on the last recorded status
//           const lastStatus = attendanceCheck[0].status;
//           const newStatus = lastStatus === 'Present' ? 'Out' : 'Present';

//           // Update the attendance record for today
//           await updateAttendanceStatus(connection, student.student_id, newStatus);

//           res.status(200).send({
//             message: Attendance status updated to "${newStatus}".,
//             student,
//           });
//         } else {
//           // No attendance record for today; insert a new "Present" record
//           await insertAttendance(connection, student);

//           res.status(200).send({
//             message: 'Attendance marked as "Present".',
//             student,
//           });
//         }
//       } else {
//         res.status(404).send({ message: 'Student not found.' });
//       }
//     } else if (location === 'hall01') {
//       // Retrieve student information based on RFID Tag
//       const [studentResult] = await connection.query(`
//         SELECT s.student_id, s.first_name, s.last_name
//         FROM Students s 
//         WHERE s.RFIDTagID = ?
//       `, [rfidTag]);

//       if (studentResult.length > 0) {
//         const student = studentResult[0];
//         const currentTime = new Date();
//         const currentHour = currentTime.getHours();
//         const currentDate = currentTime.toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'

//         // Format the current time as HH:mm:ss
//         const formattedTime = currentTime.toTimeString().split(' ')[0]; // Get time in HH:mm:ss format

//         // Determine if it's morning or evening session
//         let sessionColumnAttendance;
//         let sessionColumnDateTime;
//         let isValidAttendance = false;

//         // Check for morning session (8 AM to 11 AM)
//         if (currentHour >= 8 && currentHour < 12) {
//           sessionColumnAttendance = 'MorningAttendance';
//           sessionColumnDateTime = 'Morning_time'; // Updated to match the new column name
//           isValidAttendance = true;
//         }
//         // Check for evening session (12 PM to 5 PM)
//         else if (currentHour >= 12 && currentHour < 17) {
//           sessionColumnAttendance = 'EveningAttendance';
//           sessionColumnDateTime = 'Evening_time'; // Updated to match the new column name
//           isValidAttendance = true;
//         }

//         if (!isValidAttendance) {
//           return res.status(400).send({ message: 'Attendance can only be marked between 8 AM - 11 AM for morning and 12 PM - 5 PM for evening.' });
//         }

//         // Check if the student has already marked attendance for today
//         const [attendanceCheck] = await connection.query(`
//           SELECT * 
//           FROM lecture_attendance 
//           WHERE StudentID = ? AND AttendanceDate = ?
//         `, [student.student_id, currentDate]);

//         if (attendanceCheck.length > 0) {
//           // Update the existing record
//           await connection.query(`
//             UPDATE lecture_attendance 
//             SET ${sessionColumnAttendance} = 'Present', ${sessionColumnDateTime} = ?, Hall_no = 'hall01' 
//             WHERE StudentID = ? AND AttendanceDate = ?
//           `, [formattedTime, student.student_id, currentDate]);

//           res.status(200).send({
//             message: Attendance updated for ${sessionColumnAttendance}.,
//             student,
//           });
//         } else {
//           // Insert a new record
//           await connection.query(`
//             INSERT INTO lecture_attendance (StudentID, StudentName, MorningAttendance, Morning_time, EveningAttendance, Evening_time, AttendanceDate, Hall_no) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//           `, [
//             student.student_id,
//             ${student.first_name} ${student.last_name}, // Correctly concatenate first and last names
//             sessionColumnAttendance === 'MorningAttendance' ? 'Present' : null,
//             sessionColumnAttendance === 'MorningAttendance' ? formattedTime : null,
//             sessionColumnAttendance === 'EveningAttendance' ? 'Present' : null,
//             sessionColumnAttendance === 'EveningAttendance' ? formattedTime : null,
//             currentDate,
//             'hall01' // Set Hall_no to 'hall01'
//           ]);

//           res.status(200).send({
//             message: 'Attendance marked successfully.',
//             student,
//           });
//         }
//       } else {
//         res.status(404).send({ message: 'Student not found.' });
//       }
//     } else {
//       res.status(400).send({ message: 'Invalid location provided.' });
//     }
//   } catch (error) {
//     console.error('Error handling RFID:', error); // Log the error
//     res.status(500).send({ message: 'An error occurred.', error: error.message });
//   } finally {
//     if (connection) connection.release(); // Ensure the connection is released
//   }
// };

// module.exports = { handleRFID };


// const { pool } = require('../config/db'); // Use MySQL pool from config
// const { insertAttendance, updateAttendanceStatus } = require('../models/attendanceModel');

// const handleRFID = async (req, res) => {
//   console.log('Received request body:', req.body);
//   console.log('Received headers:', req.headers);

//   const { rfidTag, location } = req.body;
//   if (!rfidTag || !location) {
//     return res.status(400).json({ message: 'rfidTag or location is missing in the request body.' });
//   }

//   let connection;
//   try {
//     connection = await pool.getConnection();

//     // Handling attendance at the guard
//     if (location === 'guard') {
//       const [studentResult] = await connection.query(
//         `SELECT s.student_id, s.first_name, s.last_name, s.email, s.username, 
//                 s.phone_number, s.address, s.enrollment_date, s.payment, s.nic, 
//                 s.photo, s.password, s.gender, s.guardian_name, s.guardian_contact, 
//                 s.st_type, c.courseName 
//          FROM students s 
//          JOIN courses c ON s.course_name = c.courseName 
//          WHERE s.RFIDTagID = ?`,
//         [rfidTag]
//       );

//       if (studentResult.length > 0) {
//         const student = studentResult[0];
//         const today = new Date().toISOString().split('T')[0];

//         const [attendanceCheck] = await connection.query(
//           `SELECT status 
//            FROM Attendances 
//            WHERE studentID = ? AND DATE(TimeStamp) = ? 
//            ORDER BY TimeStamp DESC 
//            LIMIT 1`,
//           [student.student_id, today]
//         );

//         const newStatus = attendanceCheck.length > 0 && attendanceCheck[0].status === 'Present' ? 'Out' : 'Present';

//         await updateAttendanceStatus(connection, student.student_id, newStatus);
//         await insertPermanentAttendance(connection, student, newStatus, 'entry', null);

//         res.status(200).json({
//           message: `Attendance status updated to "${newStatus}".`,
//           student,
//         });
//       } else {
//         res.status(404).json({ message: 'Student not found.' });
//       }
//     } 
    
//     // Handling attendance in hall01
//     else if (location === 'hall01') {
//       const [studentResult] = await connection.query(
//         `SELECT student_id, first_name, last_name FROM students WHERE RFIDTagID = ?`,
//         [rfidTag]
//       );

//       if (studentResult.length > 0) {
//         const student = studentResult[0];
//         const currentTime = new Date();
//         const currentDate = currentTime.toISOString().split('T')[0];
//         const formattedTime = currentTime.toTimeString().split(' ')[0];

//         let sessionColumnAttendance, sessionColumnDateTime;
//         if (currentTime.getHours() >= 8 && currentTime.getHours() < 12) {
//           sessionColumnAttendance = 'MorningAttendance';
//           sessionColumnDateTime = 'Morning_time';
//         } else if (currentTime.getHours() >= 12 && currentTime.getHours() < 23) {
//           sessionColumnAttendance = 'EveningAttendance';
//           sessionColumnDateTime = 'Evening_time';
//         } else {
//           return res.status(400).json({
//             message: 'Attendance can only be marked between 8 AM - 11 AM for morning and 12 PM - 5 PM for evening.',
//           });
//         }

//         const [attendanceCheck] = await connection.query(
//           `SELECT * FROM lecture_attendance WHERE StudentID = ? AND AttendanceDate = ?`,
//           [student.student_id, currentDate]
//         );

//         if (attendanceCheck.length > 0) {
//           await connection.query(
//             `UPDATE lecture_attendance 
//              SET ${sessionColumnAttendance} = 'Present', ${sessionColumnDateTime} = ?, Hall_no = 'hall01' 
//              WHERE StudentID = ? AND AttendanceDate = ?`,
//             [formattedTime, student.student_id, currentDate]
//           );
//         } else {
//           await connection.query(
//             `INSERT INTO lecture_attendance 
//              (StudentID, StudentName, MorningAttendance, Morning_time, EveningAttendance, Evening_time, AttendanceDate, Hall_no) 
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//               student.student_id,
//               `${student.first_name} ${student.last_name}`,
//               sessionColumnAttendance === 'MorningAttendance' ? 'Present' : null,
//               sessionColumnAttendance === 'MorningAttendance' ? formattedTime : null,
//               sessionColumnAttendance === 'EveningAttendance' ? 'Present' : null,
//               sessionColumnAttendance === 'EveningAttendance' ? formattedTime : null,
//               currentDate,
//               'hall01',
//             ]
//           );
//         }

//         await insertPermanentAttendance(connection, student, 'Present', 'lecture', 'hall01');

//         res.status(200).json({
//           message: `Attendance marked for ${sessionColumnAttendance}.`,
//           student,
//         });
//       } else {
//         res.status(404).json({ message: 'Student not found.' });
//       }
//     } 
    
//     // Invalid location
//     else {
//       res.status(400).json({ message: 'Invalid location provided.' });
//     }
//   } catch (error) {
//     console.error('Error handling RFID:', error);
//     res.status(500).json({ message: 'An error occurred.', error: error.message });
//   } finally {
//     if (connection) connection.release();
//   }
// };

// const insertPermanentAttendance = async (connection, student, status, attendanceType, hallNo) => {
//   try {
//     await connection.query(
//       `INSERT INTO permanent_attendance 
//        (studentID, first_name, last_name, phone_number, address, enrollment_date, courseName, attendance_type, timestamp, status, hall_no)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
//       [
//         student.student_id,
//         student.first_name,
//         student.last_name,
//         student.phone_number || null,
//         student.address || null,
//         student.enrollment_date || null,
//         student.courseName || null,
//         attendanceType,
//         status,
//         hallNo || null,
//       ]
//     );
//   } catch (error) {
//     console.error('Error inserting into permanent_attendance:', error);
//   }
// };

// module.exports = { handleRFID };


const { pool } = require('../config/db'); // Use MySQL pool from config
const { insertAttendance, updateAttendanceStatus } = require('../models/attendanceModel');

const handleRFID = async (req, res) => {
  console.log('Received request body:', req.body); // Log the incoming body
  console.log('Received headers:', req.headers); // Log the incoming headers

  const { rfidTag, location } = req.body; // Destructure both rfidTag and location
  if (!rfidTag || !location) {
    return res.status(400).send({ message: 'rfidTag or location is missing in the request body.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    if (location === 'guard') {
      const [studentResult] = await connection.query(`
        SELECT s.student_id, s.first_name, s.last_name, s.email, s.username, s.phone_number, s.address, 
               s.enrollment_date, s.payment, s.nic, s.photo, s.password, s.gender, 
               s.guardian_name, s.guardian_contact, s.st_type, c.courseName 
        FROM students s 
        JOIN courses c ON s.course_name = c.courseName 
        WHERE s.RFIDTagID = ?
      `, [rfidTag]);

      if (studentResult.length > 0) {
        const student = studentResult[0];

        const today = new Date().toISOString().split('T')[0];
        const [attendanceCheck] = await connection.query(`
          SELECT status 
          FROM Attendances 
          WHERE studentID = ? AND DATE(TimeStamp) = ? 
          ORDER BY TimeStamp DESC 
          LIMIT 1
        `, [student.student_id, today]);

        if (attendanceCheck.length > 0) {
          const lastStatus = attendanceCheck[0].status;
          const newStatus = lastStatus === 'Present' ? 'Out' : 'Present';

          await updateAttendanceStatus(connection, student.student_id, newStatus);
          await insertPermanentAttendance(connection, student, newStatus, 'entry', null);

          res.status(200).send({
            message: `Attendance status updated to "${newStatus}".`,
            student,
          });
        } else {
          await insertAttendance(connection, student);
          await insertPermanentAttendance(connection, student, 'Present', 'entry', null);

          res.status(200).send({
            message: 'Attendance marked as "Present".',
            student,
          });
        }
      } else {
        res.status(404).send({ message: 'Student not found.' });
      }
    } else if (location === 'hall01') {
      const [studentResult] = await connection.query(`
        SELECT s.student_id, s.first_name, s.last_name
        FROM Students s 
        WHERE s.RFIDTagID = ?
      `, [rfidTag]);

      if (studentResult.length > 0) {
        const student = studentResult[0];
        const currentTime = new Date();
        const currentDate = currentTime.toISOString().split('T')[0];
        const formattedTime = currentTime.toTimeString().split(' ')[0];

        let sessionColumnAttendance;
        let sessionColumnDateTime;
        let isValidAttendance = false;

        if (currentTime.getHours() >= 8 && currentTime.getHours() < 12) {
          sessionColumnAttendance = 'MorningAttendance';
          sessionColumnDateTime = 'Morning_time';
          isValidAttendance = true;
        } else if (currentTime.getHours() >= 12 && currentTime.getHours() < 23) {
          sessionColumnAttendance = 'EveningAttendance';
          sessionColumnDateTime = 'Evening_time';
          isValidAttendance = true;
        }

        if (!isValidAttendance) {
          return res.status(400).send({ message: 'Attendance can only be marked between 8 AM - 11 AM for morning and 12 PM - 5 PM for evening.' });
        }

        const [attendanceCheck] = await connection.query(`
          SELECT * 
          FROM lecture_attendance 
          WHERE StudentID = ? AND AttendanceDate = ?
        `, [student.student_id, currentDate]);

        if (attendanceCheck.length > 0) {
          await connection.query(`
            UPDATE lecture_attendance 
            SET ${sessionColumnAttendance} = 'Present', ${sessionColumnDateTime} = ?, Hall_no = 'hall01' 
            WHERE StudentID = ? AND AttendanceDate = ?
          `, [formattedTime, student.student_id, currentDate]);

          await insertPermanentAttendance(connection, student, 'Present', 'lecture', 'hall01');

          res.status(200).send({
            message: `Attendance updated for ${sessionColumnAttendance}.`,
            student,
          });
        } else {
          await connection.query(`
            INSERT INTO lecture_attendance (StudentID, StudentName, MorningAttendance, Morning_time, EveningAttendance, Evening_time, AttendanceDate, Hall_no) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            student.student_id,
            `${student.first_name} ${student.last_name}`,
            sessionColumnAttendance === 'MorningAttendance' ? 'Present' : null,
            sessionColumnAttendance === 'MorningAttendance' ? formattedTime : null,
            sessionColumnAttendance === 'EveningAttendance' ? 'Present' : null,
            sessionColumnAttendance === 'EveningAttendance' ? formattedTime : null,
            currentDate,
            'hall01'
          ]);

          await insertPermanentAttendance(connection, student, 'Present', 'lecture', 'hall01');

          res.status(200).send({
            message: 'Attendance marked successfully.',
            student,
          });
        }
      } else {
        res.status(404).send({ message: 'Student not found.' });
      }
    } else {
      res.status(400).send({ message: 'Invalid location provided.' });
    }
  } catch (error) {
    console.error('Error handling RFID:', error);
    res.status(500).send({ message: 'An error occurred.', error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

const insertPermanentAttendance = async (connection, student, status, attendanceType, hallNo) => {
  const insertQuery = `
    INSERT INTO permanent_attendance (studentID, first_name, last_name, phone_number, address, enrollment_date, courseName, attendance_type, timestamp, status, hall_no)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
  `;
  await connection.query(insertQuery, [
    student.student_id,
    student.first_name,
    student.last_name,
    student.phone_number || null, // Ensure null for optional fields
    student.address || null,
    student.enrollment_date || null,
    student.courseName || null,
    attendanceType,
    status,
    hallNo || null // Ensure null for optional fields
  ]);
};

module.exports = { handleRFID };