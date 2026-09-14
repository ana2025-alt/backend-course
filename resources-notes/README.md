# Notas sobre Recursos y Modelado de Dominio

## 1. Identificación y Ciclo de Vida
* **Recurso principal:** `Request` (Solicitud de mantenimiento institucional).
* **Ciclo de estados:** `open` → `in_progress` → `resolved` / `cancelled`.
* **Inmutabilidad:** Los estados `resolved` y `cancelled` son terminales; cualquier intento de modificación posterior es rechazado con `409 Conflict`.
* **Auditoría:** Cada transición genera un registro histórico inmutable en `request_status_history` bajo una transacción atómica.

## 2. Convenciones de Diseño
* **Persistencia:** Relacional mediante PostgreSQL (Supabase) con connection pooling (`pg.Pool`) y consultas parametrizadas.
* **Operaciones:** 
  * `GET /api/v1/requests` (lectura y filtrado por query params).
  * `GET /api/v1/requests/:id` (detalle con array `history` embebido).
  * `POST /api/v1/requests` (creación transaccional con estado inicial `open`).
  * `PATCH /api/v1/requests/:id/status` (transición controlada de máquina de estados).
  * `DELETE /api/v1/requests/:id` (cancelación lógica).
* **Eliminación:** Se descarta el borrado físico (`DELETE` en BD) en favor de la cancelación lógica (`cancelled`) para garantizar la trazabilidad completa del ciclo de vida. 