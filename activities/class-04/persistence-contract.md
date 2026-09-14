# Persistence contract — Operaciones del store

Este documento define la interfaz y promesas del store hacia el servicio. Cada operación garantiza el uso de clientes compartidos cuando participa en una transacción mediante `withTransaction`.

---

## `findAll(filters = {}, client = pool)`
* **Entrada:** `filters` objeto opcional `{ status?: string, priority?: string, limit?: number, offset?: number }`, `client` instancia de conexión o pool.
* **Consulta:** `SELECT id, title, description, priority, status, created_at, updated_at FROM requests WHERE 1=1 [AND status = $X] [AND priority = $Y] ORDER BY id ASC [LIMIT $L OFFSET $O]`.
* **Salida:** Arreglo de filas crudas en `snake_case` (`Array<Row>`). Si no hay coincidencias, devuelve `[]`.
* **Errores:** Error de infraestructura si la conexión falla.

---

## `findById(id, client = pool)`
* **Entrada:** `id` numérico (`number` o `string`), `client` instancia de conexión o pool.
* **Consulta:** `SELECT id, title, description, priority, status, created_at, updated_at FROM requests WHERE id = $1`.
* **Salida:** Fila cruda (`Row`) si existe, o `null` si no se encuentra.
* **Errores:** Lanza error si el identificador no es válido o hay falla de conexión.

---

## `create(data, client = pool)`
* **Entrada:** Objeto `{ title, description, priority }`, `client` cliente transaccional o pool.
* **Consulta:** `INSERT INTO requests (title, description, priority) VALUES ($1, $2, COALESCE($3, 'medium')) RETURNING id, title, description, priority, status, created_at, updated_at`.
* **Salida:** La fila recién insertada con su `id` y timestamps generados por PostgreSQL.
* **Errores:** Violación de constraints de base de datos (`23514` check violation) o error de conexión.

---

## `update(id, changes, client = pool)`
* **Entrada:** `id` numérico, `changes` objeto con los campos a actualizar (ej. `{ status }`), `client` cliente transaccional o pool.
* **Consulta:** `UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, title, description, priority, status, created_at, updated_at`.
* **Salida:** Fila actualizada o `null` si el registro no existe.
* **Errores:** Conflicto de constraints o falla transaccional.

---

## `createStatusHistory(historyData, client = pool)`
* **Entrada:** Objeto `{ requestId, previousStatus, newStatus }`, `client` cliente transaccional.
* **Consulta:** `INSERT INTO request_status_history (request_id, previous_status, new_status) VALUES ($1, $2, $3) RETURNING id, request_id, previous_status, new_status, changed_at`.
* **Salida:** Fila del evento insertado en la tabla de auditoría.
* **Errores:** Violación de clave foránea (`23503`) o check constraint.

---

## `findStatusHistoryByRequestId(requestId, client = pool)`
* **Entrada:** `requestId` numérico, `client` instancia de conexión o pool.
* **Consulta:** `SELECT id, request_id, previous_status, new_status, changed_at FROM request_status_history WHERE request_id = $1 ORDER BY changed_at ASC, id ASC`.
* **Salida:** Arreglo de filas del historial (`Array<Row>`). Si no hay eventos, devuelve `[]`.
* **Errores:** Falla de infraestructura o cliente no disponible.