import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, StickyNote, Bell, Smile } from 'lucide-react';
import NoteModal from '../components/modals/NoteModal';
import { Note } from '../types';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAtCVsaDSIovTVd7551lsO2OaL5goPvz0g",
  authDomain: "aphixis-32273.firebaseapp.com",
  projectId: "aphixis-32273",
  storageBucket: "aphixis-32273.firebasestorage.app",
  messagingSenderId: "211828562391",
  appId: "1:211828562391:web:af8091e84727d569191392"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  const fetchNotes = useCallback(async () => {
    try {
      const notesCollection = collection(db, 'notes');
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesList);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      if (selectedNote) {
        const noteRef = doc(db, 'notes', selectedNote.id);
        await updateDoc(noteRef, noteData);
        setNotes(notes.map(note =>
          note.id === selectedNote.id ? { ...note, ...noteData } : note
        ));
      } else {
        const newNote = {
          ...noteData,
          createdAt: new Date().toISOString().split('T')[0]
        } as Note;
        const docRef = await addDoc(collection(db, 'notes'), newNote);
        setNotes([{ id: docRef.id, ...newNote }, ...notes]);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
      try {
        const noteRef = doc(db, 'notes', noteId);
        await deleteDoc(noteRef);
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="h-6 w-6 text-blue-500" />;
      case 'motivation':
        return <Smile className="h-6 w-6 text-yellow-500" />;
      default:
        return <StickyNote className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleNewNote = () => {
    setSelectedNote(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Mis Notas</h1>
        <button
          onClick={handleNewNote}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Nueva Nota
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No hay notas disponibles.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-3xl shadow-lg transition-all border border-gray-200 bg-gradient-to-br from-gray-100/90 to-gray-50/70 backdrop-blur-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getIcon(note.type)}
                  <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                </div>
                <span className="text-sm text-gray-500">{note.createdAt}</span>
              </div>
              <p className="text-gray-600">{note.content}</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        note={selectedNote}
      />
    </div>
  );
};

export default Notes;
