import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadCloud } from "lucide-react";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  semester: string;
  courseName: string;
}

const AddNotes = () => {
  const [semesters, setSemesters] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      if (Array.isArray(response.data)) {
        setCourses(response.data);
        const uniqueSemesters = [...new Set(response.data.map((course) => course.semester))];
        setSemesters(uniqueSemesters);
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSem = e.target.value;
    setSelectedSemester(selectedSem);
    setSelectedCourse("");
    setFilteredCourses(courses.filter((course) => course.semester === selectedSem));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadNotes = async () => {
    if (!selectedSemester || !selectedCourse || !file) {
      toast.error("Please select a semester, course, and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("semester", selectedSemester);
    formData.append("courseName", selectedCourse);
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Notes uploaded successfully!");
        setSelectedSemester("");
        setSelectedCourse("");
        setFile(null);
        setFilteredCourses([]);
      } else {
        toast.error("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading notes:", error);
      toast.error("Failed to upload notes.");
    }
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
      <div className="bg-white  p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upload Notes</h1>

        <select
          className="p-3 border rounded-lg w-full mb-3 text-gray-700"
          value={selectedSemester}
          onChange={handleSemesterChange}
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>

        <select
          className="p-3 border rounded-lg w-full mb-3 text-gray-700"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          disabled={!selectedSemester}
        >
          <option value="">Select Course</option>
          {filteredCourses.map((course) => (
            <option key={course._id} value={course.courseName}>
              {course.courseName}
            </option>
          ))}
        </select>

        <label className="block bg-gray-200 border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-300">
          <input type="file" className="hidden" onChange={handleFileChange} />
          <div className="flex items-center justify-center gap-2">
            <UploadCloud className="text-gray-600" />
            <span className="text-gray-600">{file ? file.name : "Click to upload file"}</span>
          </div>
        </label>

        <button
          className="bg-gradient-to-r from-[#876bcb] to-purple-500 hover:bg-purple-700 text-white  font-bold py-2 px-4 rounded-lg  mt-4"
          onClick={uploadNotes}
        >
          Upload Notes
        </button>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"/>
      </div>
    </div>
  );
};

export default AddNotes;



