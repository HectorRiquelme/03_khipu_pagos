import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes.cobros import router as cobros_router
from routes.webhooks import router as webhooks_router

load_dotenv()

app = FastAPI(title="Khipu Pagos API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cobros_router)
app.include_router(webhooks_router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {"mensaje": "API de Khipu Pagos activa"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
