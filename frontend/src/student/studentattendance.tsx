import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import profile from "../assets/studentprofile.png";
import { useNavigate } from "react-router-dom";

interface AttendanceRecord {
  date: string;
  status: string;
}

const StudentAttendance = () => {
  const [username, setUsername] = useState<string>("");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchAttendance(storedUsername);
    } else {
      setError("No username found in local storage.");
    }
  }, []);

  const fetchAttendance = async (name: string) => {
    try {
      setError("");
      setAttendance([]);

      const response = await fetch(
        `http://localhost:5000/api/attendance/student/${name}`
      );

      if (!response.ok) {
        throw new Error("No attendance records found");
      }

      const data: AttendanceRecord[] = await response.json();
      setAttendance(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setAttendance([]);
    }
  };

  const downloadCSV = () => {
    const header = ["Date", "Status"];
    const rows = attendance.map((record) => [record.date, record.status]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += header.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${username}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
      <div className="bg-white  w-full min-h-screen">
         {/* Navigation Bar */}
      <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">Student</h1>
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Attendance for {username}
          </h2>
          <button
            onClick={downloadCSV}
            className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-[#7c3aed] flex items-center gap-2 transition"
          >
            <FiDownload className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        {attendance.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
              <thead className="bg-[#f3e8ff] text-gray-800">
                <tr>
                  <th className="p-4 text-centerr font-semibold text-lg">Date</th>
                  <th className="p-4 text-center font-semibold text-lg">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr
                    key={index}
                    className={`text-gray-800 text-center transition-all duration-200 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="p-4 text-center text-lg font-medium">
                      {record.date}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-4 py-2 rounded-full text-md font-semibold shadow-md transition-all 
                          ${
                            record.status.toLowerCase() === "present"
                              ? "bg-green-500 text-white"
                              : record.status.toLowerCase() === "absent"
                              ? "bg-red-500 text-white"
                              : record.status.toLowerCase() === "on duty"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700 text-center mt-6 text-lg">
            No attendance records available.
          </p>
        )}
      </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
