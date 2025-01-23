const { pool } = require("../../config/db");

// Get student details
const getStudentDetails = async (req, res) => {
    const sql = "SELECT * FROM students;";
    console.log("Fetching student data...");
    try {
      const result = await pool.query(sql);
      // console.log("Student data fetched from backend:", result);
      return res.json(result[0]);
    } catch (err) {
      console.error("Error fetching student data from backend:", err);
      return res.status(500).json({ Message: "Error inside server", err });
    }
  };
  
//POST student details
  const addStudent = async (req, res) => {
    console.log("Received request to add student:", req.body);
    const sql = `
      INSERT INTO students 
  (RFIDTagID,first_name, last_name, dob, email, username, phone_number, enrollment_date, photo, nic, course_name, password, address, gender, guardian_name, guardian_contact,st_type)
VALUES 
  (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)

    `;
    const values = [
      req.body.RFIDTagID,
      req.body.first_name,
      req.body.last_name,
      req.body.dob,
      req.body.email, 
      req.body.username,
      req.body.phone_number,
      req.body.enrollment_date,
      req.body.photo,  
      req.body.nic, 
      req.body.course_name, 
      req.body.password, 
      req.body.address, 
      req.body.gender,   
      req.body.guardian_name,
      req.body.guardian_contact, 
      req.body.status  
    ];
    console.log("SQL query:", sql);

    try {
      const [result] = await pool.query(sql, values);
      console.log("Student added successfully:", result);
      return res.status(200).json({ message: "Student added successfully.", result });
    } catch (err) {
        console.error("Error occurred:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Username or NIC already exists", err });
      }
      return res.status(500).json({ message: "Error inside server", err });
    }
  };
  

// Delete a student
const deleteStudent = async (req, res) => {
  const sql = "DELETE FROM students WHERE student_id = ?;";
  const value = req.params.id;

  try {
    const [result] = await pool.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "Student not found" });
    }
    return res.json({ Message: "Student deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

// Update student details
const updateStudent = async (req, res) => {
  const studentId = req.params.id; // Get the student ID from the URL
  console.log("Received request to update student:", req.body);

  // Corrected SQL query
  const sql = `
    UPDATE students
    SET 
      RFIDTagID = ?, first_name = ?, last_name = ?, dob = ?, email = ?, username = ?, 
      phone_number = ?, enrollment_date = ?, photo = ?, nic = ?, 
      course_name = ?, password = ?, address = ?, gender = ?, 
      guardian_name = ?, guardian_contact = ?, st_type = ?
    WHERE student_id = ?  // Assuming student_id is the correct field for the WHERE clause
  `;

  // Corrected values array order
  const values = [
    req.body.RFIDTagID,
    req.body.first_name,
    req.body.last_name,
    req.body.dob,
    req.body.email,
    req.body.username,
    req.body.phone_number,
    req.body.enrollment_date,
    req.body.photo,
    req.body.nic,
    req.body.course_name,
    req.body.password,
    req.body.address,
    req.body.gender,
    req.body.guardian_name,
    req.body.guardian_contact,
    req.body.st_type,
    studentId,  // studentId to match the WHERE clause
  ];

  console.log("SQL query:", sql);

  try {
    const [result] = await pool.query(sql, values);
    console.log("Student updated successfully:", result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "Student not found" });
    }
    return res.json({ Message: "Student updated successfully", result });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ Message: "Email already exists", err });
    }
    return res.status(500).json({ Message: "Error inside server", err });
  }
};


module.exports = {
  getStudentDetails,
  addStudent,
  deleteStudent,
  updateStudent
};
