const express = require("express");
const {
    getStudentDetails,
    addStudent,
    deleteStudent,
    updateStudent,
} = require("../../controllers/Student/student.js");
const router = express.Router();

router.get("/", getStudentDetails);
router.post("/addStudent", addStudent);
router.delete("/deleteStudent/:id", deleteStudent);
router.put("/updateStudent/:id", updateStudent);

module.exports = router;
