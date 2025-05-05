const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// POST a new course
router.post("/", async (req, res) => {
  try {
    const { semester, courseId, courseName, creditPoints } = req.body;

    if (!semester || !courseId || !courseName || creditPoints === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCourse = new Course({ semester, courseId, courseName, creditPoints });
    await newCourse.save();

    res.status(201).json({ message: "Course added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add course" });
  }
});

// PUT (Update a course)
router.put("/:id", async (req, res) => {
  try {
    const { semester, courseId, courseName, creditPoints } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { semester, courseId, courseName, creditPoints },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update course" });
  }
});

// DELETE a course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete course" });
  }
});

module.exports = router;
