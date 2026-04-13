const BASE = "/api";

export async function crearCobro(data) {
  const res = await fetch(`${BASE}/cobro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear cobro");
  return res.json();
}

export async function listarCobros() {
  const res = await fetch(`${BASE}/cobros`);
  if (!res.ok) throw new Error("Error al listar cobros");
  return res.json();
}

export async function obtenerCobro(id) {
  const res = await fetch(`${BASE}/cobro/${id}`);
  if (!res.ok) throw new Error("Error al obtener cobro");
  return res.json();
}
