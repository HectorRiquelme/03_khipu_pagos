# Prompt 3 - Pagos con Khipu (transferencia bancaria)

**Stack:** Python, FastAPI, React, Khipu API

---

Crea una integracion real con la API de Khipu en modo sandbox. Backend Python + FastAPI. Frontend React + Vite + Tailwind. Usa la API REST v3 de Khipu (https://khipu.com/page/api). Implementa: 1) POST /api/cobro que llama a la API de Khipu para crear cobro con monto en CLP, subject y notify_url, 2) redireccion al payment_url de Khipu, 3) endpoint POST /api/webhook/khipu que recibe la notificacion de pago y verifica con api_version y notification_token, 4) GET /api/cobro/:id que consulta el estado en Khipu. SQLite para almacenar cobros localmente. Panel admin React con estado de cada cobro en tiempo real. Variables de entorno para receiver_id y secret de Khipu. README con instrucciones para crear cuenta de prueba en Khipu.

---

**IMPORTANTE:** No incluyas referencias a Claude, Claude Code, Anthropic ni ningun asistente IA en commits, README, package.json, comentarios de codigo ni en ningun archivo del proyecto. El unico autor debe ser "Hector Riquelme" con el email y usuario de GitHub "HectorRiquelme".
