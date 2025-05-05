import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2, X, PlusCircle } from "lucide-react";
import { Student } from "../user";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

interface AddstudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const Addstudents = ({ students, setStudents }: AddstudentsProps) => {
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/addstudents");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addOrUpdateStudent = async () => {
    if (!name.trim()) {
      toast.error("Please enter a student name!");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`http://localhost:5000/api/addstudents/${editingId}`, {
          name,
        });
        toast.success("Student updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/addstudents", { name });
        toast.success("Student added successfully!");
      }
      setName("");
      setIsModalOpen(false);
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student.");
    } finally {
      setLoading(false);
    }
  };

  const editStudent = (student: Student) => {
    setName(student.name);
    setEditingId(student._id ? String(student._id) : null);
    setIsModalOpen(true);
  };
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };
  const deleteStudent = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:5000/api/addstudents/${deleteId}`);
      toast.success("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student.");
    }
    setShowDeletePopup(false);
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
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800"> Add Student</h1>
            <button
              className="bg-gradient-to-r from-[#876bcb] to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-[#7250b5] transition"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle size={20} />
              Add Student
            </button>
          </div>

          {students.length > 0 ? (
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f3e8ff] text-gray-800">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={String(student._id)}
                    className={`transition hover:bg-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="border-b border-gray-300 px-4 py-3 text-center text-gray-700">
                      {student.name}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() => editStudent(student)}
                        className="text-blue-500 hover:text-blue-700 mx-2"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => confirmDelete(String(student._id))}
                        className="text-red-500 hover:text-red-700 mx-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center mt-4">
              No students added yet.
            </p>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-slide-up">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {editingId ? "Edit Student" : "Add New Student"}
              </h2>
              <input
                type="text"
                placeholder="Enter Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full mb-4 focus:ring-2 focus:ring-[#876bcb] focus:outline-none"
              />
              <div className="flex justify-end gap-4">
                <button
                  className="bg-[#876bcb] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#7250b5] transition"
                  onClick={addOrUpdateStudent}
                  disabled={loading}
                >
                  {loading
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                    ? "Update Student"
                    : "Add Student"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-slide-up">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this student?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
                  onClick={deleteStudent}
                >
                  Yes,Delete
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default Addstudents;
