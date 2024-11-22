import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  StickyNote,
  LogOut,
} from 'lucide-react';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-semibold text-gray-800">Áphixis</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5" />
                Estudiantes
              </NavLink>
              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <ClipboardCheck className="mr-3 h-5 w-5" />
                Asistencias
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <StickyNote className="mr-3 h-5 w-5" />
                Notas
              </NavLink>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}