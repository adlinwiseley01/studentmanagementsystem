const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  courseName: { type: String, required: true },
  filePath: { type: String, required: true }, 
});

module.exports = mongoose.model("Note", noteSchema);
