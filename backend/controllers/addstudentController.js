const Student = require("../models/Addstudent");

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Student name is required" });
    }

    const newStudent = new Student({ name });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Student name is required" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
