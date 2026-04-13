import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CrearCobro from "./pages/CrearCobro";
import Cobros from "./pages/Cobros";
import DetalleCobro from "./pages/DetalleCobro";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-indigo-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <h1 className="text-xl font-bold">Khipu Pagos</h1>
          <Link to="/" className="hover:underline">
            Crear Cobro
          </Link>
          <Link to="/cobros" className="hover:underline">
            Listado
          </Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<CrearCobro />} />
          <Route path="/cobros" element={<Cobros />} />
          <Route path="/cobro/:id" element={<DetalleCobro />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
