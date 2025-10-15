import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <aside className="h-screen w-64 bg-green-950 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-green-700">
        Biblioteca
      </div>
      <nav className="flex-1 p-4 space-y-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-green-700"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/autores")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-green-700"
        >
          Autores
        </button>
        <button
          onClick={() => navigate("/libros")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-green-700"
        >
          Libros
        </button>
      </nav>
      <div className="p-4 border-t border-green-700">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded bg-gray-900 hover:bg-green-700"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
