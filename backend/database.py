import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "cobros.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS cobros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            payment_id TEXT,
            subject TEXT NOT NULL,
            monto INTEGER NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            payment_url TEXT,
            notification_token TEXT,
            fecha_creacion TEXT DEFAULT (datetime('now')),
            fecha_actualizacion TEXT DEFAULT (datetime('now'))
        )
    """)
    conn.commit()
    conn.close()


def insertar_cobro(payment_id: str, subject: str, monto: int, payment_url: str, notification_token: str | None = None):
    conn = get_connection()
    cursor = conn.execute(
        """INSERT INTO cobros (payment_id, subject, monto, payment_url, notification_token)
           VALUES (?, ?, ?, ?, ?)""",
        (payment_id, subject, monto, payment_url, notification_token),
    )
    cobro_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return cobro_id


def actualizar_estado(payment_id: str, estado: str, notification_token: str | None = None):
    conn = get_connection()
    ahora = datetime.utcnow().isoformat()
    if notification_token:
        conn.execute(
            "UPDATE cobros SET estado=?, notification_token=?, fecha_actualizacion=? WHERE payment_id=?",
            (estado, notification_token, ahora, payment_id),
        )
    else:
        conn.execute(
            "UPDATE cobros SET estado=?, fecha_actualizacion=? WHERE payment_id=?",
            (estado, ahora, payment_id),
        )
    conn.commit()
    conn.close()


def obtener_cobro_por_id(cobro_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM cobros WHERE id=?", (cobro_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def obtener_cobro_por_payment_id(payment_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM cobros WHERE payment_id=?", (payment_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def listar_cobros():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM cobros ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]
