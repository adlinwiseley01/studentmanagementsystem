import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Student {
  name: string;
  semester: string;
  courses: { course: string; marks: number }[];
}

const Reports = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All Courses");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students");
        console.log("Fetched Data:", response.data);

        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          toast.error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error fetching student grades:", error);
        toast.error("Failed to fetch student grades.");
      }
    };

    fetchGrades();
  }, []);

  // Filter students based on selected semester
  const filteredStudents = useMemo(() => {
    return selectedSemester
      ? students.filter((student) => student.semester === selectedSemester)
      : students;
  }, [selectedSemester, students]);

  // Extract unique course names
  const allCourses = useMemo(() => {
    const courseSet = new Set<string>();
    students.forEach((student) => {
      student.courses.forEach((c) => courseSet.add(c.course));
    });
    return ["All Courses", ...Array.from(courseSet)];
  }, [students]);

  // Prepare data for the chart
  const chartData = useMemo(() => {
    return filteredStudents.map((student) => {
      const studentData: { name: string; [key: string]: number | string } = {
        name: student.name,
      };

      student.courses.forEach((c) => {
        if (selectedCourse === "All Courses" || c.course === selectedCourse) {
          studentData[c.course] = c.marks;
        }
      });

      return studentData;
    });
  }, [filteredStudents, selectedCourse]);

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

      {/* Filter Selection */}
      <div className="p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">
          Student Grade Reports
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select Semester:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[
                "Semester 1",
                "Semester 2",
                "Semester 3",
                "Semester 4",
                "Semester 5",
                "Semester 6",
                "Semester 7",
                "Semester 8",
              ].map((sem, index) => (
                <option key={index} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select Course:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {allCourses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Grade Distribution
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedCourse === "All Courses" ? (
                  allCourses
                    .slice(1)
                    .map((course, index) => (
                      <Bar
                        key={index}
                        dataKey={course}
                        fill={`#${Math.floor(Math.random() * 16777215).toString(
                          16
                        )}`}
                      />
                    ))
                ) : (
                  <Bar dataKey={selectedCourse} fill="#6c4ebd" />
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">
              No data available for the selected filters.
            </p>
          )}
        </div>
      </div>

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
  );
};

export default Reports;
