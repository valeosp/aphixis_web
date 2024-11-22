import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import StudentModal from '../components/modals/StudentModal';

const firebaseConfig = {
  apiKey: "AIzaSyAtCVsaDSIovTVd7551lsO2OaL5goPvz0g",
  authDomain: "aphixis-32273.firebaseapp.com",
  projectId: "aphixis-32273",
  storageBucket: "aphixis-32273.firebasestorage.app",
  messagingSenderId: "211828562391",
  appId: "1:211828562391:web:af8091e84727d569191392",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facultad: '',
    enrollmentDate: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtrar estudiantes cuando cambie la búsqueda o la lista de estudiantes
  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.facultad.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  // Fetch all students
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
      setFilteredStudents(studentsList);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update a student
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await updateDoc(doc(db, "students", editingStudent.id), formData);
      } else {
        await addDoc(collection(db, "students"), {
          ...formData,
          enrollmentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0],
        });
      }
      fetchStudents();
      closeDialog();
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
    }
  };

  // Delete a student
  const handleDeleteStudent = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
      try {
        await deleteDoc(doc(db, "students", id));
        fetchStudents();
      } catch (error) {
        console.error("Error al eliminar estudiante:", error);
      }
    }
  };

  // Open dialog for editing or creating
  const openDialog = (student = null) => {
    setEditingStudent(student);
    setFormData(
      student || { name: '', email: '', facultad: '', enrollmentDate: '' }
    );
    setIsDialogOpen(true);
  };

  // Close dialog and reset data
  const closeDialog = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', facultad: '', enrollmentDate: '' });
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Estudiantes</h1>
        <button 
          onClick={() => openDialog()} 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Estudiante
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar estudiante..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Nombre", "Email", "Facultad", "Fecha de Inscripción", "Acciones"].map((header) => (
                  <th 
                    key={header} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.facultad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.enrollmentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openDialog(student)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        aria-hidden="true"
        style={{ position: 'fixed', margin: 0 }}>
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-6 relative">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-4 right-6 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            
            <DialogHeader className="text-center mb-4">
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                {editingStudent ? "Editar Estudiante" : "Nuevo Estudiante"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveStudent} className="space-y-4">
              {["name", "email", "facultad", "enrollmentDate"].map((field) => (
                <div key={field}>
                  <Label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field === "name"
                      ? "Nombre del Estudiante"
                      : field === "email"
                      ? "Correo Electrónico"
                      : field === "facultad"
                      ? "Facultad"
                      : "Fecha de Inscripción"}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    type={field === "enrollmentDate" ? "date" : "text"}
                    className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-100"
                    value={formData[field]}
                    onChange={handleInputChange}
                    required={field !== "enrollmentDate"}
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cerrar
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {editingStudent ? "Actualizar" : "Registrar"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}