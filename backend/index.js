require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const courseRoutes = require("./routes/courseRoutes");
const addstudentRoutes = require("./routes/addstudentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const notesRoutes = require("./routes/notesRoutes");
const axios = require("axios");
const path = require("path"); 


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => res.send("Student Grades API"));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", addstudentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notes", notesRoutes);

app.post("/api/generate-resume", async (req, res) => {
    const { name, education, experience, skills } = req.body;
  
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: `Generate a professional resume summary for:\nName: ${name}\nEducation: ${education}\nExperience: ${experience}\nSkills: ${skills}` }
              ]
            }
          ]
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
  
      const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
      res.json({ summary: aiResponse });
    } catch (error) {
      console.error("Error generating AI content:", error.response?.data || error);
      res.status(500).json({ error: error.response?.data || "Something went wrong" });
    }
  });


app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
