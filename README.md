# Khipu Pagos - Integración con API REST v3

**Autor:** Hector Riquelme

Integración real con la API de Khipu para pagos por transferencia bancaria en Chile.

## ¿Qué es Khipu?

Khipu es una plataforma de pagos chilena que permite recibir pagos mediante transferencia bancaria. Los comercios crean cobros y los usuarios pagan directamente desde su banco, sin tarjeta de crédito.

## Requisitos previos

1. Crear una cuenta en [Khipu](https://khipu.com) (modo prueba/sandbox disponible).
2. En el panel de Khipu, obtener:
   - **Receiver ID**: identificador de tu cuenta de cobro.
   - **Secret (API Key)**: clave secreta para autenticación con la API v3.
3. Python 3.10+ y Node.js 18+.

## Configuración

Copiar el archivo de ejemplo y completar las credenciales:

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de Khipu
```

Para recibir webhooks en desarrollo local, usar [ngrok](https://ngrok.com):

```bash
ngrok http 8000
# Copiar la URL generada como WEBHOOK_BASE_URL en .env
```

## Levantar el proyecto

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

El backend corre en `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` con proxy al backend.

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/cobro` | Crear cobro en Khipu |
| GET | `/api/cobro/{id}` | Obtener detalle y sincronizar estado |
| GET | `/api/cobros` | Listar todos los cobros |
| POST | `/api/webhook/khipu` | Webhook para notificaciones de Khipu |

### Crear cobro (ejemplo)

```bash
curl -X POST http://localhost:8000/api/cobro \
  -H "Content-Type: application/json" \
  -d '{"subject": "Pago de prueba", "monto": 1000, "body": "Descripcion opcional"}'
```

## Flujo completo

1. El usuario llena el formulario en el panel y crea un cobro.
2. El backend llama a la API v3 de Khipu (`POST /v3/payments`) para generar el cobro.
3. Khipu devuelve un `payment_url` al cual se redirige al usuario.
4. El usuario realiza la transferencia bancaria en la plataforma de Khipu.
5. Khipu notifica al backend via webhook (`POST /api/webhook/khipu`).
6. El backend verifica el estado con la API de Khipu (`GET /v3/payments/{id}`) y actualiza la base de datos.
7. El panel muestra el estado actualizado (polling cada 10 segundos).

## Estructura de la base de datos

Tabla `cobros`:
- `id` - Autoincremental
- `payment_id` - ID del pago en Khipu
- `subject` - Asunto del cobro
- `monto` - Monto en CLP
- `estado` - pendiente / completado / fallido
- `payment_url` - URL de pago de Khipu
- `notification_token` - Token de notificación
- `fecha_creacion` / `fecha_actualizacion`
