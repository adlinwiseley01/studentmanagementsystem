import { useState, useEffect } from "react";
import axios from "axios";
import { DownloadCloud } from "lucide-react";
import profile from "../assets/studentprofile.png";
import { useNavigate } from "react-router-dom";

interface Note {
  _id: string;
  semester: string;
  courseName: string;
  fileUrl: string;
}

const StudentNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    let filtered = notes;
    if (selectedSemester) {
      filtered = filtered.filter((note) => note.semester === selectedSemester);
    }
    if (searchTerm) {
      filtered = filtered.filter((note) =>
        note.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredNotes(filtered);
  }, [selectedSemester, searchTerm, notes]);

  const handleDownload = async (fileUrl: string, fileName: string) => {
    console.log("Downloading file from:", fileUrl); // 🔥 Debugging Log

    try {
      const response = await axios.get(fileUrl, { responseType: "blob" });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <nav className="bg-[#6c4ebd] p-4 flex justify-between items-center w-full">
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
        <h1 className="text-3xl font-bold text-gray-800">Student Notes</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 w-full mt-5">
          <select
            className="p-3 border border-gray-300 rounded-lg w-full text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {[...new Set(notes.map((note) => note.semester))].map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search course..."
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Notes List */}
        {filteredNotes.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white border border-gray-200 shadow-md rounded-lg p-5 flex flex-col justify-between transform hover:scale-105 transition-transform"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {note.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">📅 {note.semester}</p>
                </div>
                <button
                  onClick={() =>
                    handleDownload(note.fileUrl, `${note.courseName}.pdf`)
                  }
                  className="mt-4 flex items-center justify-center bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                  <DownloadCloud className="mr-2" /> Download Notes
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-md mt-6">⚠️ No notes available.</p>
        )}
      </div>
    </div>
  );
};

export default StudentNotes;
