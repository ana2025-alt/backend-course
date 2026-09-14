# Data model — Request API v4

## Tabla `requests`

| Columna | Tipo | ¿Nulo? | Default | Restricciones | ¿Quién lo genera? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | No | `GENERATED ALWAYS AS IDENTITY` | `PRIMARY KEY` | PostgreSQL |
| `title` | `VARCHAR(200)` | No | — | Sin restricciones adicionales | Cliente (validado no vacío) |
| `description` | `TEXT` | Sí | `NULL` | Sin restricciones adicionales | Cliente (opcional) |
| `priority` | `VARCHAR(20)` | No | `'medium'` | `CHECK (priority IN ('low', 'medium', 'high'))` | Cliente / Default DB |
| `status` | `VARCHAR(30)` | No | `'open'` | `CHECK (status IN ('open', 'in-progress', 'resolved', 'cancelled'))` | Servidor / Default DB |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | Inmutable | PostgreSQL |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | Actualizado en cada modificación | PostgreSQL / Servidor |

## Tabla `request_status_history`

| Columna | Tipo | ¿Nulo? | Default | Restricciones | ¿Quién lo genera? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | No | `GENERATED ALWAYS AS IDENTITY` | `PRIMARY KEY` | PostgreSQL |
| `request_id` | `BIGINT` | No | — | `REFERENCES requests(id) ON DELETE RESTRICT` | Servidor |
| `previous_status`| `VARCHAR(30)` | Sí | `NULL` | `CHECK (previous_status IS NULL OR previous_status IN ('open', 'in-progress', 'resolved', 'cancelled'))` | Servidor (NULL al crear) |
| `new_status` | `VARCHAR(30)` | No | — | `CHECK (new_status IN ('open', 'in-progress', 'resolved', 'cancelled'))` | Servidor |
| `changed_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | Inmutable | PostgreSQL |

> **Justificación de `previous_status` NULL:** Al momento de crear la solicitud (`POST /requests`), se registra el primer hito de creación en el historial con `previous_status = NULL` y `new_status = 'open'`, marcando el origen del ciclo de vida.

---

## Qué regla protege cada capa

| Capa | Reglas que protege |
| :--- | :--- |
| **HTTP (Routes)** | Formato JSON válido, presencia de parámetros de ruta (`:id` numérico), captura de query params y traducción a códigos HTTP. |
| **Servicio (Domain / Service)** | Máquina de estados finitos (transiciones válidas), bloqueo de estados terminales (`resolved`, `cancelled`), orquestación de transacciones atómicas. |
| **Persistencia (PostgreSQL)** | Integridad referencial (`FK`), restricciones de dominio (`CHECK`), unicidad de identidades (`PK`) e inmutabilidad de timestamps de base de datos. | 