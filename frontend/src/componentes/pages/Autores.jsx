import { useState, useEffect } from "react";
import Sidebar from "../layouts/nav";
import { api, createFormData, getMediaUrl } from "../../lib/api";

export default function Autores() {
  const [autores, setAutores] = useState([]);
  const [editingAutor, setEditingAutor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nacionalidad: "",
    fecha_nacimiento: "",
    biografia: "",
    fotoFile: null,
  });
  const [previewFoto, setPreviewFoto] = useState("");
  const [query, setQuery] = useState("");

  // Cargar autores al montar el componente
  useEffect(() => {
    fetchAutores();
  }, []);

  const fetchAutores = async () => {
    try {
      const response = await api.get("/api/autores/");
      setAutores(response.data);
    } catch (error) {
      console.error("Error al cargar autores:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = createFormData({
        ...formData,
        // La clave 'foto' debe coincidir con el nombre del campo en el backend
        foto: formData.fotoFile || undefined,
      });
      if (editingAutor) {
        // Actualizar autor existente
        await api.put(`/api/autores/${editingAutor.id}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Autor actualizado correctamente");
      } else {
        // Crear nuevo autor
        await api.post("/api/autores/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Autor creado correctamente");
      }
      
      // Limpiar formulario y recargar lista
      resetForm();
      fetchAutores();
    } catch (error) {
      console.error("Error al guardar autor:", error);
      alert("Error al guardar el autor");
    }
  };

  const handleEdit = (autor) => {
    setEditingAutor(autor);
    setFormData({
      nombre: autor.nombre,
      apellido: autor.apellido,
      nacionalidad: autor.nacionalidad,
      fecha_nacimiento: autor.fecha_nacimiento || "",
      biografia: autor.biografia || "",
      fotoFile: null,
    });
    setPreviewFoto(autor.foto_url || autor.foto ? (autor.foto_url || getMediaUrl(autor.foto)) : "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este autor?")) {
      try {
        await api.delete(`/api/autores/${id}/`);
        alert("Autor eliminado correctamente");
        fetchAutores();
      } catch (error) {
        console.error("Error al eliminar autor:", error);
        alert("Error al eliminar el autor");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      nacionalidad: "",
      fecha_nacimiento: "",
      biografia: "",
      fotoFile: null,
    });
    setEditingAutor(null);
    setShowForm(false);
    setPreviewFoto("");
  };

  const autoresFiltrados = autores.filter(a => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return (
      (a.nombre || "").toLowerCase().includes(term) ||
      (a.apellido || "").toLowerCase().includes(term) ||
      (a.nacionalidad || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Autores</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? "Ver Lista" : "Agregar Autor"}
          </button>
        </div>

        {!showForm && (
          <div className="mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, apellido o nacionalidad"
              className="w-full md:w-96 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingAutor ? "Editar Autor" : "Agregar Nuevo Autor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del autor"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Apellido del autor"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nacionalidad
                  </label>
                  <input
                    type="text"
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nacionalidad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto del Autor
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData(prev => ({ ...prev, fotoFile: file }));
                    if (file) {
                      setPreviewFoto(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {previewFoto && (
                  <div className="mt-3">
                    <img src={previewFoto} alt="Vista previa" className="h-24 w-24 rounded object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografía
                </label>
                <textarea
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Biografía del autor"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  {editingAutor ? "Actualizar" : "Guardar"} Autor
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Lista de Autores</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nacionalidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Nacimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {autoresFiltrados.map((autor) => (
                    <tr key={autor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {autor.foto_url || autor.foto ? (
                          <img
                            src={autor.foto_url || getMediaUrl(autor.foto)}
                            alt={`${autor.nombre} ${autor.apellido}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {autor.nombre} {autor.apellido}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {autor.nacionalidad || "No especificada"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {autor.fecha_nacimiento || "No especificada"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(autor)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(autor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {autoresFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay autores registrados
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
