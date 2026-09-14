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


3. Control de Accesos y Roles (RBAC)
Requester (Solicitante): Permisos para crear nuevas solicitudes (POST) y consultar únicamente sus propias solicitudes o el detalle de las mismas.

Agent (Agente/Gestor): Permisos para listar todas las solicitudes del sistema, modificar estados y prioridades mediante PATCH, y gestionar la trazabilidad operativa.

4. Reglas de Validación y Códigos de Error (HTTP)
400 Bad Request: Si faltan campos obligatorios o los valores del payload no coinciden con el esquema permitido.

401 Unauthorized: Si la petición no incluye un token JWT válido o ha expirado.

403 Forbidden: Si un usuario con rol Requester intenta ejecutar acciones exclusivas de un Agent (ej. cambiar estados).

404 Not Found: Si el identificador (id) de la solicitud no existe en la base de datos.

409 Conflict: Al intentar modificar una solicitud cuyo estado actual ya es terminal (resolved o cancelled). 