# Contrato HTTP — Request API Full (v4)

## Recurso

Una solicitud (`request`) representa un reporte o ticket de mantenimiento institucional.

### Forma del recurso

| Campo | Tipo | Obligatorio | Quién lo asigna | Notas |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Número | Sí | Base de datos | Autoincremental en PostgreSQL (`SERIAL`). |
| `title` | String | Sí | Cliente | Título descriptivo no vacío. |
| `description` | String | No | Cliente | Detalle del problema. |
| `priority` | String | No | Cliente / Servidor | Prioridad (`'low'`, `'medium'`, `'high'`). Por defecto: `'medium'`. |
| `status` | String | Sí | Servidor | Estado (`'open'`, `'in_progress'`, `'resolved'`, `'cancelled'`). Por defecto: `'open'`. |
| `createdAt` | String (ISO 8601) | Sí | Base de datos | Fecha de creación asignada por el motor. |
| `updatedAt` | String (ISO 8601) | Sí | Base de datos | Fecha de última modificación. |

---

## Endpoint 1 — Listar solicitudes

| Elemento | Valor |
| :--- | :--- |
| Método | `GET` |
| Ruta | `/api/v1/requests` |
| Entrada | Query params opcionales: `?status=open&priority=high&limit=50&offset=0` |
| Respuesta de éxito | `200 OK` con `{ "data": [ ... ] }` |
| Respuestas de error | `500 Internal Server Error` |

---

## Endpoint 2 — Detalle de solicitud (con historial)

| Elemento | Valor |
| :--- | :--- |
| Método | `GET` |
| Ruta | `/api/v1/requests/:id` |
| Entrada | Parámetro de ruta `id` |
| Respuesta de éxito | `200 OK` con `{ "data": { ..., "history": [ ... ] } }` |
| Respuestas de error | `404 Not Found`, `500 Internal Server Error` |

---

## Endpoint 3 — Crear solicitud

| Elemento | Valor |
| :--- | :--- |
| Método | `POST` |
| Ruta | `/api/v1/requests` |
| Entrada | JSON body con `title` (obligatorio), `description` y `priority` (opcionales) |
| Respuesta de éxito | `201 Created` con `{ "data": { ... } }` |
| Respuestas de error | `400 Bad Request` (falta `title`), `500 Internal Server Error` |

---

## Endpoint 4 — Actualizar estado (Transicional)

| Elemento | Valor |
| :--- | :--- |
| Método | `PATCH` |
| Ruta | `/api/v1/requests/:id/status` |
| Entrada | Parámetro `id` en ruta y JSON body con `status` |
| Respuesta de éxito | `200 OK` con `{ "data": { ... } }` |
| Respuestas de error | `400 Bad Request`, `404 Not Found`, `500 Internal Server Error` |

---

## Endpoint 5 — Cancelar solicitud (Cancelación Lógica)

| Elemento | Valor |
| :--- | :--- |
| Método | `DELETE` |
| Ruta | `/api/v1/requests/:id` |
| Entrada | Parámetro `id` en ruta |
| Respuesta de éxito | `200 OK` con `{ "data": { ... }, "message": "Request successfully cancelled" }` |
| Respuestas de error | `404 Not Found`, `500 Internal Server Error` |