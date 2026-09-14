# Query matrix — Entrega 04

Todas las consultas utilizan parámetros posicionales (`$1`, `$2`, ...) para prevenir inyección SQL.

| Operación | SQL Parametrizado | Parámetros | Resultado esperado |
| :--- | :--- | :--- | :--- |
| **Listar todos** | `SELECT id, title, description, priority, status, created_at, updated_at FROM requests ORDER BY id ASC` | `[]` | Filas (array) |
| **Filtrar por status** | `SELECT id, title, description, priority, status, created_at, updated_at FROM requests WHERE status = $1 ORDER BY id ASC` | `[status]` | Filas filtradas |
| **Filtrar combinado** | `SELECT id, title, description, priority, status, created_at, updated_at FROM requests WHERE status = $1 AND priority = $2 ORDER BY id ASC` | `[status, priority]` | Filas filtradas |
| **Buscar por ID** | `SELECT id, title, description, priority, status, created_at, updated_at FROM requests WHERE id = $1` | `[id]` | 1 fila o null |
| **Crear solicitud** | `INSERT INTO requests (title, description, priority) VALUES ($1, $2, $3) RETURNING id, title, description, priority, status, created_at, updated_at` | `[title, description, priority]` | 1 fila (201) |
| **Actualizar solicitud** | `UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, title, description, priority, status, created_at, updated_at` | `[newStatus, id]` (dinámico según campos) | 1 fila actualizada |
| **Registrar historial** | `INSERT INTO request_status_history (request_id, previous_status, new_status) VALUES ($1, $2, $3)` | `[requestId, prevStatus, nextStatus]` | Inserción exitosa |
| **Consultar historial**| `SELECT id, request_id, previous_status, new_status, changed_at FROM request_status_history WHERE request_id = $1 ORDER BY changed_at ASC, id ASC` | `[requestId]` | Filas del historial | 