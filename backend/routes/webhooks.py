from fastapi import APIRouter, HTTPException, Form
from database import actualizar_estado, obtener_cobro_por_payment_id
from services.khipu import obtener_pago

router = APIRouter()


@router.post("/api/webhook/khipu")
async def webhook_khipu(
    api_version: str = Form(default=""),
    notification_token: str = Form(default=""),
):
    """
    Recibe la notificacion POST de Khipu.
    Khipu envia api_version y notification_token como form data.
    Se consulta la API de Khipu para confirmar el estado del pago.
    """
    if not notification_token:
        raise HTTPException(status_code=400, detail="notification_token requerido")

    # Buscar cobro local por notification_token
    # Khipu no envia payment_id en el webhook, asi que consultamos por token
    # Primero obtenemos info del pago via la API de Khipu
    # En la API v3, se usa el notification_token para verificar
    # Sin embargo, necesitamos el payment_id para consultar
    # El notification_token se puede usar para buscar localmente
    try:
        # Intentar obtener informacion desde la API de Khipu
        # Buscar en BD local el cobro con este notification_token
        from database import get_connection
        conn = get_connection()
        row = conn.execute(
            "SELECT * FROM cobros WHERE notification_token=?", (notification_token,)
        ).fetchone()
        conn.close()

        if not row:
            # Si no encontramos por token, intentar actualizar todos los pendientes
            raise HTTPException(status_code=404, detail="Cobro no encontrado para este token")

        cobro = dict(row)
        payment_id = cobro["payment_id"]

        # Verificar con la API de Khipu
        pago = await obtener_pago(payment_id)
        status = pago.get("status", "")

        if status == "done":
            nuevo_estado = "completado"
        elif status in ("expired", "reversed"):
            nuevo_estado = "fallido"
        else:
            nuevo_estado = "pendiente"

        actualizar_estado(payment_id, nuevo_estado)

        return {"ok": True, "estado": nuevo_estado}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando webhook: {str(e)}")
