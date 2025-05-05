import { MenuItem } from "./user";

export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: "tachometer",
    path: "/dashboard",
    subcategories: [],
  },
  {
    name: "Students",
    icon: "userGraduate",
    path: "/addstudent",
    subcategories: [
      { name: "View Student", path: "/students" },
    ],
  },
  {
    name: "Courses",
    icon: "chalkboardTeacher",
    path: "/course",
    subcategories: [{ name: "View Courses", path: "viewcourses" }],
  },
  {
    name: "Assignment",
    icon: "clipboardList", 
    path: "/assignments",
    subcategories: [
     
      { name: "View Assignment", path: "ViewAssignments" },
    ],
  },
  {
    name: "Attendance",
    icon: "calendarCheck", 
    path: "/attendance",
    subcategories: [
      { name: "View Attendance", path: "viewattendance" },
    ],
  },
  {
    name: "Notes",
    icon: "bookOpen", 
    path: "/addnotes",
    subcategories: [
      { name: "View Notes", path: "viewnotes" },
    ],
  },
  {
    name: "Grades",
    icon: "book",
    path: "/grades",
    subcategories: [{ name: "View Grades", path: "viewgrades" }],
  },
  
  {
    name: "Reports",
    icon: "chartBar",
    path: "/reports",
    subcategories: [],
  },
];
