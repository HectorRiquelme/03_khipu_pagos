import os
import httpx

KHIPU_BASE_URL = "https://payment-api.khipu.com/v3"


def _headers():
    secret = os.getenv("KHIPU_SECRET", "")
    return {
        "x-api-key": secret,
        "Content-Type": "application/json",
    }


async def crear_cobro(subject: str, monto: int, body: str = "", notify_url: str = ""):
    """Crea un cobro en Khipu y devuelve la respuesta."""
    payload = {
        "subject": subject,
        "amount": monto,
        "currency": "CLP",
        "body": body,
    }
    if notify_url:
        payload["notify_url"] = notify_url

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{KHIPU_BASE_URL}/payments",
            json=payload,
            headers=_headers(),
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()


async def obtener_pago(payment_id: str):
    """Consulta el estado de un pago en Khipu."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{KHIPU_BASE_URL}/payments/{payment_id}",
            headers=_headers(),
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
