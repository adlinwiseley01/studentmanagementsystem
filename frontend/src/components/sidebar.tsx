import React, { JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBook,
  FaChartBar,
  FaClipboardList,
  FaChevronDown,
  FaBars,
  FaSignOutAlt,
  FaCalendarCheck,
  FaBookOpen, 
  FaChalkboardTeacher,
} from "react-icons/fa";
import { menuItems } from "../menudata";
import { MenuItem } from "../user";
import logo from "../assets/logo.png";

const getIcon = (iconName: string) => {
  const icons: Record<string, JSX.Element> = {
    tachometer: <FaTachometerAlt />,
    userGraduate: <FaUserGraduate />,
    book: <FaBook />,
    bookOpen: <FaBookOpen />, 
    chartBar: <FaChartBar />,
    clipboardList: <FaClipboardList />,
    calendarCheck: <FaCalendarCheck />,
    chalkboardTeacher: <FaChalkboardTeacher />,
  };
  return icons[iconName] || null;
};

const Sidebar = React.memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState<string>("Dashboard");
  const [openSubcategory, setOpenSubcategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleSubcategories = (name: string) => {
    setOpenSubcategory((prev) => (prev === name ? null : name));
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      className={`h-vh bg-white text-gray-500 p-5 pb-3 flex flex-col justify-between transition-all duration-300 relative shadow-lg ${
        isExpanded ? "w-90" : "w-20"
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className={`transition-all ${
                isExpanded ? "w-50 h-50" : "w-12 h-12"
              }`}
            />
            {/* {isExpanded && (
              <h5 className="font-bold">Admin</h5>
            )} */}
          </div>
          <button
            className="text-gray-500 text-sm p-2 hover:scale-110 transition"
            onClick={toggleSidebar}
          >
             <FaBars size={24} ></FaBars>
          </button>
        </div>
        <ul className="mt-4 space-y-3">
          {menuItems.map((item: MenuItem) => (
            <li key={item.name}>
              <div>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    active === item.name
                      ? "bg-[#876bcb] text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActive(item.name)}
                >
                  <span className="text-xl">{getIcon(item.icon)}</span>
                  <span
                    className={`ml-2 transition-opacity duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>
                  {item.subcategories.length > 0 && isExpanded && (
                    <FaChevronDown
                      className={`ml-auto transition-transform duration-300 ${
                        openSubcategory === item.name ? "rotate-180" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubcategories(item.name);
                      }}
                    />
                  )}
                </Link>
                {openSubcategory === item.name &&
                  isExpanded &&
                  item.subcategories.length > 0 && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.subcategories.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className="flex items-center p-2 rounded-md bg-[#eaeaea] hover:bg-[#876bcb] hover:text-white transition-all"
                          >
                            <span className="ml-2">{sub.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-auto flex items-center p-3 rounded-lg bg-[#876bcb] text-white hover:[#876bcb] transition-all"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="text-xl" />
        {isExpanded && <span className="ml-2">Logout</span>}
      </button>
    </div>
  );
});

export default Sidebar;
