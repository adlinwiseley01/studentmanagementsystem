// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEnvelope, FaLock, FaUser, FaUsers } from "react-icons/fa";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Auth = () => {
//   const [roleSelected, setRoleSelected] = useState(false);
//   const [userType, setUserType] = useState<string>(""); // Role selection
//   const [isLogin, setIsLogin] = useState(true);
//   const [isForgotPassword, setIsForgotPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "",
//   });

//   const navigate = useNavigate();

//   const handleRoleSelection = (role: string) => {
//     setUserType(role); // Update role state
//     setRoleSelected(true);
//     setIsLogin(true);
//     setFormData((prev) => ({
//       ...prev,
//       userType: role, // Ensure formData also gets updated
//     }));
//   };

//   const handleChange = (e: { target: { name: string; value: string } }) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     console.log("🚀 Sending Data:", { ...formData });

//     try {
//       if (isForgotPassword) {
//         await axios.post("http://localhost:5000/api/auth/forgot-password", {
//           email: formData.email,
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//         });
//         toast.success("Password changed successfully!");
//         navigate("/");
//         setIsForgotPassword(false);
//       } else if (isLogin) {
//         const response = await axios.post(
//           "http://localhost:5000/api/auth/login",
//           {
//             email: formData.email,
//             password: formData.password,
//           }
//         );

//         const { token, user } = response.data;

//         // Ensure userType matches selected role before proceeding
//         if (user.userType !== userType) {
//           toast.error("Incorrect role selected. Please check your login role.");
//           return;
//         }

//         localStorage.setItem("token", token);

//         // Extract username from email (before @)
//         const username = formData.email.split("@")[0];
//         localStorage.setItem("username", username);

//         toast.success("Login successful!");

//         if (user.userType === "admin") {
//           navigate("/dashboard");
//         } else if (user.userType === "student") {
//           navigate("/studentdashboard");
//         }
//       } else {
//         await axios.post("http://localhost:5000/api/auth/register", {
//           ...formData,
//           userType: formData.userType || userType,
//         });
//         toast.success("Sign-up successful! Please log in.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       toast.error("Error in credentials");
//     }
//   };

//   return (
//     <div className="w-full flex items-center justify-center p-6 bg-gray-100 min-h-screen">
//       {!roleSelected ? (
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
//           <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
//           <button
//             onClick={() => handleRoleSelection("student")}
//             className="w-full bg-blue-500 text-white p-3 mb-2 rounded-lg"
//           >
//             Student
//           </button>
//           <button
//             onClick={() => handleRoleSelection("admin")}
//             className="w-full bg-green-500 text-white p-3 rounded-lg"
//           >
//             Admin
//           </button>
//         </div>
//       ) : (
//         <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
//           <h1 className="text-3xl font-bold mb-6 text-blue-600">
//             {isForgotPassword
//               ? "Reset Password"
//               : isLogin
//               ? "Hello, Welcome back"
//               : "Create a new account"}
//           </h1>

//           <form onSubmit={handleSubmit}>
//             {!isLogin && !isForgotPassword && (
//               <div className="relative mb-4">
//                 <FaUsers className="absolute left-3 top-4 text-gray-400" />
//                 <select
//                   name="userType"
//                   value={formData.userType || userType}
//                   onChange={handleChange}
//                   className="w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none bg-white text-gray-400"
//                   required
//                 >
//                   <option value="" disabled>
//                     Select Role
//                   </option>
//                   <option value="admin" className="text-black">
//                     Admin
//                   </option>
//                   <option value="student" className="text-black">
//                     Student
//                   </option>
//                 </select>
//               </div>
//             )}

//             {!isLogin && !isForgotPassword && (
//               <div className="relative mb-4">
//                 <FaUser className="absolute left-3 top-4 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             )}

//             <div className="relative mb-4">
//               <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div className="relative mb-4">
//               <FaLock className="absolute left-3 top-4 text-gray-400" />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder={isForgotPassword ? "New password" : "Password"}
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
//               />
//             </div>

//             {isForgotPassword && (
//               <div className="relative mb-4">
//                 <FaLock className="absolute left-3 top-4 text-gray-400" />
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             )}

//             {isLogin && !isForgotPassword && (
//               <button
//                 type="button"
//                 className="float-right p-2 text-gray-500 hover:text-blue-600"
//                 onClick={() => setIsForgotPassword(true)}
//               >
//                 Forgot Password?
//               </button>
//             )}

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white p-3 rounded-lg"
//             >
//               {isForgotPassword
//                 ? "Reset Password"
//                 : isLogin
//                 ? "Login"
//                 : "Sign Up"}
//             </button>
//           </form>
//           {isLogin && userType === "admin" && (
//             <p className="text-center mt-4">
//               Not registered?
//               <button
//                 className="text-blue-600 hover:underline ml-1"
//                 onClick={() => setIsLogin(false)}
//               >
//                 Sign Up
//               </button>
//             </p>
//           )}

//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar
//             newestOnTop
//             closeOnClick
//             pauseOnHover
//             draggable
//             theme="colored"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Auth;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaUsers, FaUserTie, FaUserGraduate } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [roleSelected, setRoleSelected] = useState(false);
  const [userType, setUserType] = useState<string>(""); 
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });

  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    setUserType(role); 
    setRoleSelected(true);
    setIsLogin(true);
    setFormData((prev) => ({
      ...prev,
      userType: role, 
    }));
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("🚀 Sending Data:", { ...formData });

    try {
      if (isForgotPassword) {
        await axios.post("http://localhost:5000/api/auth/forgot-password", {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        toast.success("Password changed successfully!");
        navigate("/");
        setIsForgotPassword(false);
      } else if (isLogin) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        const { token, user } = response.data;

        
        if (user.userType !== userType) {
          toast.error("Incorrect role selected. Please check your login role.");
          return;
        }

        localStorage.setItem("token", token);

        
        const username = formData.email.split("@")[0];
        localStorage.setItem("username", username);

        toast.success("Login successful!");

        if (user.userType === "admin") {
          navigate("/dashboard");
        } else if (user.userType === "student") {
          navigate("/studentdashboard");
        }
      } else {
        await axios.post("http://localhost:5000/api/auth/register", {
          ...formData,
          userType: formData.userType || userType,
        });
        toast.success("Sign-up successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error("Error in credentials");
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-6 bg-purple-200 min-h-screen">
      {!roleSelected ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md text-center">
          <div
            onClick={() => handleRoleSelection("student")}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <FaUserGraduate className="mx-auto text-5xl text-[#876bcb] mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Student</h3>
          </div>
          <div
            onClick={() => handleRoleSelection("admin")}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <FaUserTie className="mx-auto text-5xl text-[#876bcb] mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Admin</h3>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-[#876bcb]">
            {isForgotPassword
              ? "Reset Password"
              : isLogin
              ? "Hello, Welcome back"
              : "Create a new account"}
          </h1>

          <form onSubmit={handleSubmit}>
            {!isLogin && !isForgotPassword && (
              <div className="relative mb-4">
                <FaUsers className="absolute left-3 top-4 text-gray-400" />
                <select
                  name="userType"
                  value={formData.userType || userType}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none bg-white text-gray-400"
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="admin" className="text-black">
                    Admin
                  </option>
                  <option value="student" className="text-black">
                    Student
                  </option>
                </select>
              </div>
            )}

            {!isLogin && !isForgotPassword && (
              <div className="relative mb-4">
                <FaUser className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder={isForgotPassword ? "New password" : "Password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
              />
            </div>

            {isForgotPassword && (
              <div className="relative mb-4">
                <FaLock className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {isLogin && !isForgotPassword && (
              <button
                type="button"
                className="float-right p-2 text-gray-500 hover:text-[#876bcb]"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </button>
            )}

            <button
              type="submit"
              className="w-full bg-[#876bcb] text-white p-3 rounded-lg"
            >
              {isForgotPassword
                ? "Reset Password"
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>
          </form>
          {isLogin && userType === "admin" && (
            <p className="text-center mt-4">
              Not registered?
              <button
                className="text-[#876bcb] hover:underline ml-1"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </p>
          )}

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </div>
      )}
    </div>
  );
};

export default Auth;
