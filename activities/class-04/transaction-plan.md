# Transaction plan — El cambio de estado con historia

> Fase 1 · Planificación de la unidad de trabajo antes de implementar código.

1. **¿Qué operaciones forman la unidad?**
   * Operación 1: `UPDATE requests SET status = $1, ... WHERE id = $2 RETURNING ...` (actualización de la solicitud).
   * Operación 2: `INSERT INTO request_status_history (request_id, previous_status, new_status) VALUES ($1, $2, $3)` (registro del evento de auditoría en el historial).
   * Nota: En la creación inicial (`POST /requests`), la unidad también incluye el `INSERT` en `requests` seguido del `INSERT` en `request_status_history` con `previous_status = NULL`.

2. **¿Qué ocurre si falla la primera (el UPDATE)?**
   * La promesa es rechazada de inmediato, se salta la ejecución del segundo paso, se ejecuta `ROLLBACK` y la base de datos queda intacta.

3. **¿Qué ocurre si falla la segunda (el INSERT de historia)?**
   * Se captura el error en el bloque `catch`, se ejecuta inmediatamente la sentencia `ROLLBACK` sobre el cliente transaccional. Esto revierte el `UPDATE` previo en `requests`, impidiendo la inconsistencia de tener una solicitud con estado cambiado sin su correspondiente registro en el historial.

4. **¿Cuándo se ejecuta `COMMIT`?**
   * Única y exclusivamente cuando ambas operaciones (`UPDATE` e `INSERT`) se hayan completado satisfactoriamente sin emitir ninguna excepción.

5. **¿Cuándo se ejecuta `ROLLBACK`?**
   * En el bloque `catch` ante cualquier excepción producida dentro de la función de trabajo (`work(client)`), revirtiendo todas las operaciones previas antes de propagar el error.

6. **¿Qué cliente ejecuta las consultas?**
   * Un único cliente prestado del pool mediante `pool.connect()`. 
   * **¿Por qué no `pool.query()`?** Porque `pool.query()` toma un cliente aleatorio del pool para cada sentencia y lo devuelve inmediatamente. Si se usara `pool.query()`, `BEGIN`, las consultas y `COMMIT`/`ROLLBACK` se ejecutarían en conexiones independientes y aisladas, perdiendo totalmente la atomicidad transaccional.

7. **¿Cómo y cuándo se libera el cliente?**
   * Se libera siempre dentro del bloque `finally` mediante `client.release()`, garantizando que la conexión vuelva al pool tanto si la transacción tuvo éxito (`COMMIT`) como si falló (`ROLLBACK`), evitando fugas de conexiones (*client leaks*).