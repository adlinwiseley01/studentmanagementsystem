// const express = require("express");
// const {
//   getStudents,
//   getTopStudents,
//   createStudent,
//   updateStudent,
//   deleteStudent,
//   getPassFailCount, // Add this function
// } = require("../controllers/studentController");

// const router = express.Router();

// router.get("/", getStudents);
// router.post("/", createStudent);
// router.put("/:id", updateStudent);
// router.delete("/:id", deleteStudent);
// router.get("/pass-fail-count", getPassFailCount); // New route for pass/fail count
// router.get("/top-students", getTopStudents);
// module.exports = router;

const express = require("express");
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getPassFailCount,
  getTopStudents,
  getStudentByName
} = require("../controllers/studentController"); // Ensure correct import

const router = express.Router();

// Define routes
router.get("/", getStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/pass-fail", getPassFailCount);
router.get("/top", getTopStudents);
router.get("/:name", getStudentByName); 

module.exports = router;
