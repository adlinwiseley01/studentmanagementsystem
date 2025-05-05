// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "react-calendar/dist/Calendar.css";

// import {
//   FaUserGraduate,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaPlus,
//   FaTrophy,
//   FaBook,
// } from "react-icons/fa";
// import profile from "../assets/studentprofile.png";
// import dashboardImage from "../assets/dashboard.png"; // Replace with your actual image

// interface Assignment {
//   deadlineDate: string;
//   title: string;
//   description: string;
//   issuedDate: string;
// }

// interface Student {
//   name: string;
//   score: number;
// }

// const Dashboard = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [totalStudents, setTotalStudents] = useState<number>(0);
//   const [allClear, setAllClear] = useState<number>(0);
//   const [arrears, setArrears] = useState<number>(0);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
// const [topStudents, setTopStudents] = useState<Student[]>([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async (url: string, setter: Function) => {
//       try {
//         const response = await fetch(url);
//         if (!response.ok)
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         const data = await response.json();
//         setter(data);
//       } catch (error) {
//         console.error(`Error fetching data from ${url}:`, error);
//       }
//     };

//     fetchData("http://localhost:5000/api/addstudents", (data: Student[]) =>
//       setTotalStudents(data.length)
//     );
//     fetchData("http://localhost:5000/api/students/pass-fail", (data: any) => {
//       setAllClear(data.passCount);
//       setArrears(data.failCount);
//     });
//     fetchData("http://localhost:5000/api/assignments", setAssignments);
// fetchData("http://localhost:5000/api/students/top", setTopStudents);
//   }, []);

//   return (
//     <div className="bg-white min-h-screen w-full">
//       {/* Navigation Bar */}
//       <nav className="bg-gradient-to-r from-[#876bcb] to-purple-500 p-4 w-full flex justify-between items-center">
//         <h1 className="text-white text-2xl font-bold">Admin</h1>
//         <div className="relative">
//           <img
//             src={profile}
//             alt="User"
//             className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
//             onClick={() => setShowDropdown(!showDropdown)}
//           />
//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
//               <div className="px-4 py-2 text-left text-gray-700">Admin</div>
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
//         {/* Welcome Section */}
//         <div className="p-6 bg-purple-100 text-purple-800 rounded-lg shadow-md flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">
//               Welcome to the Admin Dashboard
//             </h2>
//             <p className="text-lg mt-2">
//               Manage your students, assignments, attendance, and grades
//               efficiently.
//             </p>
//           </div>

//           {/* Enlarged Dashboard Image */}
//           <img src={dashboardImage} alt="Dashboard" className="w-70 h-45" />
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//           <div className="p-6 bg-green-100 shadow-lg rounded-lg flex items-center gap-4">
//             <FaCheckCircle className="text-green-600 text-3xl" />
//             <h2 className="text-lg font-semibold">All Clear: {allClear}</h2>
//           </div>
//           <div className="p-6 bg-red-100 shadow-lg rounded-lg flex items-center gap-4">
//             <FaTimesCircle className="text-red-600 text-3xl" />
//             <h2 className="text-lg font-semibold">Arrears: {arrears}</h2>
//           </div>
//           <div className="p-6 bg-blue-100 shadow-lg rounded-lg flex items-center gap-4">
//             <FaUserGraduate className="text-blue-600 text-3xl" />
//             <h2 className="text-lg font-semibold">
//               Total Students: {totalStudents}
//             </h2>
//           </div>
//         </div>

// {/* Content Sections */}
// <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//   {/* Top Students */}
//   <div className="p-6 bg-yellow-100 shadow-lg rounded-lg">
//     <h2 className="text-2xl font-semibold mb-4 flex items-center">
//       <FaTrophy className="text-yellow-500 text-3xl mr-2" /> Top 3
//       Students
//     </h2>
//     <ul>
//       {topStudents.map((student, index) => {
//         const medals = ["🥇", "🥈", "🥉"];
//         return (
//           <li
//             key={index}
//             className="mb-2 flex items-center gap-3 bg-yellow-50 p-3 rounded-lg shadow-md"
//           >
//             <span className="text-2xl">{medals[index] || "🎖️"}</span>
//             {student.name}
//           </li>
//         );
//       })}
//     </ul>
//   </div>

//   {/* Assignments */}
//   <div className="p-6 bg-white shadow-lg rounded-lg">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="text-2xl font-semibold flex items-center">
//         <FaBook className="text-[#6c4ebd] text-3xl mr-2" /> Assignments
//       </h2>
//       <button
//         className="flex items-center bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-2 rounded-lg hover:bg-[#5337a4] transition"
//         onClick={() => navigate("/assignments")}
//       >
//         <FaPlus className="mr-2" /> Add Assignment
//       </button>
//     </div>
//     {assignments.length === 0 ? (
//       <p className="text-gray-600">No assignments available</p>
//     ) : (
//       <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {assignments.map((assignment, index) => (
//           <li
//             key={index}
//             className="p-4 bg-gray-50 shadow rounded-lg border border-gray-300"
//           >
//             <h3 className="text-lg font-semibold">
//               {assignment.title}
//             </h3>
//             <p className="text-gray-600">{assignment.description}</p>
//             <p className="text-sm text-gray-500">
//               ⏳Issued:{" "}
//               {new Date(assignment.issuedDate).toLocaleDateString()}
//             </p>
//           </li>
//         ))}
//       </ul>
//     )}
//   </div>
// </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaTrophy,
  FaBook,
} from "react-icons/fa";
import profile from "../assets/profile.png";
import dashboardImage from "../assets/dashboard.png";

interface Assignment {
  deadlineDate: string;
  title: string;
  description: string;
  issuedDate: string;
}

interface Student {
  name: string;
  semester: string;
  courses: Course[];
}

interface Course {
  course: string;
  marks: number;
}

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [allClear, setAllClear] = useState<number>(0);
  const [arrears, setArrears] = useState<number>(0);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("All Courses");
  const [topStudents, setTopStudents] = useState<Student[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (url: string, setter: Function) => {
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    fetchData("http://localhost:5000/api/addstudents", (data: Student[]) =>
      setTotalStudents(data.length)
    );
    fetchData("http://localhost:5000/api/students/pass-fail", (data: any) => {
      setAllClear(data.passCount);
      setArrears(data.failCount);
    });
    fetchData("http://localhost:5000/api/assignments", setAssignments);
    fetchData("http://localhost:5000/api/students/top", setTopStudents);
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get<Student[]>(
          "http://localhost:5000/api/students"
        );
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          toast.error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error fetching student grades:", error);
        toast.error("Failed to fetch student grades.");
      }
    };
    fetchGrades();
  }, []);

  const allCourses = useMemo(() => {
    const courseSet = new Set<string>();
    students.forEach((student) =>
      student.courses.forEach((c) => courseSet.add(c.course))
    );
    return ["All Courses", ...Array.from(courseSet)];
  }, [students]);

  const chartData = useMemo(() => {
    return students.map((student) => {
      const studentData: { name: string; [key: string]: number | string } = {
        name: student.name,
      };

      student.courses.forEach((c) => {
        if (selectedCourse === "All Courses" || c.course === selectedCourse) {
          studentData[c.course] = c.marks;
        }
      });

      return studentData;
    });
  }, [students, selectedCourse]);

  return (
    <div className="bg-white min-h-screen w-full">
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
        <div className="p-6 bg-purple-100 text-purple-800 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome to the Admin Dashboard
            </h2>
            <p className="text-lg mt-2">
              Manage your students, assignments, attendance, and grades
              efficiently.
            </p>
          </div>
          <img src={dashboardImage} alt="Dashboard" className="w-70 h-45" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
          <div className="p-6 bg-green-100 shadow-lg rounded-lg flex items-center gap-4">
            <FaCheckCircle className="text-green-600 text-3xl" />
            <h2 className="text-lg font-semibold">All Clear: {allClear}</h2>
          </div>
          <div className="p-6 bg-red-100 shadow-lg rounded-lg flex items-center gap-4">
            <FaTimesCircle className="text-red-600 text-3xl" />
            <h2 className="text-lg font-semibold">Arrears: {arrears}</h2>
          </div>
          <div className="p-6 bg-blue-100 shadow-lg rounded-lg flex items-center gap-4">
            <FaUserGraduate className="text-blue-600 text-3xl" />
            <h2 className="text-lg font-semibold">
              Total Students: {totalStudents}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-yellow-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaTrophy className="text-yellow-500 text-3xl mr-2" /> Top 3
              Students
            </h2>
            <ul>
              {topStudents.map((student, index) => {
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <li
                    key={index}
                    className="mb-2 flex items-center gap-3 bg-yellow-50 p-3 rounded-lg shadow-md"
                  >
                    <span className="text-2xl">{medals[index] || "🎖️"}</span>
                    {student.name}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center">
                <FaBook className="text-[#6c4ebd] text-3xl mr-2" /> Assignments
              </h2>
              <button
                className="flex items-center bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-2 rounded-lg hover:bg-[#5337a4] transition"
                onClick={() => navigate("/assignments")}
              >
                <FaPlus className="mr-2" /> Add Assignment
              </button>
            </div>
            {assignments.length === 0 ? (
              <p className="text-gray-600">No assignments available</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((assignment, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-50 shadow rounded-lg border border-gray-300"
                  >
                    <h3 className="text-lg font-semibold">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600">{assignment.description}</p>
                    <p className="text-sm text-gray-500">
                      ⏳Issued:{" "}
                      {new Date(assignment.issuedDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Student Performance Chart
          </h2>
          <label className="block text-gray-700 font-semibold mb-2">
            Select Course:
          </label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {allCourses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedCourse === "All Courses" ? (
                  allCourses
                    .slice(1)
                    .map((course, index) => (
                      <Bar
                        key={index}
                        dataKey={course}
                        fill={`#${Math.random().toString(16).slice(2, 8)}`}
                      />
                    ))
                ) : (
                  <Bar dataKey={selectedCourse} fill="#6c4ebd" />
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No data available.</p>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default Dashboard;
