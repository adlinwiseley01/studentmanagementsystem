const Student = require("../models/Student");


exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};


exports.createStudent = async (req, res) => {
  const { grades } = req.body; 

  try {
    const studentsWithStatus = grades.map((student) => {
      const hasArrear = student.courses.some((course) => course.marks < 45);

      return {
        name: student.name,
        semester: student.semester,
        courses: student.courses.map((course) => ({
          course: course.course,
          marks: course.marks,
        })),
        status: hasArrear ? "Arrear" : "All Clear", 
      };
    });

    const savedStudents = await Student.insertMany(studentsWithStatus); 
    res.status(201).json(savedStudents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPassFailCount = async (_req, res) => {
  try {
    const students = await Student.find();

    let passCount = 0;
    let failCount = 0;

    students.forEach((student) => {
      const hasArrear = student.courses.some((course) => course.marks < 45);
      if (hasArrear) {
        failCount++;
      } else {
        passCount++;
      }
    });

    res.json({ passCount, failCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pass/fail count" });
  }
};


// Get top 3 students based on average marks
exports.getTopStudents = async (req, res) => {
  try {
    const students = await Student.find();

    const studentsWithAvg = students.map((student) => {
      const totalMarks = student.courses.reduce((sum, course) => sum + course.marks, 0);
      const avgMarks = student.courses.length > 0 ? totalMarks / student.courses.length : 0;

      return { 
        name: student.name, 
        semester: student.semester, 
        avgMarks 
      };
    });

    // Sort by average marks in descending order and get the top 3
    const top3Students = studentsWithAvg
      .sort((a, b) => b.avgMarks - a.avgMarks)
      .slice(0, 3);

    res.json(top3Students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top students" });
  }
};

// Update a student's marks
exports.updateStudent = async (req, res) => {
  try {
    const { name, semester, courses } = req.body;

    if (!name || !semester || !courses) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const student = await Student.findOne({ name, semester });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    student.courses = courses; // Update all courses
    student.status = student.courses.some((course) => course.marks < 45) ? "Arrear" : "All Clear";

    await student.save();
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch student by name


exports.getStudentByName = async (req, res) => {
  try {
    const { name } = req.params;  // Extract name from the URL parameter
    const student = await Student.findOne({ name: name });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    console.log("Found student: ", student);  // Log the student data for debugging
    res.json(student);
  } catch (err) {
    console.error(err);  // Log the error for better debugging
    res.status(500).json({ error: "Failed to fetch student" });
  }
};
