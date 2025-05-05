const express = require("express");
const Assignment = require("../models/Assignment");
const router = express.Router();

// Get assignments (by semester or all)
router.get("/", async (req, res) => {
  try {
    const { semester } = req.query;
    let filter = {};

    if (semester && semester !== "all") {
      filter.semester = { semester };
    }

    const assignments = await Assignment.find(filter);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Add a new assignment
router.post("/", async (req, res) => {
  try {
    const { semester, courseId, issuedDate, deadlineDate, topic, description } = req.body;
    if (!semester || !courseId || !issuedDate || !deadlineDate || !topic || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAssignment = new Assignment({ semester, courseId, issuedDate, deadlineDate, topic, description });
    await newAssignment.save();

    res.status(201).json({ message: "Assignment added successfully", newAssignment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Update an assignment by ID
router.put("/:id", async (req, res) => {
  try {
    const { semester, courseId, issuedDate, deadlineDate, topic, description } = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { semester, courseId, issuedDate, deadlineDate, topic, description },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment updated successfully", updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Delete an assignment by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
