import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import AttendanceModal from '../components/modals/AttendanceModal';
import {
  initializeApp
} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtCVsaDSIovTVd7551lsO2OaL5goPvz0g",
  authDomain: "aphixis-32273.firebaseapp.com",
  projectId: "aphixis-32273",
  storageBucket: "aphixis-32273.firebasestorage.app",
  messagingSenderId: "211828562391",
  appId: "1:211828562391:web:af8091e84727d569191392"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Attendance | undefined>(undefined);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    const fetchAttendance = async () => {
      const querySnapshot = await getDocs(collection(db, "attendanceRecords"));
      const records = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Attendance[];
      setAttendanceRecords(records);
    };

    fetchAttendance();
  }, []);

  const handleNewAttendance = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Attendance) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      await deleteDoc(doc(db, "attendanceRecords", id));
      setAttendanceRecords(records => records.filter(record => record.id !== id));
    }
  };

  const handleSubmit = async (attendanceData: Omit<Attendance, 'id'>) => {
    if (selectedRecord) {
      await updateDoc(doc(db, "attendanceRecords", selectedRecord.id), attendanceData);
      setAttendanceRecords(records =>
        records.map(record =>
          record.id === selectedRecord.id
            ? { ...attendanceData, id: record.id }
            : record
        )
      );
    } else {
      const docRef = await addDoc(collection(db, "attendanceRecords"), attendanceData);
      setAttendanceRecords(records => [...records, { ...attendanceData, id: docRef.id }]);
    }
  };

  const filterRecords = () => {
    const currentDate = new Date();
    return attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      switch (timeFilter) {
        case 'week': {
          const weekAgo = new Date(currentDate);
          weekAgo.setDate(currentDate.getDate() - 7);
          return recordDate >= weekAgo && recordDate <= currentDate;
        }
        case 'month': {
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          return recordDate >= startOfMonth && recordDate <= currentDate;
        }
        case 'year': {
          const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
          return recordDate >= startOfYear && recordDate <= currentDate;
        }
        default:
          return true;
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Historial de Asistencia</h1>
        <div className="flex space-x-4">
          <select
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as 'week' | 'month' | 'year')}
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="year">Este Año</option>
          </select>
          <button
            onClick={handleNewAttendance}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Registrar Asistencia
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterRecords().map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'present' ? 'Presente' : 'Ausente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
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

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        attendanceRecord={selectedRecord}
      />
    </div>
  );
}
