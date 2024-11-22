import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Notes from './pages/Notes';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="notes" element={<Notes />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;