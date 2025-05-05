const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  courseId: { type: String, required: true },
  issuedDate: { type: String, required: true },
  deadlineDate: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
