

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FiDownload } from "react-icons/fi";
// import profile from "../assets/profile.png";
// import { useNavigate } from "react-router-dom";

// interface Course {
//   _id: string;
//   semester: string;
//   courseName: string;
// }

// interface Note {
//   _id: string;
//   semester: string;
//   courseName: string;
//   fileUrl: string;
// }

// const ViewNotes = () => {
//   const [semesters, setSemesters] = useState<string[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [selectedSemester, setSelectedSemester] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchSemestersAndCourses();
//   }, []);

//   /** Fetch semesters and courses */
//   const fetchSemestersAndCourses = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/courses");
//       if (Array.isArray(response.data)) {
//         setCourses(response.data);
//         const uniqueSemesters = [...new Set(response.data.map((course) => course.semester))];
//         setSemesters(uniqueSemesters);
//       }
//     } catch (error) {
//       console.error("Error fetching semesters and courses:", error);
//       setError("Failed to load courses.");
//     }
//   };

//   /** Handle semester selection */
//   const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedSem = e.target.value;
//     setSelectedSemester(selectedSem);
//     setSelectedCourse("");
//     setFilteredCourses(courses.filter((course) => course.semester === selectedSem));
//     setNotes([]); // Reset notes
//   };

//   /** Handle course selection */
//   const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedCourse(e.target.value);
//     setNotes([]); // Reset notes
//   };

//   /** Fetch notes */
//   const fetchNotes = async () => {
//     if (!selectedSemester || !selectedCourse) return;

//     setLoading(true);
//     setError("");

//     try {
//       console.log("Fetching notes for:", { semester: selectedSemester, course: selectedCourse });

//       const response = await axios.get(
//         `http://localhost:5000/api/notes?semester=${selectedSemester}&courseName=${encodeURIComponent(selectedCourse)}`
//       );

//       console.log("API Response:", response.data);
//       setNotes(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//       setError("Failed to fetch notes.");
//       setNotes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (fileUrl: string, fileName: string) => {
//     try {
//       // ✅ Ensure the fileUrl is correct before fetching
//       console.log("Downloading file from:", fileUrl);
  
//       const response = await axios.get(fileUrl, {
//         responseType: "blob", // ✅ Get file as binary Blob
//       });
  
//       // ✅ Create a downloadable link
//       const blob = new Blob([response.data]);
//       const url = window.URL.createObjectURL(blob);
  
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName || "downloaded_file.pdf");
//       document.body.appendChild(link);
//       link.click();
  
//       // ✅ Cleanup
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert("File download failed. Check if the file exists.");
//     }
//   };
  

//   return (
//     <div className="min-h-screen w-full bg-white ">
//       {/* Navigation Bar */}
//       <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
//       <h1 className="text-white text-2xl font-bold">Admin</h1>
//       <div className="relative">
//         <img
//           src={profile}
//           alt="User"
//           className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
//           onClick={() => setShowDropdown(!showDropdown)}
//         />
//         {showDropdown && (
//           <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
//             <div className="px-4 py-2 text-left text-gray-700">Admin</div>
//             <button
//               className="block w-full px-4 py-2 text-left hover:bg-gray-200"
//               onClick={() => navigate("/")}
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//       <div className="p-6">
//       <div className="bg-white p-6 w-full">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">View Notes</h1>

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         <div className="space-y-4">
//           {/* Semester Selection */}
//           <select
//             className="w-full p-3 border border-[#876bcb] rounded-lg focus:ring-2 focus:ring-purple-500"
//             value={selectedSemester}
//             onChange={handleSemesterChange}
//           >
//             <option value="">Select Semester</option>
//             {semesters.map((sem) => (
//               <option key={sem} value={sem}>{sem}</option>
//             ))}
//           </select>

//           {/* Course Selection */}
//           <select
//             className="w-full p-3 border border-[#876bcb] rounded-lg focus:ring-2 focus:ring-purple-500"
//             value={selectedCourse}
//             onChange={handleCourseChange}
//             disabled={!selectedSemester}
//           >
//             <option value="">Select Course</option>
//             {filteredCourses.map((course) => (
//               <option key={course._id} value={course.courseName}>{course.courseName}</option>
//             ))}
//           </select>

//           {/* Fetch Notes Button */}
//           <button
//             className=" bg-gradient-to-r from-[#876bcb] to-purple-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-[#876bcb]"
//             onClick={fetchNotes}
//             disabled={!selectedSemester || !selectedCourse || loading}
//           >
//             {loading ? "Fetching..." : "Fetch Notes"}
//           </button>
//         </div>

//         {/* Display Notes */}
//         <div className="mt-6 space-y-4">
//           {loading ? (
//             <p className="text-gray-500 text-center">Loading notes...</p>
//           ) : notes.length > 0 ? (
//             notes.map((note) => (
//               <div key={note._id} className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
//                 <p className="font-semibold text-gray-700">{note.courseName}</p>
//                 <button
//                   onClick={() => handleDownload(note.fileUrl, `${note.courseName}_notes.pdf`)}
//                   className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center"
//                 >
//                   <FiDownload className="w-5 h-5 mr-1" /> Download
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">No notes available.</p>
//           )}
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default ViewNotes;




import { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload } from "react-icons/fi";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  semester: string;
  courseName: string;
}

interface Note {
  _id: string;
  semester: string;
  courseName: string;
  fileUrl: string;
}

const ViewNotes = () => {
  const [semesters, setSemesters] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSemestersAndCourses();
  }, []);

  const fetchSemestersAndCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      if (Array.isArray(response.data)) {
        setCourses(response.data);
        const uniqueSemesters = [...new Set(response.data.map((course) => course.semester))];
        setSemesters(uniqueSemesters);
      }
    } catch (error) {
      console.error("Error fetching semesters and courses:", error);
      setError("Failed to load courses.");
    }
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSem = e.target.value;
    setSelectedSemester(selectedSem);
    setSelectedCourse("");
    setFilteredCourses(courses.filter((course) => course.semester === selectedSem));
    setNotes([]); 
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
    setNotes([]); 
  };

const fetchNotes = async () => {
  if (!selectedSemester || !selectedCourse) return;

  setLoading(true);
  setError("");

  try {
    console.log("Fetching notes for:", { semester: selectedSemester, course: selectedCourse });

    const response = await axios.get("http://localhost:5000/api/notes");

    console.log("API Response:", response.data);

    if (Array.isArray(response.data)) {
     
      const filteredNotes = response.data.filter(
        (note) => note.semester === selectedSemester && note.courseName === selectedCourse
      );
      setNotes(filteredNotes);
    } else {
      setNotes([]);
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    setError("Failed to fetch notes.");
    setNotes([]);
  } finally {
    setLoading(false);
  }
};


  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      console.log("Downloading file from:", fileUrl);
  
      const response = await axios.get(fileUrl, {
        responseType: "blob", 
      });
  
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "downloaded_file.pdf");
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("File download failed. Check if the file exists.");
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
      <div className="bg-white p-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">View Notes</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-4">
          <select
            className="w-full p-3 border border-[#876bcb] rounded-lg focus:ring-2 focus:ring-purple-500"
            value={selectedSemester}
            onChange={handleSemesterChange}
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          <select
            className="w-full p-3 border border-[#876bcb] rounded-lg focus:ring-2 focus:ring-purple-500"
            value={selectedCourse}
            onChange={handleCourseChange}
            disabled={!selectedSemester}
          >
            <option value="">Select Course</option>
            {filteredCourses.map((course) => (
              <option key={course._id} value={course.courseName}>{course.courseName}</option>
            ))}
          </select>

          <button
            className=" bg-gradient-to-r from-[#876bcb] to-purple-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-[#876bcb]"
            onClick={fetchNotes}
            disabled={!selectedSemester || !selectedCourse || loading}
          >
            {loading ? "Fetching..." : "Fetch Notes"}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-gray-500 text-center">Loading notes...</p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
                <p className="font-semibold text-gray-700">{note.courseName}</p>
                <button
                  onClick={() => handleDownload(note.fileUrl, `${note.courseName}_notes.pdf`)}
                  className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center"
                >
                  <FiDownload className="w-5 h-5 mr-1" /> Download
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No notes available.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ViewNotes;




