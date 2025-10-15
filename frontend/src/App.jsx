import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./componentes/pages/Login";
import Dashboard from "./componentes/pages/Dashboard";
import Autores from "./componentes/pages/Autores";
import Libros from "./componentes/pages/Libros";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/autores" element={<Autores/>} />
        <Route path="/libros" element={<Libros/>} />
      </Routes>
    </Router>
  );
}

export default App;
