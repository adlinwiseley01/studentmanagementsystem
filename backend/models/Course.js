const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  courseId: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  creditPoints: { type: Number, required: true },
});

module.exports = mongoose.model("Course", courseSchema);
