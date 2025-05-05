// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "react-calendar/dist/Calendar.css";
// import { motion } from "framer-motion";
// import Calendar from "react-calendar";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { FaBell, FaClock, FaFileAlt } from "react-icons/fa";
// import profile from "../assets/studentprofile.png";
// import studentIllustration from "../assets/studentdashboard.png";

// // Registering Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Interfaces
// interface Assignment {
//   deadlineDate: string;
//   title: string;
//   description: string;
//   issuedDate: string;
// }

// interface Course {
//   course: string;
//   marks: number;
// }

// interface Student {
//   name: string;
//   semester: string;
//   courses: Course[];
// }

// // Student Dashboard Component
// const StudentDashboard = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [student, setStudent] = useState<Student | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error] = useState<string | null>(null);

//   const navigate = useNavigate();
//   const username = localStorage.getItem("username") || "Student";

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

//     fetchData("http://localhost:5000/api/assignments", setAssignments);
//     fetchData(
//       `http://localhost:5000/api/students/${username}`,
//       (data: Student) => {
//         setStudent(data);
//         setLoading(false);
//       }
//     );
//   }, [username]);

//   const isDeadline = (date: Date) => {
//     return assignments.some(
//       (assignment) =>
//         assignment.deadlineDate === date.toISOString().split("T")[0]
//     );
//   };

//   const getDaysLeft = (deadline: string) => {
//     const today = new Date();
//     const dueDate = new Date(deadline);
//     return Math.ceil(
//       (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
//     );
//   };

//   const chartData = {
//     labels:
//       student?.courses.map((course: { course: string }) => course.course) || [],
//     datasets: [
//       {
//         label: "Marks",
//         data:
//           student?.courses.map((course: { marks: number }) => course.marks) ||
//           [],
//         backgroundColor: "rgba(108, 78, 189, 0.7)",
//         borderColor: "rgba(108, 78, 189, 1)",
//         borderWidth: 1,
//         borderRadius: 8,
//       },
//     ],
//   };

//   if (loading) {
//     return <div className="text-center text-lg">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-lg text-red-600">{error}</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen w-full">
//       {/* Navigation Bar */}
//       <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
//         <h1 className="text-white text-2xl font-bold">Student Dashboard</h1>
//         <div className="relative flex items-center">
//           <img
//             src={profile}
//             alt="User"
//             className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
//             onClick={() => setShowDropdown(!showDropdown)}
//           />
//           <FaFileAlt
//             className="text-white text-2xl ml-4 cursor-pointer"
//             onClick={() => navigate("/studentresume")}
//           />
//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//               <div className="px-4 py-2 text-left text-gray-700 font-semibold">
//                 {username}
//               </div>
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

//       {/* Rest of the Dashboard Content */}
//       <div className="pt-6 px-6">
//         {/* Top Section: Welcome + Calendar */}
//         <div className="grid grid-cols-3 gap-6">
//           {/* Welcome Section (Takes 2 columns) */}
//           <div className="col-span-2 bg-purple-100 text-purple-800 p-8 rounded-lg shadow-md flex items-center justify-between h-[250px]">
//             <div>
//               <h1 className="text-3xl font-bold text-[#6c4ebd]">
//                 Welcome Back, {username}!
//               </h1>
//               <p className="text-gray-600 text-xl mt-1">
//                 Track assignments and performance.
//               </p>
//             </div>
//             <img
//               src={studentIllustration}
//               alt="Student"
//               className="w-50 h-50 object-contain"
//             />
//           </div>

//           {/* Calendar Section (Takes 1 column) */}
//           <div className="col-span-1 p-4 mt-[-50px]">
//             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//               <div className="max-w-[300px] max-h-[330px] scale-[0.8] overflow-hidden">
//                 <Calendar
//                   onChange={(date) => setSelectedDate(date as Date)}
//                   value={selectedDate}
//                   tileClassName={({ date, view }) => {
//                     const today = new Date();
//                     const isToday =
//                       date.toDateString() === today.toDateString();
//                     const isAssignment = isDeadline(date);
//                     const isActive =
//                       selectedDate &&
//                       date.toDateString() === selectedDate.toDateString();

//                     if (view === "month") {
//                       if (isActive) {
//                         return "relative bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-md"; // Gradient for active date
//                       }
//                       if (isToday) {
//                         return "relative bg-purple-300 text-white rounded-md"; // Purple background for today
//                       }
//                       if (isAssignment) {
//                         return "relative text-purple-800 font-bold"; // Purple text for assignment deadlines
//                       }
//                     }
//                     return "";
//                   }}
//                   className="border-2 border-gray-300 rounded-xl shadow-md p-2 bg-white text-gray-800 text-sm"
//                 />
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-6 mt-6">
//           {/* Performance Report (Takes 2 columns) */}
//           <div className="col-span-2 p-6 ">
//             {/* Chart Section */}
//             <div className="w-full bg-gray-50 p-4 mt-2 rounded-lg shadow-md border border-gray-300">
//               <div style={{ width: "90%", height: "320px" }}>
//                 <Bar
//                   data={chartData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: {
//                         display: false,
//                       },
//                       title: {
//                         display: true,
//                         text: "Course-wise Marks Distribution",
//                         font: {
//                           size: 18,
//                           weight: "bold",
//                         },
//                         color: "#333",
//                       },
//                     },
//                     scales: {
//                       x: {
//                         grid: { display: false },
//                         ticks: { color: "#6c4ebd", font: { weight: "bold" } },
//                       },
//                       y: {
//                         grid: { color: "rgba(200, 200, 200, 0.2)" },
//                         ticks: {
//                           stepSize: 10,
//                           color: "#555",
//                           font: { weight: "bold" },
//                         },
//                       },
//                     },
//                     animation: {
//                       duration: 800,
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="col-span-1 p-3 bg-orange-100 shadow-md rounded-md max-h-[350px] overflow-y-auto">
//             <h2 className="text-md font-semibold flex items-center mb-2">
//               <FaBell className="text-orange-500 text-lg mr-2" /> Reminders
//             </h2>
//             {assignments.length === 0 ? (
//               <p className="text-gray-600 text-sm">No upcoming deadlines</p>
//             ) : (
//               <ul className="space-y-1">
//                 {assignments
//                   .sort(
//                     (a, b) =>
//                       new Date(a.deadlineDate).getTime() -
//                       new Date(b.deadlineDate).getTime()
//                   )
//                   .map((assignment, index) => {
//                     const daysLeft = getDaysLeft(assignment.deadlineDate);
//                     return (
//                       <li
//                         key={index}
//                         className="relative p-2 bg-yellow-100 rounded-md shadow-sm text-xs flex flex-col"
//                       >
//                         <h3 className="font-medium">{assignment.title}</h3>
//                         <p className="text-gray-600">
//                           {assignment.description}
//                         </p>

//                         {/* Due Date and Days Left Badge */}
//                         <div className="flex items-center justify-between">
//                           <p className="text-gray-700 flex items-center">
//                             <FaClock className="mr-1 text-sm" /> Due on{" "}
//                             <span className="text-red-600 ml-1">
//                               {new Date(
//                                 assignment.deadlineDate
//                               ).toLocaleDateString()}
//                             </span>
//                           </p>

//                           {/* Badge placed next to "Due on" */}
//                           <span
//                             className={`px-2 py-1 rounded-full text-white text-[10px] font-bold ${
//                               daysLeft <= 2 ? "bg-red-500" : "bg-green-500"
//                             }`}
//                           >
//                             {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
//                           </span>
//                         </div>
//                       </li>
//                     );
//                   })}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaBell, FaClock, FaFileAlt } from "react-icons/fa";
import profile from "../assets/studentprofile.png";
import studentIllustration from "../assets/studentdashboard.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Assignment {
  deadlineDate: string;
  title: string;
  description: string;
  issuedDate: string;
}

interface Course {
  course: string;
  marks: number;
}

interface Student {
  name: string;
  semester: string;
  courses: Course[];
}

const StudentDashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Student";

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

    fetchData("http://localhost:5000/api/assignments", setAssignments);
    fetchData(
      `http://localhost:5000/api/students/${username}`,
      (data: Student) => {
        setStudent(data);
        setLoading(false);
      }
    );
  }, [username]);

  const isDeadline = (date: Date) => {
    return assignments.some(
      (assignment) =>
        assignment.deadlineDate === date.toISOString().split("T")[0]
    );
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    return Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  };

  const chartData = {
    labels:
      student?.courses.map((course: { course: string }) => course.course) || [],
    datasets: [
      {
        label: "Marks",
        data:
          student?.courses.map((course: { marks: number }) => course.marks) ||
          [],
        backgroundColor: "rgba(108, 78, 189, 0.7)",
        borderColor: "rgba(108, 78, 189, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Student Dashboard</h1>
        <div className="relative flex items-center">
          <FaFileAlt
            className="text-white text-2xl cursor-pointer"
            onClick={() => navigate("/studentresume")}
          />
          <img
            src={profile}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white ml-4"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <div className="px-4 py-2 text-left text-gray-700 font-semibold">
                {username}
              </div>
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
      <div className="pt-6 px-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-purple-100 text-purple-800 p-8 rounded-lg shadow-md flex items-center justify-between h-[250px]">
            <div>
              <h1 className="text-3xl font-bold text-[#6c4ebd]">
                Welcome Back, {username}!
              </h1>
              <p className="text-gray-600 text-xl mt-1">
                Track assignments and performance.
              </p>
            </div>
            <img
              src={studentIllustration}
              alt="Student"
              className="w-50 h-50 object-contain"
            />
          </div>

          <div className="col-span-1 p-4 mt-[-50px]">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="max-w-[300px] max-h-[330px] scale-[0.8] overflow-hidden">
                <Calendar
                  onChange={(date) => setSelectedDate(date as Date)}
                  value={selectedDate}
                  tileClassName={({ date, view }) => {
                    const today = new Date();
                    const isToday =
                      date.toDateString() === today.toDateString();
                    const isAssignment = isDeadline(date);
                    const isActive =
                      selectedDate &&
                      date.toDateString() === selectedDate.toDateString();

                    if (view === "month") {
                      if (isActive) {
                        return "relative bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-md";
                      }
                      if (isToday) {
                        return "relative bg-purple-300 text-white rounded-md";
                      }
                      if (isAssignment) {
                        return "relative text-purple-800 font-bold";
                      }
                    }
                    return "";
                  }}
                  className="border-2 border-gray-300 rounded-xl shadow-md p-2 bg-white text-gray-800 text-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 p-6 ">
            <div className="w-full bg-gray-50 p-4 mt-2 rounded-lg shadow-md border border-gray-300">
              <div style={{ width: "90%", height: "320px" }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: true,
                        text: "Course-wise Marks Distribution",
                        font: {
                          size: 18,
                          weight: "bold",
                        },
                        color: "#333",
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: "#6c4ebd", font: { weight: "bold" } },
                      },
                      y: {
                        grid: { color: "rgba(200, 200, 200, 0.2)" },
                        ticks: {
                          stepSize: 10,
                          color: "#555",
                          font: { weight: "bold" },
                        },
                      },
                    },
                    animation: {
                      duration: 800,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 p-3 bg-orange-100 shadow-md rounded-md max-h-[350px] overflow-y-auto">
            <h2 className="text-md font-semibold flex items-center mb-2">
              <FaBell className="text-orange-500 text-lg mr-2" /> Reminders
            </h2>
            {assignments.length === 0 ? (
              <p className="text-gray-600 text-sm">No upcoming deadlines</p>
            ) : (
              <ul className="space-y-1">
                {assignments
                  .sort(
                    (a, b) =>
                      new Date(a.deadlineDate).getTime() -
                      new Date(b.deadlineDate).getTime()
                  )
                  .map((assignment, index) => {
                    const daysLeft = getDaysLeft(assignment.deadlineDate);
                    return (
                      <li
                        key={index}
                        className="relative p-2 bg-yellow-100 rounded-md shadow-sm text-xs flex flex-col"
                      >
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-gray-600">
                          {assignment.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="text-gray-700 flex items-center">
                            <FaClock className="mr-1 text-sm" /> Due on{" "}
                            <span className="text-red-600 ml-1">
                              {new Date(
                                assignment.deadlineDate
                              ).toLocaleDateString()}
                            </span>
                          </p>

                          <span
                            className={`px-2 py-1 rounded-full text-white text-[10px] font-bold ${
                              daysLeft <= 2 ? "bg-red-500" : "bg-green-500"
                            }`}
                          >
                            {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
