import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const [students, setStudents] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchStudentNames = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/addstudents");
      const names = response.data.map(
        (student: { name: string }) => student.name
      );

      // Initialize attendance with "Present" by default
      const initialAttendance: Record<string, string> = {};
      names.forEach((name: string | number) => {
        initialAttendance[name] = "Present";
      });

      setStudents(names);
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching student names:", error);
      toast.error("Failed to fetch student names.");
    }
  };

  useEffect(() => {
    fetchStudentNames();
  }, []);

  const handleAttendanceChange = (name: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [name]: status }));
  };

  const submitAttendance = async () => {
    try {
      const attendanceData = {
        date: date.toISOString().split("T")[0],
        records: attendance,
      };
      await axios.post("http://localhost:5000/api/attendance", attendanceData);
      toast.success("Attendance submitted successfully!");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to submit attendance.");
    }
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
        <div className="bg-white p-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white mt-5 rounded-lg">
            <div className="relative w-full md:w-auto">
              <DatePicker
                selected={date}
                onChange={(date: Date | null) => date && setDate(date)}
                className="p-3 pl-10 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#876bcb]"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <button
              className="bg-gradient-to-r from-[#876bcb] to-purple-500 hover:bg-[#6c5aa7] transition text-white px-6 py-3 rounded-lg shadow-md font-semibold"
              onClick={submitAttendance}
            >
              Submit Attendance
            </button>
          </div>

          <div className="bg-white p-3 overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#4a4e69]">
              Student List
            </h2>
            {students.length > 0 ? (
              <div>
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-[#f3e8ff] text-gray-800">
                    <tr>
                      <th className="border-b border-gray-300 px-4 py-3 text-center">
                        Name
                      </th>
                      <th className="border-b border-gray-300 px-4 py-3 text-center">
                        Attendance Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((name, index) => (
                      <tr
                        key={name}
                        className={`transition hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                          {name}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-3 text-center">
                          <select
                            value={attendance[name] || ""}
                            onChange={(e) =>
                              handleAttendanceChange(name, e.target.value)
                            }
                            className="p-2 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#876bcb]"
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="On-Duty">On-Duty</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No students found.</p>
            )}
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
    </div>
  );
};

export default Attendance;
