import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

const Grades = () => {
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [allCourses, setAllCourses] = useState<
    { courseName: string; semester: string }[]
  >([]);
  const [filteredCourses, setFilteredCourses] = useState<
    { courseName: string }[]
  >([]);
  const [semesters] = useState<string[]>([
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [marks, setMarks] = useState<{
    [key: string]: { [course: string]: number };
  }>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableNames();
    fetchCourses();
  }, []);

  const fetchAvailableNames = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/addstudents");
      setAvailableNames(
        response.data.map((student: { name: string }) => student.name)
      );
    } catch (error) {
      console.error("Error fetching names:", error);
      toast.error("Failed to load student names.");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setAllCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses.");
    }
  };

  useEffect(() => {
    if (selectedSemester) {
      setFilteredCourses(
        allCourses.filter((course) => course.semester === selectedSemester)
      );
    } else {
      setFilteredCourses([]);
    }
  }, [selectedSemester, allCourses]);

  const handleMarkChange = (
    studentName: string,
    course: string,
    mark: number
  ) => {
    if (mark < 1 || mark > 100) {
      toast.error("Marks should be between 1 and 100.");
      return;
    }

    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentName]: {
        ...prevMarks[studentName],
        [course]: mark,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSemester) {
      toast.error("Please select a semester.");
      return;
    }

    const gradeData = availableNames.map((name) => ({
      name,
      semester: selectedSemester,
      courses: filteredCourses.map((course) => ({
        course: course.courseName,
        marks: marks[name]?.[course.courseName] || 0,
      })),
    }));

    try {
      await axios.post("http://localhost:5000/api/students", {
        grades: gradeData,
      });
      toast.success("Grades submitted successfully!");
    } catch (error) {
      console.error("Error submitting grades:", error);
      toast.error("Failed to submit grades.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white ">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-5">
            Enter Student Grades
          </h1>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Select Semester:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 transition duration-200"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {semesters.map((sem, index) => (
                <option key={index} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f3e8ff] text-gray-800">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    S.No
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Student Name
                  </th>
                  {selectedSemester &&
                    filteredCourses.map((course, index) => (
                      <th
                        key={index}
                        className="border-b border-gray-300 px-4 py-3 text-center"
                      >
                        {course.courseName}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {availableNames.map((name, index) => (
                  <tr
                    key={index}
                    className={`transition hover:bg-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                      {index + 1}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                      {name}
                    </td>
                    {selectedSemester &&
                      filteredCourses.map((course, idx) => (
                        <td
                          key={idx}
                          className="border-b border-gray-300 px-4 py-3 text-center text-gray-700"
                        >
                          <input
                            type="number"
                            className="px-3 py-1 w-full focus:ring-2 focus:ring-[#876bcb] text-center transition duration-200"
                            value={marks[name]?.[course.courseName] || ""}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= 1 && value <= 100) {
                                handleMarkChange(
                                  name,
                                  course.courseName,
                                  value
                                );
                              } else {
                                toast.error(
                                  "Marks should be between 1 and 100."
                                );
                              }
                            }}
                            placeholder="Enter marks"
                            min="1"
                            max="100"
                          />
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 shadow-md transition duration-300"
              onClick={handleSubmit}
            >
              Submit Grades
            </button>
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
    </div>
  );
};

export default Grades;
