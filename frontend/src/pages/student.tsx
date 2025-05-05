import { useState, useEffect } from "react";
import axios from "axios";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Student {
  id: number;
  name: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/addstudents");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const totalPages = Math.max(Math.ceil(students.length / rowsPerPage), 1);
  const indexOfLastStudent = currentPage * rowsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
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
      <div className="bg-white p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Student List</h1>
          <button
            className="p-2 px-4 bg-gradient-to-r from-[#876bcb] to-purple-500 text-white rounded-md hover:bg-[#6d55a2] flex items-center transition-all duration-200"
            aria-label="Download CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading students...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#f3e8ff] text-gray-800">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">S.No</th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">Name</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student, index) => (
                    <tr key={student.id} className={`transition hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                        {indexOfFirstStudent + index + 1}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center">
                        {student.name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="border border-gray-300 px-6 py-3 text-center text-gray-500">
                      No students available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <div>
            <label className="mr-2 text-gray-700 font-medium">Rows per page:</label>
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

          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md flex items-center text-gray-600 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
              } transition-all`}
            >
              <ChevronLeft className="w-5 h-5" /> Prev
            </button>

            <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || students.length === 0}
              className={`px-4 py-2 border rounded-md flex items-center text-gray-600 ${
                currentPage === totalPages || students.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
              } transition-all`}
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;