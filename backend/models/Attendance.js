const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  records: {
    type: Map,
    of: String, 
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
