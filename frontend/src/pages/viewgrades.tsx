// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   FiDownload,
//   FiFilter,
//   FiUser,
//   FiBook,
//   FiCheckCircle,
// } from "react-icons/fi";
// import profile from "../assets/studentprofile.png";
// import { useNavigate } from "react-router-dom";

// interface Student {
//   _id: string;
//   name: string;
//   semester: string;
//   course: string;
//   marks: number[];
// }

// const ViewGrades = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [selectedSemester, setSelectedSemester] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGrades = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/students");
//         if (response.data && Array.isArray(response.data)) {
//           setStudents(response.data);
//         } else {
//           toast.error("Invalid response from server");
//         }
//       } catch (error) {
//         console.error("Error fetching student grades:", error);
//         toast.error("Failed to fetch student grades.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGrades();
//   }, []);

//   // Optimized filtering using useMemo
//   const filteredStudents = useMemo(() => {
//     return selectedSemester
//       ? students.filter((student) => student.semester === selectedSemester)
//       : students;
//   }, [selectedSemester, students]);

//   // CSV Export Function
//   const downloadCSV = () => {
//     if (filteredStudents.length === 0) {
//       toast.warn("No data to download!");
//       return;
//     }

//     const headers = "Name,Semester,Course,Marks\n";
//     const rows = filteredStudents
//       .map(
//         (student) =>
//           `${student.name},${student.semester},${
//             student.course
//           },"${student.marks.join(" | ")}"`
//       )
//       .join("\n");

//     const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "student_grades.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen w-full bg-white">
//       {/* Navigation Bar */}
//       <nav className="bg-[#6c4ebd] p-4  w-full  flex justify-between items-center">
//         <h1 className="text-white text-2xl font-bold">Admin</h1>
//         <div className="relative ">
//           <img
//             src={profile}
//             alt="User"
//             className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
//             onClick={() => setShowDropdown(!showDropdown)}
//           />
//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
//               <button
//                 className="block w-full px-4 py-2 text-left hover:bg-gray-200"
//                 onClick={() => navigate("/")}
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </nav>
//       <div className="p-6">
//         <div className="bg-white p-6 w-full">
//           <h1 className="text-3xl font-bold text-gray-800 mb-5">
//             Student Grades
//           </h1>

//           {loading && (
//             <p className="text-lg font-semibold text-gray-600 text-center">
//               Loading...
//             </p>
//           )}

//           {!loading && students.length === 0 && (
//             <p className="text-red-500 font-semibold text-center">
//               No student grades found.
//             </p>
//           )}

//           {!loading && students.length > 0 && (
//             <>
//               {/* Filter & Download Section */}
//               <div className="flex justify-between items-center mb-6">
//                 <div className="relative w-64">
//                   <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
//                   <select
//                     value={selectedSemester}
//                     onChange={(e) => setSelectedSemester(e.target.value)}
//                     className="w-full border p-3 pl-10 rounded bg-white shadow-md focus:ring-2 focus:ring-purple-300"
//                   >
//                     <option value="">All Semesters</option>
//                     {[...new Set(students.map((s) => s.semester))].map(
//                       (sem) => (
//                         <option key={sem} value={sem}>
//                           Semester {sem}
//                         </option>
//                       )
//                     )}
//                   </select>
//                 </div>

//                 <button
//                   onClick={downloadCSV}
//                   className="bg-[#876bcb] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 flex items-center gap-2 transition duration-300"
//                 >
//                   <FiDownload className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Grid Layout for Student Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredStudents.map((student) => (
//                   <div
//                     key={student._id}
//                     className="p-5 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-300 border- border-[#876bcb]"
//                   >
//                     <div className="flex items-center gap-2 mb-2">
//                       <FiUser className="text-[#876bcb] w-6 h-6" />
//                       <h2 className="text-lg font-semibold text-[#876bcb]">
//                         {student.name}
//                       </h2>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FiBook className="text-gray-600 w-5 h-5" />
//                       <p className="text-gray-700">
//                         <strong>Course:</strong> {student.course || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FiCheckCircle className="text-green-600 w-5 h-5" />
//                       <p className="text-gray-700">
//                         <strong>Semester:</strong> {student.semester || "N/A"}
//                       </p>
//                     </div>
//                     {/* Display Marks as Badge List */}
//                     <div className="mt-3">
//                       <strong className="text-gray-800">Marks:</strong>
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         {student.marks || "N/A"}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           <ToastContainer />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewGrades;



import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  FiUser, FiBook, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  name: string;
  semester: string;
  courses: { course: string; marks: number }[];
}

const ViewGrades = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6); // Default rows per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students");
        if (response.data && Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          toast.error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error fetching student grades:", error);
        toast.error("Failed to fetch student grades.");
      } finally {
        setLoading(false);
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

  // Pagination logic
  const indexOfLastStudent = currentPage * rowsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

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
          <h1 className="text-3xl font-bold text-gray-800 mb-5">Student Grades</h1>

          {/* Semester Selection */}
          <div className="mb-6">
            <label className=" text-gray-700 font-semibold mb-2  items-center">
              Select Semester:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 transition duration-200"
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setCurrentPage(1); 
              }}
            >
              <option value="">All Semesters</option>
              {[...new Set(students.map((s) => s.semester))].map((sem, index) => (
                <option key={index} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Student Cards */}
          {loading ? (
            <p className="text-gray-600 text-center">Loading grades...</p>
          ) : currentStudents.length === 0 ? (
            <p className="text-gray-600 text-center">No students found for this semester.</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStudents.map((student, index) => (
                  <div
                    key={index}
                    className=" bg-white p-5 rounded-xl shadow-lg transition hover:scale-105 duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <FiUser className="text-[#6c4ebd] text-3xl mr-3" />
                      <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                    </div>

                    <div className="flex items-center mb-3">
                      <FiBook className="text-gray-500 mr-2" />
                      <p className="text-gray-700 font-semibold">
                        Semester: <span className="font-bold">{student.semester}</span>
                      </p>
                    </div>

                    {/* Course & Marks List */}
                    <div className="bg-[#f3e8ff] p-3 rounded-lg shadow-md">
                      {student.courses.map((course, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <span className="text-gray-800">{course.course}</span>
                          <span
                            className={`px-3 py-1 rounded-lg font-bold ${
                              course.marks >= 50 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                            }`}
                          >
                            {course.marks}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                {/* Rows Per Page Selector */}
                <div className="flex items-center">
                  <label className="mr-2 text-gray-700 font-semibold">Rows per page:</label>
                  <select
                    className="border border-gray-300 rounded-lg px-2 py-1"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                  </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center">
                  <button
                    className={`px-4 py-2 mx-2 rounded-lg font-semibold ${
                      currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white-600 text-black"
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <FiArrowLeft className="inline-block mr-2" /> Previous
                  </button>

                  <span className="text-gray-700 font-semibold mx-4">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className={`px-4 py-2 mx-2 rounded-lg font-semibold ${
                      currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-white-600 text-black"
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next <FiArrowRight className="inline-block ml-2" />
                  </button>
                </div>
              </div>
            </div>
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
          theme="colored" />
      </div>
    </div>
  );
};

export default ViewGrades;
