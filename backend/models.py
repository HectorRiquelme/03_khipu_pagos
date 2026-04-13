from pydantic import BaseModel
from typing import Optional


class CrearCobroRequest(BaseModel):
    subject: str
    monto: int
    body: Optional[str] = ""


class CobroResponse(BaseModel):
    id: int
    payment_id: Optional[str] = None
    subject: str
    monto: int
    estado: str
    payment_url: Optional[str] = None
    notification_token: Optional[str] = None
    fecha_creacion: Optional[str] = None
    fecha_actualizacion: Optional[str] = None
