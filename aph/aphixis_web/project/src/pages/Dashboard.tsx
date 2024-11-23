import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtCVsaDSIovTVd7551lsO2OaL5goPvz0g",
  authDomain: "aphixis-32273.firebaseapp.com",
  projectId: "aphixis-32273",
  storageBucket: "aphixis-32273.firebasestorage.app",
  messagingSenderId: "211828562391",
  appId: "1:211828562391:web:af8091e84727d569191392",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

export default function Dashboard() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [dailyTrends, setDailyTrends] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [presentCount, setPresentCount] = useState(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      const querySnapshot = await getDocs(collection(db, "attendanceRecords"));
      const records = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const present = records.filter((rec) => rec.status === "present").length;
      const absent = records.length - present;

      // Preparar datos para la distribución de asistencias
      setDistributionData([
        { name: "Presente", value: present },
        { name: "Ausente", value: absent },
      ]);

      // Preparar datos para la tendencia mensual
      const monthlyData = records.reduce((acc, record) => {
        const month = new Date(record.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      setMonthlyTrends(
        Object.entries(monthlyData).map(([month, count]) => ({
          name: month,
          count,
        }))
      );

      // Preparar datos para la tendencia diaria
      const dailyData = records.reduce((acc, record) => {
        const date = new Date(record.date).toISOString().slice(0, 10);
        acc[date] = acc[date] || { date, present: 0, absent: 0 };
        acc[date][record.status]++;
        return acc;
      }, {});

      setDailyTrends(Object.values(dailyData));

      setAttendanceRecords(records);
      setTotalRecords(records.length);
      setPresentCount(present);
    };

    fetchAttendance();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Dashboard de Asistencia</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards */}
        <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
          <Calendar className="h-10 w-10 text-indigo-600" />
          <div>
            <p className="text-gray-500">Total de Registros</p>
            <p className="text-xl font-semibold text-gray-900">{totalRecords}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
          <Users className="h-10 w-10 text-green-500" />
          <div>
            <p className="text-gray-500">Asistencias</p>
            <p className="text-xl font-semibold text-gray-900">{presentCount}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
          <TrendingUp className="h-10 w-10 text-yellow-500" />
          <div>
            <p className="text-gray-500">Tasa de Presencia</p>
            <p className="text-xl font-semibold text-gray-900">
              {((presentCount / totalRecords) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos Estilo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Asistencias</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencias Mensuales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico Diario */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencias Diarias</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="present" stroke="#10B981" name="Presentes" />
            <Line type="monotone" dataKey="absent" stroke="#EF4444" name="Ausentes" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
