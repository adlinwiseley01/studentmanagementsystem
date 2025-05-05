import { useState, useEffect } from "react";
import axios from "axios";
import { Loader, ClipboardList } from "lucide-react";
import profile from "../assets/studentprofile.png";
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

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [semester, setSemester] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments(semester);
  }, [semester]);

  const fetchAssignments = async (selectedSemester: string) => {
    setLoading(true);
    try {
      const url =
        selectedSemester && selectedSemester !== "all"
          ? `http://localhost:5000/api/assignments?semester=${selectedSemester}`
          : "http://localhost:5000/api/assignments";

      const response = await axios.get(url);
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white ">
        {/* Navigation Bar */}
        <nav className="bg-[#6c4ebd] p-4  w-full  flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Student</h1>
        <div className="relative ">
          <img
            src={profile}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
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
        <h1 className="text-3xl font-bold text-gray-800 ">
          View Assignments
        </h1>

        {/* Semester Selection */}
        <div className="mb-6 ">
          <label className="text-lg font-semibold text-gray-700 mb-2 mt-5 flex items-center gap-2">
            Select Semester:
          </label>

          <select
            className="p-3 border rounded-lg w-full text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-[#876bcb] transition duration-200"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="all">All Semesters</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Semester {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader className="animate-spin text-[#876bcb]" size={40} />
          </div>
        ) : assignments.length > 0 ? (
          <div className=" shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {semester === "all"
                ? "All Assignments"
                : `Assignments for Semester ${semester}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-[#876bcb]"
                >
                  {/* Assignment Title */}
                  <h3 className="text-lg font-bold text-[#876bcb] mb-2 flex items-center gap-2">
                    <ClipboardList className="text-[#876bcb]" /> {assignment.topic}
                  </h3>
                  <p className="text-gray-700">{assignment.description}</p>

                  {/* Dates Section */}
                  <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                    <span>📅 <b>Issued:</b> {assignment.issuedDate}</span> 
                    <span> ⏳ <b>Deadline:</b> {assignment.deadlineDate}</span>
                  </div>

                  {/* Semester Badge */}
                  <div className="flex justify-end mt-4">
                    <span className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white text-xs px-3 py-1 rounded-full">
                       {assignment.semester}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading &&
          semester && (
            <p className="text-gray-500 text-center text-lg mt-6">
              No assignments found.
            </p>
          )
        )}
      </div>
      </div>
    </div>
  );
};

export default StudentAssignment;
