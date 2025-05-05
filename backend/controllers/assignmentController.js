// const Assignment = require("../models/Assignment"); // Ensure the model exists

// // Add new assignment
// exports.addAssignment = async (req, res) => {
//     try {
//         const { title, description, dueDate } = req.body;
//         const newAssignment = new Assignment({ title, description, dueDate });
//         await newAssignment.save();
//         res.status(201).json({ message: "Assignment added successfully", assignment: newAssignment });
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// };

// // Get all assignments
// exports.getAssignments = async (req, res) => {
//     try {
//         const assignments = await Assignment.find();
//         res.status(200).json(assignments);
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// };

// // Update assignment
// exports.updateAssignment = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedAssignment = await Assignment.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedAssignment) {
//             return res.status(404).json({ error: "Assignment not found" });
//         }
//         res.status(200).json(updatedAssignment);
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// };

// // Delete assignment
// exports.deleteAssignment = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedAssignment = await Assignment.findByIdAndDelete(id);
//         if (!deletedAssignment) {
//             return res.status(404).json({ error: "Assignment not found" });
//         }
//         res.status(200).json({ message: "Assignment deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// };
