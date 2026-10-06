# Data model — Request API v4

## Tabla `requests`

| Columna | Tipo | ¿Nulo? | Default | Restricciones | ¿Quién lo genera? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` / `BIGINT` | No | Autoincremental | `PRIMARY KEY` | PostgreSQL |
| `title` | `VARCHAR(255)` | No | — | Sin restricciones adicionales | Cliente (validado no vacío) |
| `description` | `TEXT` | Sí | `NULL` | Sin restricciones adicionales | Cliente (opcional) |
| `priority` | `VARCHAR(50)` | No | `'medium'` | `CHECK (priority IN ('low', 'medium', 'high'))` | Cliente / Default DB |
| `status` | `VARCHAR(50)` | No | `'open'` | `CHECK (status IN ('open', 'in_progress', 'resolved', 'cancelled'))` | Servidor / Default DB |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | Inmutable | PostgreSQL |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | Actualizado en cada modificación | PostgreSQL / Servidor |

## Tabla `request_status_history`

| Columna | Tipo | ¿Nulo? | Default | Restricciones | ¿Quién lo genera? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` / `BIGINT` | No | Autoincremental | `PRIMARY KEY` | PostgreSQL |
| `request_id` | `INTEGER` / `BIGINT` | No | — | `REFERENCES requests(id) ON DELETE CASCADE` | Servidor |
| `previous_status` | `VARCHAR(50)` | Sí | `NULL` | `CHECK (previous_status IS NULL OR previous_status IN ('open', 'in_progress', 'resolved', 'cancelled'))` | Servidor (`NULL` al crear) |
| `new_status` | `VARCHAR(50)` | No | — | `CHECK (new_status IN ('open', 'in_progress', 'resolved', 'cancelled'))` | Servidor |
| `changed_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | Inmutable | PostgreSQL |

> **Justificación de `previous_status` NULL:** Al crear la solicitud (`POST /api/v1/requests`), se registra el primer hito en el historial con `previous_status = NULL` y `new_status = 'open'`, formalizando el inicio del ciclo de vida bajo la misma transacción atómica.

---

## Qué regla protege cada capa

| Capa | Reglas que protege |
| :--- | :--- |
| **HTTP (Routes)** | Formato JSON válido, presencia de parámetros de ruta (`:id`), captura de query params (`status`, `priority`, `limit`, `offset`) y asignación de códigos HTTP semánticos (`200`, `201`, `400`, `404`, `500`). |
| **Servicio (Service / Business)** | Reglas del dominio, consistencia de máquina de estados, mapeo DTO (`RequestMapper`) y orquestación de transacciones atómicas (`withTransaction`). |
| **Persistencia (Store / PostgreSQL)** | Consultas parametrizadas anti SQL-injection (`$1, $2`), integridad referencial (`FK`), unicidad (`PK`), tipos de datos y persistencia transaccional (`BEGIN`, `COMMIT`, `ROLLBACK`). | 