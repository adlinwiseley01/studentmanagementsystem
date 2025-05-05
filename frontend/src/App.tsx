import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import  Studentsidebar from "./components/studentsidebar";
import Signup from "./components/Signup";
import { Student } from "./user";


const Dashboard = React.lazy(() => import("./pages/dashboard"));
const Students = React.lazy(() => import("./pages/student"));
const Grades = React.lazy(() => import("./pages/grades"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Attendance = React.lazy(() => import("./pages/attendance"));
const Assignments = React.lazy(() => import("./pages/assignments"));
const Courses = React.lazy(() => import("./pages/course"));
const Addcourses = React.lazy(() => import("./pages/viewcourses"));
const Addstudents = React.lazy(() => import("./pages/addstudent"));
const ViewGrades = React.lazy(() => import("./pages/viewgrades"));
const ViewAttendance = React.lazy(() => import("./pages/ViewAttendance"));
const ViewAssignment = React.lazy(() => import("./pages/ViewAssignments"));
const AddNotes = React.lazy(() => import("./pages/AddNotes"));
const ViewNotes = React.lazy(() => import("./pages/viewnotes"));

const StudentDashboard = React.lazy(() => import("./student/studentdashboard"));
const StudentCourses = React.lazy(() => import("./student/studentcourses"));
const StudentAssignment=React.lazy(()=>import("./student/studentassignment"))
const  StudentAttendance=React.lazy(()=>import("./student/studentattendance"))
const  StudentNotes=React.lazy(()=>import("./student/studentnotes"))
const  StudentGrades=React.lazy(()=>import("./student/studetgrades"))
const  StudentReports=React.lazy(()=>import("./student/studentreports"))
const  StudentResume=React.lazy(()=>import("./student/studentresume"))

const App = () => {
  const [students, setStudents] = useState<Student[]>([]);

  return (
    <Router>
      <MainLayout students={students} setStudents={setStudents} />
    </Router>
  );
};

const MainLayout = ({ students, setStudents }: { students: Student[]; setStudents: React.Dispatch<React.SetStateAction<Student[]>> }) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/"];
  const studentRoutes = ["/studentdashboard", "/studentattendance", "/studentassignment", "/studentgrades", "/studentcourses","/studentnotes" ,"/studentreports","/studentresume"];

  return (
    <>
    <div className="flex bg-gray-100 min-h-screen">
    {!hideSidebarRoutes.includes(location.pathname) && !studentRoutes.includes(location.pathname) && <Sidebar />}
    {studentRoutes.includes(location.pathname) && <Studentsidebar />}

      <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard  />} />
          <Route path="/students" element={<Students  />} />
          <Route path="/addstudent" element={<Addstudents students={students} setStudents={setStudents} />} />
          <Route path="/addnotes" element={<AddNotes />} />
          <Route path="/viewnotes" element={<ViewNotes  />} />
          <Route path="/attendance" element={<Attendance  />} />
          <Route path="/assignments" element={<Assignments />}/>
          <Route path="/course" element={<Courses  />} />
          <Route path="/viewcourses" element={<Addcourses  />} />
          <Route path="/viewattendance" element={<ViewAttendance />}/>
          <Route path="/viewassignments" element={<ViewAssignment/>} />
          <Route path="/grades" element={<Grades/>} />
          <Route path="/viewgrades" element={<ViewGrades/>} />
          <Route path="/reports" element={<Reports/>} />



          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/studentcourses" element={<StudentCourses />} />
          <Route path="/StudentAssignment" element={<StudentAssignment/>}/>
          <Route path="/studentattendance" element={<StudentAttendance/>}/>
          <Route path="/studentnotes" element={<StudentNotes/>}/>
          <Route path="/studentgrades" element={<StudentGrades/>}/>
          <Route path="/studentreports" element={<StudentReports/>}/>
          <Route path="/studentresume" element={<StudentResume/>}/>

        </Routes>
      </Suspense>
    </div>



</>
  );
};

export default App;


