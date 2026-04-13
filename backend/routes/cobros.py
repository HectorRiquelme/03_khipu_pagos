import os
from fastapi import APIRouter, HTTPException
from models import CrearCobroRequest, CobroResponse
from database import insertar_cobro, obtener_cobro_por_id, listar_cobros, actualizar_estado
from services.khipu import crear_cobro, obtener_pago

router = APIRouter()


@router.post("/api/cobro")
async def crear_cobro_endpoint(data: CrearCobroRequest):
    webhook_base = os.getenv("WEBHOOK_BASE_URL", "")
    notify_url = f"{webhook_base}/api/webhook/khipu" if webhook_base else ""

    try:
        resultado = await crear_cobro(
            subject=data.subject,
            monto=data.monto,
            body=data.body or "",
            notify_url=notify_url,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error al crear cobro en Khipu: {str(e)}")

    payment_id = resultado.get("payment_id", "")
    payment_url = resultado.get("payment_url", "")
    notification_token = resultado.get("notification_token")

    cobro_id = insertar_cobro(
        payment_id=payment_id,
        subject=data.subject,
        monto=data.monto,
        payment_url=payment_url,
        notification_token=notification_token,
    )

    return {
        "id": cobro_id,
        "payment_id": payment_id,
        "payment_url": payment_url,
        "estado": "pendiente",
    }


@router.get("/api/cobro/{cobro_id}")
async def obtener_cobro_endpoint(cobro_id: int):
    cobro = obtener_cobro_por_id(cobro_id)
    if not cobro:
        raise HTTPException(status_code=404, detail="Cobro no encontrado")

    # Consultar estado en Khipu si hay payment_id
    if cobro["payment_id"]:
        try:
            pago = await obtener_pago(cobro["payment_id"])
            status = pago.get("status", "")
            if status == "done":
                nuevo_estado = "completado"
            elif status in ("expired", "reversed"):
                nuevo_estado = "fallido"
            else:
                nuevo_estado = "pendiente"

            if nuevo_estado != cobro["estado"]:
                actualizar_estado(cobro["payment_id"], nuevo_estado)
                cobro["estado"] = nuevo_estado
        except Exception:
            pass

    return cobro


@router.get("/api/cobros")
async def listar_cobros_endpoint():
    return listar_cobros()
