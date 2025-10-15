import { useState, useEffect } from "react";
import Sidebar from "../layouts/nav";
import { api } from "../../lib/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalAutores: 0,
    totalLibros: 0,
    totalEjemplares: 0
  });
  const [recentLibros, setRecentLibros] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentLibros();
  }, []);

  const fetchStats = async () => {
    try {
      const [autoresRes, librosRes] = await Promise.all([
        api.get("/api/autores/"),
        api.get("/api/libros/")
      ]);

      const totalEjemplares = librosRes.data.reduce((sum, libro) => sum + (libro.numero_ejemplares || 0), 0);

      setStats({
        totalAutores: autoresRes.data.length,
        totalLibros: librosRes.data.length,
        totalEjemplares: totalEjemplares
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const fetchRecentLibros = async () => {
    try {
      const response = await api.get("/api/libros/");
      // Mostrar los últimos 5 libros
      setRecentLibros(response.data.slice(-5).reverse());
    } catch (error) {
      console.error("Error al cargar libros recientes:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Barra lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido al Panel de Biblioteca 📚
          </h1>
          <p className="text-gray-600">
            Gestiona tu biblioteca de manera eficiente
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Autores</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAutores}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Libros</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalLibros}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ejemplares</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEjemplares}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Libros Recientes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Libros Recientes</h2>
          </div>
          <div className="p-6">
            {recentLibros.length > 0 ? (
              <div className="space-y-4">
                {recentLibros.map((libro) => (
                  <div key={libro.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{libro.titulo}</h3>
                      <p className="text-sm text-gray-600">
                        {libro.categoria && `Categoría: ${libro.categoria}`}
                        {libro.anio_publicacion && ` • Año: ${libro.anio_publicacion}`}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {libro.numero_ejemplares} ejemplar{libro.numero_ejemplares !== 1 ? 'es' : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay libros registrados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
