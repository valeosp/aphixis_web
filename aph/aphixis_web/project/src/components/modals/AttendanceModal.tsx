import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attendance: Omit<Attendance, 'id'>) => void;
  attendanceRecord?: Attendance;
}

export default function AttendanceModal({ isOpen, onClose, onSubmit, attendanceRecord }: AttendanceModalProps) {
  const [formData, setFormData] = useState<Omit<Attendance, 'id'>>({
    studentId: '',
    studentName: '',
    date: '',
    time: '',
    status: 'present',
  });

  useEffect(() => {
    if (attendanceRecord) {
      const { id, ...rest } = attendanceRecord;
      setFormData(rest);
    } else {
      setFormData({
        studentId: '',
        studentName: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        status: 'present',
      });
    }
  }, [attendanceRecord, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        aria-hidden="true"
        style={{ position: 'fixed', margin: 0 }}
      />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {attendanceRecord ? 'Editar Asistencia' : 'Registrar Asistencia'}
            </h2>
            <button 
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full p-1"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">ID Estudiante</label>
              <input
                id="studentId"
                type="text"
                className="input mt-1"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Nombre del Estudiante</label>
              <input
                id="studentName"
                type="text"
                className="input mt-1"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                id="date"
                type="date"
                className="input mt-1"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora</label>
              <input
                id="time"
                type="time"
                className="input mt-1"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                id="status"
                className="input mt-1"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'present' | 'absent' })}
                required
              >
                <option value="present">Presente</option>
                <option value="absent">Ausente</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {attendanceRecord ? 'Actualizar' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}