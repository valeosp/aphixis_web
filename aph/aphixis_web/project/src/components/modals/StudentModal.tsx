import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Student } from '../../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  student?: Student;
}

export default function StudentModal({ isOpen, onClose, onSubmit, student }: StudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    enrollmentDate: '',
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {student ? 'Editar Estudiante' : 'Nuevo Estudiante'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="input mt-1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="input mt-1"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="facultad" className="block text-sm font-medium text-gray-700">Curso</label>
            <input
              type="text"
              className="input mt-1"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700">Fecha de Inscripción</label>
            <input
              type="date"
              className="input mt-1"
              value={formData.enrollmentDate}
              onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
              required
            />
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
              {student ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}