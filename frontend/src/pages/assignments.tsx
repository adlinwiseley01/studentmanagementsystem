import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiPlusCircle } from "react-icons/fi";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Assignment {
  _id?: string;
  semester: string;
  courseId: string;
  issuedDate: string;
  deadlineDate: string;
  topic: string;
  description: string;
}

interface Course {
  _id?: string;
  semester: string;
  courseId: string;
  courseName: string;
  creditPoints: number;
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (semester) {
      fetchAssignments();
    }
  }, [semester]);

  const fetchAssignments = async () => {
    try {
      const url = `http://localhost:5000/api/assignments?semester=${semester}`;
      const response = await axios.get(url);
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addAssignment = async () => {
    if (
      !semester ||
      !courseId ||
      !issuedDate ||
      !deadlineDate ||
      !topic.trim() ||
      !description.trim()
    ) {
      toast.error("Please fill in all fields correctly!");
      return;
    }

    const newAssignment: Assignment = {
      semester,
      courseId,
      issuedDate,
      deadlineDate,
      topic,
      description,
    };

    try {
      await axios.post("http://localhost:5000/api/assignments", newAssignment);
      toast.success("Assignment added successfully!");
      fetchAssignments();
      resetForm();
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Failed to save assignment.");
    }
  };

  const resetForm = () => {
    setCourseId("");
    setIssuedDate("");
    setDeadlineDate("");
    setTopic("");
    setDescription("");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navigation Bar */}
      <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Admin</h1>
        <div className="relative">
          <img
            src={profile}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
              <div className="px-4 py-2 text-left text-gray-700">Admin</div>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                onClick={() => navigate("/")}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="p-6">
        <div className="bg-white  p-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Assignments
          </h1>

          {/* Semester & Course Selection in the Same Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-gray-600 font-medium">
                Select Semester
              </label>
              <select
                className="p-2 border border-gray-200 rounded-md w-full  focus:ring-2 focus:ring-[#876bcb]"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="" disabled>
                  Select Semester
                </option>
                {Array.from(
                  new Set(courses.map((course) => course.semester))
                ).map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium">
                Select Course
              </label>
              <select
                className="p-2 border border-gray-200 rounded-md w-full focus:ring-2 focus:ring-[#876bcb]"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={!semester}
              >
                <option value="">Select Course</option>
                {courses
                  .filter((course) => course.semester === semester)
                  .map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Issued Date & Deadline Date in Same Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-600 font-medium">
                Issued Date
              </label>
              <input
                type="date"
                className="p-2 border border-gray-200 rounded-md w-full  focus:ring-2 focus:ring-[#876bcb]"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">
                Deadline Date
              </label>
              <input
                type="date"
                className="p-2 border border-gray-200 rounded-md w-full  focus:ring-2 focus:ring-[#876bcb]"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
              />
            </div>
          </div>

          {/* Assignment Inputs */}
          <input
            type="text"
            className="p-2  border border-gray-200 rounded-md w-full mt-4  focus:ring-2 focus:ring-[#876bcb]"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Assignment Topic"
          />
          <textarea
            className="p-2 border border-gray-200 rounded-md w-full mt-4  focus:ring-2 focus:ring-[#876bcb]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Assignment Description"
          ></textarea>

          {/* Add Assignment Button (Smaller Size) */}
          <button
            className="w-auto bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-3 py-2 mt-4 rounded-md font-semibold flex items-center gap-2 hover:bg-[#755cb3] transition duration-300"
            onClick={addAssignment}
          >
            <FiPlusCircle size={16} /> Add Assignment
          </button>
        </div>

        {/* Assignment List */}
        {assignments.length > 0 && (
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
              📖 Assignments for Semester {semester}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="p-4 border border-gray-200 rounded-md bg-gray-50 shadow-sm hover:shadow-md transition duration-300"
                >
                  <h3 className="text-lg font-bold text-[#876bcb]">
                    {assignment.topic}
                  </h3>
                  <p className="text-gray-600 mt-2 border border-gray-200">
                    {assignment.description}
                  </p>
                  <div className="mt-3 text-sm text-gray-500">
                    <span>📅 Issued: {assignment.issuedDate}</span> |
                    <span> ⏳ Deadline: {assignment.deadlineDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
    </div>
  );
};

export default Assignments;
