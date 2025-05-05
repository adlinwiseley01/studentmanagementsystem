import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2, X, PlusCircle } from "lucide-react";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Course {
  _id?: string;
  semester: string;
  courseId: string;
  courseName: string;
  creditPoints: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [creditPoints, setCreditPoints] = useState<number | "">("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addOrUpdateCourse = async () => {
    if (
      !semester ||
      !courseId.trim() ||
      !courseName.trim() ||
      creditPoints === ""
    ) {
      toast.error("Please fill in all fields correctly!");
      return;
    }

    const newCourse: Course = {
      semester,
      courseId,
      courseName,
      creditPoints: Number(creditPoints),
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/courses/${editingId}`,
          newCourse
        );
        toast.success("Course updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/courses", newCourse);
        toast.success("Course added successfully!");
      }
      fetchCourses();
      closePopup();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course.");
    }
  };

  const editCourse = (course: Course) => {
    setSemester(course.semester);
    setCourseId(course.courseId);
    setCourseName(course.courseName);
    setCreditPoints(course.creditPoints);
    setEditingId(course._id || null);
    setShowPopup(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };
  const deleteCourse = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${deleteId}`);
      toast.success("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course.");
    }
    setShowDeletePopup(false);
  };

  const closePopup = () => {
    setSemester("");
    setCourseId("");
    setCourseName("");
    setCreditPoints("");
    setShowPopup(false);
    setEditingId(null);
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-2 rounded-lg hover:bg-[#7250b5] transition"
              onClick={() => setShowPopup(true)}
            >
              <PlusCircle size={18} /> Add Course
            </button>
          </div>

          {/* Course List Table */}
          <div>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-[#f3e8ff] text-gray-800">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Semester
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Course ID
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Course Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Credit Points
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <tr
                      key={course._id}
                      className={` transition hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                        {course.semester}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                        {course.courseId}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                        {course.courseName}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                        {course.creditPoints}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => editCourse(course)}
                          className="text-blue-500 hover:text-blue-700 mx-2"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => confirmDelete(course._id!)}
                          className="text-red-500 hover:text-red-700 mx-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      No courses available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {showDeletePopup && (
          <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Delete
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this course?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={deleteCourse}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Modal */}
        {showPopup && (
          <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? "Edit Course" : "Add Course"}
                </h2>
                <X
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                  onClick={closePopup}
                />
              </div>

              <select
                className="p-2 border rounded w-full mb-3"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">Select Semester</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                  <option
                    key={num}
                    value={`Semester ${num}`}
                  >{`Semester ${num}`}</option>
                ))}
              </select>

              <input
                className="p-2 border rounded w-full mb-3"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Course ID"
              />
              <input
                className="p-2 border rounded w-full mb-3"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Course Name"
              />
              <input
                className="p-2 border rounded w-full mb-3"
                type="number"
                min="1"
                value={creditPoints}
                onChange={(e) => setCreditPoints(Number(e.target.value))}
                placeholder="Credit Points"
              />

              <button
                className="w-full bg-[#876bcb] text-white px-4 py-2 rounded-lg hover:bg-[#7250b5] transition"
                onClick={addOrUpdateCourse}
              >
                {editingId ? "Update" : "Submit"}
              </button>
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

export default Courses;
