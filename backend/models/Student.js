const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: String, required: true },
  courses: [
    {
      course: { type: String, required: true },
      marks: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
