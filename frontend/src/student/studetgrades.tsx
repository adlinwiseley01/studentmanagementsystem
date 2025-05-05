// import { useEffect, useState } from "react";
// import { FiDownload } from "react-icons/fi";
// import profile from "../assets/studentprofile.png";
// import { useNavigate } from "react-router-dom";

// type Course = {
//   course: string;
//   marks: number;
// };

// type Student = {
//   name: string;
//   semester: string;
//   courses: Course[];
//   status: string;
// };

// const StudentDetails = () => {
//   const [student, setStudent] = useState<Student | null>(null);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const username = localStorage.getItem("username");
//     if (username) {
//       fetch(`http://localhost:5000/api/students/${username}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Student not found");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setStudent(data);
//           setFilteredCourses(data.courses);
//           setLoading(false);
//         })
//         .catch((error) => {
//           setError(error.message);
//           setLoading(false);
//         });
//     } else {
//       setError("Username not found in localStorage");
//       setLoading(false);
//     }
//   }, []);

//   const handleDownloadCSV = () => {
//     const csvContent = [
//       ["Course", "Marks"],
//       ...filteredCourses.map((course) => [course.course, course.marks]),
//     ]
//       .map((e) => e.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "student_courses.csv";
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   if (loading) {
//     return <div className="text-center text-lg">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-lg text-red-600">{error}</div>;
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
//       <div className="bg-white w-full min-h-screen">
//          {/* Navigation Bar */}
//       <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
//       <h1 className="text-white text-2xl font-bold">Student</h1>
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
//     <div className="p-6">
//         {student ? (
//           <div>
//             <div className="flex justify-between items-center mb-8">
//               <div className="mb-6">
//                 <h3 className="text-3xl font-bold text-gray-800">
//                   Grades for {student.name}
//                 </h3>
//                 <p className="text-lg mb-10 text-gray-600">
//                   {student.semester}
//                 </p>
//               </div>
//               {/* Download CSV Button */}
//               <div className="text-center mb-6">
//                 <button
//                   onClick={handleDownloadCSV}
//                   className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-[#7558b0] transition duration-300 transform hover:scale-105"
//                 >
//                   <FiDownload className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Courses Table */}
//             <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
//               <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
//                 <thead className="bg-[#f3e8ff] text-gray-800">
//                   <tr>
//                     <th className="p-4 text-center font-semibold text-lg">
//                       Course
//                     </th>
//                     <th className="p-4 text-center font-semibold text-lg">
//                       Marks
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCourses.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={2}
//                         className="py-4 px-4 text-center text-gray-600"
//                       >
//                         No courses available
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredCourses.map((course, index) => (
//                       <tr
//                         key={index}
//                         className={`text-gray-800 text-center transition-all duration-200 ${
//                           index % 2 === 0 ? "bg-gray-100" : "bg-white"
//                         } hover:bg-gray-200`}
//                       >
//                         <td className="p-4 text-center text-lg font-medium">
//                           {course.course}
//                         </td>
//                         <td className="p-4 text-center text-lg font-medium">
//                           {course.marks}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <p>No student data available</p>
//         )}
//       </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDetails;



import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import profile from "../assets/studentprofile.png";
import { useNavigate } from "react-router-dom";

type Course = {
  course: string;
  marks: number;
};

type Student = {
  name: string;
  semester: string;
  courses: Course[];
  status: string;
};

const StudentDetails = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      fetch(`http://localhost:5000/api/students/${username}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Student not found");
          }
          return response.json();
        })
        .then((data) => {
          setStudent(data);
          setFilteredCourses(data.courses);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError("Username not found in localStorage");
      setLoading(false);
    }
  }, []);

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Course", "Marks"],
      ...filteredCourses.map((course) => [course.course, course.marks]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_courses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
      <div className="bg-white w-full min-h-screen">
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
        {student ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-gray-800">
                  Grades for {student.name}
                </h3>
                <p className="text-lg mb-10 text-gray-600">
                  {student.semester}
                </p>
              </div>
              {/* Download CSV Button */}
              <div className="text-center mb-6">
                <button
                  onClick={handleDownloadCSV}
                  className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-[#7558b0] transition duration-300 transform hover:scale-105"
                >
                  <FiDownload className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
                <thead className="bg-[#f3e8ff] text-gray-800">
                  <tr>
                    <th className="p-4 text-center font-semibold text-lg">
                      Course
                    </th>
                    <th className="p-4 text-center font-semibold text-lg">
                      Marks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-4 px-4 text-center text-gray-600"
                      >
                        No courses available
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course, index) => (
                      <tr
                        key={index}
                        className={`text-gray-800 text-center transition-all duration-200 ${
                          index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        } hover:bg-gray-200`}
                      >
                        <td className="p-4 text-center text-lg font-medium">
                          {course.course}
                        </td>
                        <td className="p-4 text-center text-lg font-medium">
                          {course.marks}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No student data available</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default StudentDetails;



