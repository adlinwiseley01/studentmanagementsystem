// const express = require("express");
// const Attendance = require("../models/Attendance");

// const router = express.Router();


// router.get("/", async (req, res) => {
//   try {
//     const records = await Attendance.find();
//     res.json(records);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch attendance records" });
//   }
// });

// router.post("/", async (req, res) => {
//   const { date, records } = req.body;

//   if (!date || !records) {
//     return res.status(400).json({ error: "Date and attendance records are required" });
//   }

//   try {
//     const attendance = new Attendance({ date, records });
//     await attendance.save();
//     res.status(201).json({ message: "Attendance saved successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save attendance" });
//   }
// });

// router.get("/:date", async (req, res) => {
//   const { date } = req.params;

//   try {
//     const attendance = await Attendance.findOne({ date });
//     if (!attendance) return res.status(404).json({ error: "Attendance not found" });

//     res.json(attendance);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch attendance for the date" });
//   }
// });

// module.exports = router;


const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// ✅ Get all attendance records
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// ✅ Add new attendance record
router.post("/", async (req, res) => {
  const { date, records } = req.body;

  if (!date || !records || typeof records !== "object") {
    return res.status(400).json({ error: "Date and valid attendance records are required" });
  }

  try {
    const attendance = new Attendance({ date, records });
    await attendance.save();
    res.status(201).json({ message: "Attendance saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save attendance" });
  }
});

// ✅ Get attendance by date
router.get("/:date", async (req, res) => {
  const { date } = req.params;

  try {
    const attendance = await Attendance.findOne({ date });
    if (!attendance) return res.status(404).json({ error: "Attendance not found" });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance for the date" });
  }
});

// ✅ Get attendance by student name (Keeping Your Schema)
router.get("/student/:name", async (req, res) => {
  const { name } = req.params;

  try {
    // Fetch all attendance records
    const records = await Attendance.find({ [`records.${name}`]: { $exists: true } });

    if (records.length === 0) {
      return res.status(404).json({ error: `No attendance records found for ${name}` });
    }

    // Extract date and status for the student
    const studentRecords = records.map(record => ({
      date: record.date,
      status: record.records.get(name) || "Unknown"
    }));

    res.json(studentRecords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance for the student" });
  }
});

module.exports = router;
