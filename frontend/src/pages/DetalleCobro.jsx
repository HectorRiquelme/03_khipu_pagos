import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerCobro } from "../api";

const ESTADO_COLORES = {
  pendiente: "bg-yellow-100 text-yellow-800",
  completado: "bg-green-100 text-green-800",
  fallido: "bg-red-100 text-red-800",
};

export default function DetalleCobro() {
  const { id } = useParams();
  const [cobro, setCobro] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const data = await obtenerCobro(id);
      setCobro(data);
    } catch {
      setError("No se pudo obtener el cobro");
    }
  };

  useEffect(() => {
    cargar();
    const interval = setInterval(cargar, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!cobro) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <Link to="/cobros" className="text-indigo-600 hover:underline text-sm">&larr; Volver al listado</Link>
      <h2 className="text-2xl font-bold mt-4 mb-6">Detalle del Cobro #{cobro.id}</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Asunto</span>
          <span className="font-medium">{cobro.subject}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Monto</span>
          <span className="font-mono font-medium">${cobro.monto.toLocaleString("es-CL")} CLP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Estado</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_COLORES[cobro.estado] || ""}`}>
            {cobro.estado}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment ID</span>
          <span className="text-sm font-mono">{cobro.payment_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Creado</span>
          <span className="text-sm">{cobro.fecha_creacion}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Actualizado</span>
          <span className="text-sm">{cobro.fecha_actualizacion}</span>
        </div>
        {cobro.payment_url && cobro.estado === "pendiente" && (
          <a
            href={cobro.payment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Ir a pagar en Khipu
          </a>
        )}
      </div>
    </div>
  );
}
