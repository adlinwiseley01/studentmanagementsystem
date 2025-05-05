import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiDownload, FiCalendar } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

const ViewAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    { date: string; records: Record<string, string> }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/attendance");
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast.error("Failed to fetch attendance records.");
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  // Filter records based on selected date
  const filteredRecords = selectedDate
    ? attendanceRecords.filter((record) => {
        const recordDate = new Date(record.date).toISOString().split("T")[0];
        const selectedDateString = selectedDate.toISOString().split("T")[0];
        return recordDate === selectedDateString;
      })
    : attendanceRecords;

  // Flatten attendance data for pagination
  const flattenedRecords = filteredRecords.flatMap((record) =>
    Object.entries(record.records).map(([name, status]) => ({
      date: record.date,
      name,
      status,
    }))
  );

  // Pagination logic
  const totalPages = Math.max(Math.ceil(flattenedRecords.length / rowsPerPage), 1);
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = flattenedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Reset to first page when rows per page or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, selectedDate]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
  };

  const downloadCSV = () => {
    const headers = "Date,Student Name,Status\n";
    const rows = flattenedRecords.map(({ date, name, status }) => `${date},${name},${status}`).join("\n");

    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {/* Header */}
     
        <h1 className="text-3xl font-bold text-gray-800">Attendance Records</h1>
        <p className="text-lg mt-2">Track student attendance efficiently</p>
      

      {/* Controls */}
      <div className="flex justify-between w-full  mt-6 bg-white p-4 rounded-lg ">
        
        <div className="relative w-full ">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className="border p-3 pl-10 rounded-lg w-full shadow focus:ring-2 focus:ring-[#876bcb]"
          />
        </div>

        

        {/* Download Button */}
        <button
          onClick={downloadCSV}
          className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-[#7c3aed] flex items-center gap-2 transition"
        >
          <FiDownload className="w-6 h-6" />
          
        </button>
      </div>

      {/* Attendance Table */}
      <div className="w-full  mt-6 bg-white  p-6">
        {currentRecords.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-[#f3e8ff] text-gray-800">
                <th className="border border-gray-300 p-3 text-left">Date</th>
                <th className="border border-gray-300 p-3 text-left">Student Name</th>
                <th className="border border-gray-300 p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(({ date, name, status }, index) => (
                <tr key={`${date}-${name}`} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition`}>
                  <td className="border border-gray-300 p-3">{date}</td>
                  <td className="border border-gray-300 p-3">{name}</td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 rounded-full text-white ${status === "Present" ? "bg-green-500" : status === "Absent" ? "bg-red-500" : status === "On-Duty" ? "bg-yellow-500" : "bg-gray-500"}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 text-lg">No attendance records found.</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-6" >
      <div className="flex items-center space-x-3">
          <label className="mr-2  text-gray-700 font-medium">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="border px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#876bcb]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          </div>
        

      {/* Pagination Controls */}
      <div className="flex items-center space-x-4">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-md flex items-center text-gray-600 hover:bg-gray-200 transition">
          <ChevronLeft className="w-5 h-5" /> Prev
        </button>
        <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-md flex items-center text-gray-600 hover:bg-gray-200 transition">
          Next <ChevronRight className="w-5 h-5" />
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
        theme="colored"/>
      </div>
      </div>
    </div>
  );
};

export default ViewAttendance;
