// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const Note = require("../models/Note");

// const router = express.Router();

// // Set up multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Ensure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // File upload route
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const { semester, courseName } = req.body;
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const newNote = new Note({
//       semester,
//       courseName,
//       filePath: req.file.filename, // Save only the filename
//     });

//     await newNote.save();

//     res.status(201).json({
//       message: "File uploaded successfully",
//       fileUrl: `/uploads/${req.file.filename}`, // Send the correct file URL
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error uploading file" });
//   }
// });

// // Fetch notes based on semester and courseName
// router.get("/", async (req, res) => {
//   const { semester, courseName } = req.query;

//   try {
//     const filter = {};
//     if (semester) filter.semester = semester;
//     if (courseName) filter.courseName = courseName;

//     const notes = await Note.find(filter);

//     // Convert filePath to fileUrl
//     const notesWithUrls = notes.map(note => ({
//       _id: note._id,
//       semester: note.semester,
//       courseName: note.courseName,
//       fileUrl: `/uploads/${note.filePath}`, // Convert stored path to accessible URL
//     }));

//     res.json(notesWithUrls);
//   } catch (err) {
//     console.error("Error fetching notes:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const Note = require("../models/Note");

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // ✅ Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { semester, courseName } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newNote = new Note({
      semester,
      courseName,
      filePath: req.file.filename, // ✅ Save only filename
    });

    await newNote.save();

    res.status(201).json({
      message: "File uploaded successfully",
      fileUrl: `http://localhost:5000/uploads/${req.file.filename}`, // ✅ Correct full URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error uploading file" });
  }
});

// Fetch notes and return full file URLs
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();

    const notesWithUrls = notes.map((note) => ({
      _id: note._id,
      semester: note.semester,
      courseName: note.courseName,
      fileUrl: `http://localhost:5000/uploads/${note.filePath}`, // ✅ Correct full URL
    }));

    res.json(notesWithUrls);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
