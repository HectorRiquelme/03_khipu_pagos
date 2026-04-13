import { useState } from "react";
import { crearCobro } from "../api";

export default function CrearCobro() {
  const [subject, setSubject] = useState("");
  const [monto, setMonto] = useState("");
  const [body, setBody] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);
    setCargando(true);
    try {
      const res = await crearCobro({
        subject,
        monto: parseInt(monto),
        body,
      });
      setResultado(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Crear Cobro</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Pago de servicio"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto (CLP)</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            min="1"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 5000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion (opcional)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="Detalle adicional del cobro"
          />
        </div>
        <button
          type="submit"
          disabled={cargando}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {cargando ? "Creando..." : "Crear Cobro"}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-lg">
          {error}
        </div>
      )}

      {resultado && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded max-w-lg">
          <p className="font-semibold">Cobro creado exitosamente</p>
          <p className="text-sm mt-1">ID: {resultado.id} | Payment ID: {resultado.payment_id}</p>
          <a
            href={resultado.payment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700"
          >
            Ir a pagar en Khipu
          </a>
        </div>
      )}
    </div>
  );
}
