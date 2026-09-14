# Persistence contract — Operaciones del store

Este documento define la interfaz y promesas del store hacia el servicio. Cada operación garantiza el uso de clientes compartidos cuando participa en una transacción.

---

## `findAll(filters, db = pool)`
* **Entrada:** `filters` objeto opcional `{ status?: string, priority?: string }`, `db` cliente o pool.
* **Consulta:** `SELECT id, title, description, priority, status, created_at, updated_at FROM requests WHERE 1=1 [AND status = $X] [AND priority = $Y] ORDER BY id ASC`.
* **Salida:** Arreglo de filas crudas (`Array<Row>`). Si no hay coincidencias, devuelve `[]`.
* **Errores:** Lanza error de infraestructura si la conexión falla.

---

## `findById(id, db = pool)`
* **Entrada:** `id` numérico (`number` o `string`), `db` cliente o pool.
* **Consulta:** `SELECT id, title, description, priority, status, created_at, updated_at FROM requests WHERE id = $1`.
* **Salida:** Fila cruda (`Row`) si existe, o `null` si no se encuentra.
* **Errores:** Lanza error si el parámetro no es válido o hay falla de base de datos.

---

## `insertRequest({ title, description, priority }, db = pool)`
* **Entrada:** Objeto con atributos validados, `db` cliente transaccional o pool.
* **Consulta:** `INSERT INTO requests (title, description, priority) VALUES ($1, $2, $3) RETURNING id, title, description, priority, status, created_at, updated_at`.
* **Salida:** La fila recién insertada con su `id` y timestamps generados por PostgreSQL.
* **Errores:** Violación de constraints de base de datos (`23514` check violation).

---

## `updateRequest(id, changes, db = pool)`
* **Entrada:** `id` numérico, `changes` objeto dinámico con los campos a actualizar (`title`, `description`, `priority`, `status`), `db` cliente transaccional o pool.
* **Consulta:** `UPDATE requests SET ... , updated_at = CURRENT_TIMESTAMP WHERE id = $X RETURNING id, title, description, priority, status, created_at, updated_at`.
* **Salida:** Fila actualizada o `null` si el registro no existe.
* **Errores:** Conflicto de constraints o falla de infraestructura.

---

## `insertStatusHistory(requestId, prevStatus, newStatus, db = pool)`
* **Entrada:** `requestId` (BIGINT), `prevStatus` (string o null), `newStatus` (string), `db` cliente transaccional.
* **Consulta:** `INSERT INTO request_status_history (request_id, previous_status, new_status) VALUES ($1, $2, $3) RETURNING id, request_id, previous_status, new_status, changed_at`.
* **Salida:** Fila del evento insertado.
* **Errores:** Violación de clave foránea (`23503`) o check constraint.

---

## `findHistory(requestId, db = pool)`
* **Entrada:** `requestId` numérico, `db` cliente o pool.
* **Consulta:** `SELECT id, request_id, previous_status, new_status, changed_at FROM request_status_history WHERE request_id = $1 ORDER BY changed_at ASC, id ASC`.
* **Salida:** Arreglo de filas del historial (`Array<Row>`).
* **Errores:** Error de infraestructura. 