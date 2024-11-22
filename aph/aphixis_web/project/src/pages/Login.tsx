import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  // Generate random bubbles
  const renderBubbles = () => {
    const bubbles = [];
    for (let i = 0; i < 50; i++) {
      bubbles.push(
        <div 
          key={i} 
          className="absolute rounded-full bubble"
          style={{
            width: `${Math.random() * 50 + 10}px`,
            height: `${Math.random() * 50 + 10}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random()
          }}
        />
      );
    }
    return bubbles;
  };

  return (
    <div className="relative min-h-screen bg-blue-500 overflow-hidden">
      {/* Bubble Background */}
      <div className="absolute inset-0 bubble-container">
        {renderBubbles()}
      </div>

      {/* Login Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-white/90 p-10 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Áphixis</h2>
            <p className="mt-2 text-sm text-gray-600">Sistema de Gestión de Asistencia</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>

      {/* Custom styles for bubbles */}
      <style jsx>{`
        .bubble-container {
          z-index: 1;
          pointer-events: none;
        }

        .bubble {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite alternate;
        }

        @keyframes float {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100vh);
          }
        }
      `}</style>
    </div>
  );
}