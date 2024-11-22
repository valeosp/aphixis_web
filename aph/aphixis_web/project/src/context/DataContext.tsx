import React, { createContext, useContext, useState } from 'react';
import { Student, Attendance, Note } from '../types';
import { format } from 'date-fns';

interface DataContextType {
  students: Student[];
  attendance: Attendance[];
  notes: Note[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  deleteAttendance: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Ana García', email: 'ana@example.com', course: 'Ingeniería', enrollmentDate: '2024-01-15' },
    { id: '2', name: 'Carlos López', email: 'carlos@example.com', course: 'Medicina', enrollmentDate: '2024-01-16' },
  ]);

  const [attendance, setAttendance] = useState<Attendance[]>([
    { id: '1', studentId: '1', date: '2024-03-18', time: '08:00', status: 'present' },
    { id: '2', studentId: '2', date: '2024-03-18', time: '08:15', status: 'absent' },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { 
      id: '1', 
      title: 'Reunión de profesores', 
      content: 'Recordar agenda para la reunión del lunes', 
      type: 'reminder', 
      createdAt: '2024-03-18' 
    },
    { 
      id: '2', 
      title: 'Mensaje motivacional', 
      content: '¡El éxito es la suma de pequeños esfuerzos repetidos día tras día!', 
      type: 'motivation', 
      createdAt: '2024-03-17' 
    },
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: generateId() };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, ...updatedFields } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    setAttendance(attendance.filter(record => record.studentId !== id));
  };

  const addAttendance = (attendanceRecord: Omit<Attendance, 'id'>) => {
    const newAttendance = { 
      ...attendanceRecord, 
      id: generateId(),
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm')
    };
    setAttendance([...attendance, newAttendance]);
  };

  const updateAttendance = (id: string, updatedFields: Partial<Attendance>) => {
    setAttendance(attendance.map(record => 
      record.id === id ? { ...record, ...updatedFields } : record
    ));
  };

  const deleteAttendance = (id: string) => {
    setAttendance(attendance.filter(record => record.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote = { 
      ...note, 
      id: generateId(),
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, updatedFields: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updatedFields } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <DataContext.Provider value={{
      students,
      attendance,
      notes,
      addStudent,
      updateStudent,
      deleteStudent,
      addAttendance,
      updateAttendance,
      deleteAttendance,
      addNote,
      updateNote,
      deleteNote,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};