import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Note } from '../../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  note?: Note;
}

export default function NoteModal({ isOpen, onClose, onSubmit, note }: NoteModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note' as Note['type'],
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        type: note.type,
      });
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {note ? 'Editar Nota' : 'Nueva Nota'}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              className="input mt-1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contenido</label>
            <textarea
              className="input mt-1"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              className="input mt-1"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Note['type'] })}
              required
            >
              <option value="note">Nota</option>
              <option value="reminder">Recordatorio</option>
              <option value="motivation">Motivación</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {note ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}