const express = require("express");
const { addStudent, getStudents,updateStudent,deleteStudent } = require("../controllers/addstudentController");

const router = express.Router();

router.post("/addstudents", addStudent);
router.get("/addstudents", getStudents);
router.put("/addstudents/:id", updateStudent);
router.delete("/addstudents/:id", deleteStudent);

module.exports = router;
