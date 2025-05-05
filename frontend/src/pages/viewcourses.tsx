import { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload, FiChevronDown, FiChevronUp } from "react-icons/fi";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Course {
  _id?: string;
  semester: string;
  courseId: string;
  courseName: string;
  creditPoints: number;
}

const ViewCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [coursesPerPage, setCoursesPerPage] = useState<number>(5);
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSemesterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    setCurrentPage(1);
    setFilteredCourses(
      semester === ""
        ? courses
        : courses.filter((course) => course.semester === semester)
    );
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Semester", "Course ID", "Course Name", "Credit Points"],
      ...filteredCourses.map((course) => [
        course.semester,
        course.courseId,
        course.courseName,
        course.creditPoints,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleAccordion = (id: string) => {
    setOpenCourse(openCourse === id ? null : id);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="min-h-screen w-full bg-white ">
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
        <div className="bg-white p-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800">Course List</h1>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-5 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <label className="font-semibold text-gray-700">
                Filter by Semester:
              </label>
              <select
                value={selectedSemester}
                onChange={handleSemesterChange}
                className="border border-gray-300 p-2 rounded bg-white shadow-sm focus:ring-2 focus:ring-[#876bcb] focus:border-[#876bcb]"
              >
                <option value="">All</option>
                {[...new Set(courses.map((course) => course.semester))].map(
                  (sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-[#7558b0] transition duration-300"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          </div>

          {/* Accordion Section */}
          <div className="space-y-4">
            {currentCourses.length > 0 ? (
              currentCourses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-300 rounded-lg shadow-md bg-white"
                >
                  {/* Accordion Header */}
                  <button
                    className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-[#876bcb] hover:bg-gray-100 transition duration-300"
                    onClick={() => toggleAccordion(course._id || "")}
                  >
                    <span>{course.courseName}</span>
                    {openCourse === course._id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>

                  {/* Accordion Body */}
                  {openCourse === course._id && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <p className="text-gray-600">
                        <strong>Course ID:</strong> {course.courseId}
                      </p>
                      <p className="text-gray-600">
                        <strong>Semester:</strong> {course.semester}
                      </p>
                      <p className="text-gray-600">
                        <strong>Credit Points:</strong> {course.creditPoints}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No courses available.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            {/* Rows per Page Dropdown (Left-aligned) */}
            <div className="flex items-center space-x-3">
              <label className="font-semibold text-gray-700">
                Rows per page:
              </label>
              <select
                value={coursesPerPage}
                onChange={(e) => setCoursesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-[#876bcb] focus:border-[#876bcb]"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>

            {/* Previous/Next Buttons (Right-aligned) */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow disabled:opacity-50 hover:bg-gray-400 transition duration-300"
              >
                Previous
              </button>
              <span className="font-semibold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow disabled:opacity-50 hover:bg-gray-400 transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourses;
