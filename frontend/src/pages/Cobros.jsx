import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarCobros } from "../api";

const ESTADO_COLORES = {
  pendiente: "bg-yellow-100 text-yellow-800",
  completado: "bg-green-100 text-green-800",
  fallido: "bg-red-100 text-red-800",
};

export default function Cobros() {
  const [cobros, setCobros] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    try {
      const data = await listarCobros();
      setCobros(data);
    } catch {
      // silenciar error de polling
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    const interval = setInterval(cargar, 10000);
    return () => clearInterval(interval);
  }, []);

  if (cargando) return <p className="text-gray-500">Cargando cobros...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Listado de Cobros</h2>
      {cobros.length === 0 ? (
        <p className="text-gray-500">No hay cobros registrados.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Asunto</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Monto</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cobros.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{c.id}</td>
                  <td className="px-4 py-3 text-sm">{c.subject}</td>
                  <td className="px-4 py-3 text-sm font-mono">${c.monto.toLocaleString("es-CL")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_COLORES[c.estado] || ""}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.fecha_creacion}</td>
                  <td className="px-4 py-3">
                    <Link to={`/cobro/${c.id}`} className="text-indigo-600 hover:underline text-sm">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
