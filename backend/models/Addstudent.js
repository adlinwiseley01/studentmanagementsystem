const mongoose = require("mongoose");

const addstudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("AddStudent", addstudentSchema);
