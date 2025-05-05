// import { useState } from "react";
// import { jsPDF } from "jspdf";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Loader } from "lucide-react";
// import profile from "../assets/studentprofile.png";
// import { useNavigate } from "react-router-dom";

// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   education: string;
//   experience: string;
//   skills: string;
//   areaOfInterest: string;
//   project: string;
// }

// export default function ResumeGenerator() {
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     phone: "",
//     education: "",
//     experience: "",
//     skills: "",
//     areaOfInterest: "",
//     project: "",
//   });

//   const [aiSummary, setAiSummary] = useState("");
//   const [loading, setLoading] = useState(false);
// const navigate = useNavigate();
//   const username = localStorage.getItem("username") || "Student";
// const [showDropdown, setShowDropdown] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const generateAIContent = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/generate-resume",
//         {
//           name: formData.name,
//           education: formData.education,
//           experience: formData.experience,
//           skills: formData.skills,
//         }
//       );
//       setAiSummary(response.data.summary);
//     } catch (error: any) {
//       console.error("Error generating AI content:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(22);
//     doc.text(formData.name, 105, 20, { align: "center" });

//     // Contact details
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     doc.text(` ${formData.email}  |   ${formData.phone}`, 105, 30, {
//       align: "center",
//     });

//     let yPosition = 45;
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("PROFILE", 20, yPosition);
//     doc.setFont("helvetica", "normal");
//     yPosition += 10;

//     if (aiSummary) {
//       const splitSummary = doc.splitTextToSize(aiSummary, 170);
//       doc.text(splitSummary, 20, yPosition);
//       yPosition += splitSummary.length * 7 + 5;
//     }

//     const sections = [
//       { title: "WORK EXPERIENCE", content: formData.experience },
//       { title: "EDUCATION", content: formData.education },
//       { title: "SKILLS", content: formData.skills },
//       { title: "AREA OF INTEREST", content: formData.areaOfInterest },
//       { title: "PROJECTS", content: formData.project },
//     ];

//     sections.forEach(({ title, content }) => {
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text(title, 20, yPosition);
//       yPosition += 10;
//       doc.setFontSize(12);
//       doc.setFont("helvetica", "normal");
//       const splitText = doc.splitTextToSize(content, 170);
//       doc.text(splitText, 20, yPosition);
//       yPosition += splitText.length * 7 + 5;
//     });

//     doc.save("resume.pdf");
//   };

//   return (
//     <div className="bg-white min-h-screen w-full">
// {/* Navigation Bar */}
// <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
//   <h1 className="text-white text-2xl font-bold">Student Dashboard</h1>
//   <div className="relative flex items-center">
//     <img
//       src={profile}
//       alt="User"
//       className="w-10 h-10 rounded-full cursor-pointer border-2 border-white ml-4"
//       onClick={() => setShowDropdown(!showDropdown)}
//     />
//     {showDropdown && (
//       <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//         <div className="px-4 py-2 text-left text-gray-700 font-semibold">
//           {username}
//         </div>
//         <button
//           className="block w-full px-4 py-2 text-left hover:bg-gray-200"
//           onClick={() => navigate("/")}
//         >
//           Logout
//         </button>
//       </div>
//     )}
//   </div>
// </nav>

//       <h2 className="text-3xl font-bold text-gray-800 p-5">
//         AI Resume Generator
//       </h2>
//       <div className="p-5 ">
//         <div className="grid grid-cols-2 gap-4">
//           {["name", "email", "phone", "areaOfInterest"].map((name) => (
//             <input
//               key={name}
//               type="text"
//               name={name}
//               placeholder={name.replace(/([A-Z])/g, " $1").trim()}
//               value={formData[name as keyof FormData]}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//             />
//           ))}
//         </div>
//         <div className="mt-4 space-y-4">
//           {["education", "experience", "skills", "project"].map((name) => (
//             <textarea
//               key={name}
//               name={name}
//               placeholder={name.replace(/([A-Z])/g, " $1").trim()}
//               value={formData[name as keyof FormData]}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//             ></textarea>
//           ))}
//         </div>
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={generateAIContent}
//           className="w-xl flex items-center justify-center  mx-auto bg-gradient-to-r from-[#876bcb] to-purple-500 text-white p-3 rounded-lg hover:bg-green-600 mt-4 gap-2"
//           disabled={loading}
//         >
//           {loading ? (
//             <Loader className="animate-spin" />
//           ) : (
//             "Generate AI Resume Content"
//           )}
//         </motion.button>
// {aiSummary && (
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="bg-gray-100 p-4 rounded-lg mt-4 border border-gray-300"
//   >
//     <h3 className="text-lg font-semibold">AI-Generated Summary:</h3>
//     <p className="text-gray-700 mt-2">{aiSummary}</p>
//   </motion.div>
// )}
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={generatePDF}
//           className="w-xl  flex items-center justify-center  mx-auto bg-gradient-to-r from-[#876bcb] to-purple-500 text-white p-3 rounded-lg hover:bg-blue-600 mt-4"
//         >
//           Generate Resume PDF
//         </motion.button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import profile from "../assets/studentprofile.png";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
  areaOfInterest: string;
  project: string;
}

export default function ResumeGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    areaOfInterest: "",
    project: "",
  });
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const generateAIContent = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-resume",
        {
          name: formData.name,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
        }
      );
      setAiSummary(response.data.summary);
    } catch (error) {
      console.error("Error generating AI content:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(formData.name, 20, 20);

    doc.addImage(profile, "PNG", 160, 10, 30, 30);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${formData.email}`, 20, 30);
    doc.text(`${formData.phone}`, 20, 40);

    doc.setDrawColor(0);
    doc.line(20, 55, 190, 55);

    let yPosition = 65;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Career Objective", 20, yPosition);
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    const splitSummary = doc.splitTextToSize(aiSummary, 170);
    doc.text(splitSummary, 20, yPosition);
    yPosition += splitSummary.length * 7 + 5;

    const sections = [
      { title: "Work Experience", content: formData.experience },
      { title: "Education", content: formData.education },
      { title: "Skills", content: formData.skills },
      { title: "Area of Interest", content: formData.areaOfInterest },
      { title: "Projects", content: formData.project },
    ];

    sections.forEach(({ title, content }) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, 25, yPosition, { align: "left" });
      yPosition += splitText.length * 7 + 5;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 5;
    });

    doc.save("resume.pdf");
  };

  return (
    <div className="bg-white min-h-screen w-full ">
      {/* Navigation Bar */}
      <nav className="bg-[#6c4ebd] p-4 w-full flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Student Dashboard</h1>
        <div className="relative flex items-center">
          <img
            src={profile}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white ml-4"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
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
        <h2 className="text-3xl font-bold text-gray-800">
          AI Resume Generator
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {["name", "email", "phone", "areaOfInterest"].map((name) => (
            <input
              key={name}
              type="text"
              name={name}
              placeholder={name.replace(/([A-Z])/g, " $1").trim()}
              value={formData[name as keyof FormData]}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            />
          ))}
        </div>
        <div className="mt-4 space-y-4">
          {["education", "experience", "skills", "project"].map((name) => (
            <textarea
              key={name}
              name={name}
              placeholder={name.replace(/([A-Z])/g, " $1").trim()}
              value={formData[name as keyof FormData]}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            ></textarea>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={generateAIContent}
          className="w-xl flex items-center justify-center  mx-auto bg-gradient-to-r from-[#876bcb] to-purple-500 text-white p-3 rounded-lg hover:bg-green-600 mt-4 gap-2"
          disabled={loading}
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            "Generate AI Resume Content"
          )}
        </motion.button>
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-100 p-4 rounded-lg mt-4 border border-gray-300"
          >
            <h3 className="text-lg font-semibold">AI-Generated Summary:</h3>
            <p className="text-gray-700 mt-2">{aiSummary}</p>
          </motion.div>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={generatePDF}
          className="w-xl  flex items-center justify-center  mx-auto bg-gradient-to-r from-[#876bcb] to-purple-500 text-white  p-3 rounded-lg mt-4"
        >
          Generate Resume PDF
        </motion.button>
      </div>
    </div>
  );
}
