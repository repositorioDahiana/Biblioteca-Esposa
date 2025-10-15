import { useState, useEffect } from "react";
import Sidebar from "../layouts/nav";
import { api, createFormData, getMediaUrl } from "../../lib/api";

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [editingLibro, setEditingLibro] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    anio_publicacion: "",
    isbn: "",
    categoria: "",
    idioma: "",
    numero_ejemplares: 1,
    genero: "",
    numero_paginas: "",
    sinopsis: "",
    serie: "",
    portadaFile: null,
    pdfFile: null,
  });
  const [previewPortada, setPreviewPortada] = useState("");
  const [downloadPdfUrl, setDownloadPdfUrl] = useState("");
  const [query, setQuery] = useState("");

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchLibros();
    fetchAutores();
  }, []);

  const fetchLibros = async () => {
    try {
      const response = await api.get("/api/libros/");
      setLibros(response.data);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

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
        portada: formData.portadaFile || undefined,
        archivo_pdf: formData.pdfFile || undefined,
      });
      if (editingLibro) {
        // Actualizar libro existente
        await api.put(`/api/libros/${editingLibro.id}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Libro actualizado correctamente");
      } else {
        // Crear nuevo libro
        await api.post("/api/libros/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Libro creado correctamente");
      }
      
      // Limpiar formulario y recargar lista
      resetForm();
      fetchLibros();
    } catch (error) {
      console.error("Error al guardar libro:", error);
      alert("Error al guardar el libro");
    }
  };

  const handleEdit = (libro) => {
    setEditingLibro(libro);
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      editorial: libro.editorial,
      anio_publicacion: libro.anio_publicacion || "",
      isbn: libro.isbn,
      categoria: libro.categoria,
      idioma: libro.idioma,
      numero_ejemplares: libro.numero_ejemplares,
      genero: libro.genero,
      numero_paginas: libro.numero_paginas || "",
      sinopsis: libro.sinopsis || "",
      serie: libro.serie || "",
      portadaFile: null,
      pdfFile: null,
    });
    setPreviewPortada(libro.portada_url || libro.portada ? (libro.portada_url || getMediaUrl(libro.portada)) : "");
    setDownloadPdfUrl(libro.archivo_pdf_url || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este libro?")) {
      try {
        await api.delete(`/api/libros/${id}/`);
        alert("Libro eliminado correctamente");
        fetchLibros();
      } catch (error) {
        console.error("Error al eliminar libro:", error);
        alert("Error al eliminar el libro");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      autor: "",
      editorial: "",
      anio_publicacion: "",
      isbn: "",
      categoria: "",
      idioma: "",
      numero_ejemplares: 1,
      genero: "",
      numero_paginas: "",
      sinopsis: "",
      serie: "",
      portadaFile: null,
      pdfFile: null,
    });
    setEditingLibro(null);
    setShowForm(false);
    setPreviewPortada("");
    setDownloadPdfUrl("");
  };

  const librosFiltrados = libros.filter(l => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return (
      (l.titulo || "").toLowerCase().includes(term) ||
      (l.categoria || "").toLowerCase().includes(term) ||
      (l.isbn || "").toLowerCase().includes(term)
    );
  });

  const getAutorNombre = (autorId) => {
    const autor = autores.find(a => a.id === autorId);
    return autor ? `${autor.nombre} ${autor.apellido}` : "Autor no encontrado";
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Libros</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {showForm ? "Ver Lista" : "Agregar Libro"}
          </button>
        </div>

        {!showForm && (
          <div className="mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, categoría o ISBN"
              className="w-full md:w-96 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingLibro ? "Editar Libro" : "Agregar Nuevo Libro"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Título del libro"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autor *
                  </label>
                  <select
                    name="autor"
                    value={formData.autor}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un autor</option>
                    {autores.map((autor) => (
                      <option key={autor.id} value={autor.id}>
                        {autor.nombre} {autor.apellido}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Editorial
                  </label>
                  <input
                    type="text"
                    name="editorial"
                    value={formData.editorial}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Editorial"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año de Publicación
                  </label>
                  <input
                    type="number"
                    name="anio_publicacion"
                    value={formData.anio_publicacion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Año"
                    min="1000"
                    max="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ISBN"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Categoría"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idioma
                  </label>
                  <input
                    type="text"
                    name="idioma"
                    value={formData.idioma}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Idioma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <input
                    type="text"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Género"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Ejemplares
                  </label>
                  <input
                    type="number"
                    name="numero_ejemplares"
                    value={formData.numero_ejemplares}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Páginas
                  </label>
                  <input
                    type="number"
                    name="numero_paginas"
                    value={formData.numero_paginas}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Páginas"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serie
                  </label>
                  <input
                    type="text"
                    name="serie"
                    value={formData.serie}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Serie"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portada (imagen)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData(prev => ({ ...prev, portadaFile: file }));
                      if (file) setPreviewPortada(URL.createObjectURL(file));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {previewPortada && (
                    <div className="mt-3">
                      <img src={previewPortada} alt="Vista previa" className="h-24 w-24 rounded object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Archivo PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData(prev => ({ ...prev, pdfFile: file }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {downloadPdfUrl && !formData.pdfFile && (
                    <div className="mt-3">
                      <a
                        href={downloadPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Descargar PDF actual
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinopsis
                </label>
                <textarea
                  name="sinopsis"
                  value={formData.sinopsis}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Sinopsis del libro"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  {editingLibro ? "Actualizar" : "Guardar"} Libro
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
              <h2 className="text-xl font-semibold text-gray-800">Lista de Libros</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Portada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Editorial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Año
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ejemplares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {librosFiltrados.map((libro) => (
                    <tr key={libro.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {libro.portada_url || libro.portada ? (
                          <img
                            src={libro.portada_url || getMediaUrl(libro.portada)}
                            alt={libro.titulo}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {libro.titulo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {libro.categoria && `Categoría: ${libro.categoria}`}
                          {libro.archivo_pdf_url && (
                            <>
                              {" "}•{" "}
                              <a
                                href={libro.archivo_pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-600 hover:underline"
                              >
                                Descargar PDF
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getAutorNombre(libro.autor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {libro.editorial || "No especificada"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {libro.anio_publicacion || "No especificado"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {libro.numero_ejemplares}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(libro)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(libro.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {librosFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay libros registrados
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
