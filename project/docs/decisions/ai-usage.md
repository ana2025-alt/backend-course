# Reflexión Técnica y Bitácora de Uso de IA — Entrega 04

## 1. Decisiones de Arquitectura y Persistencia

* **Transición de Memoria a PostgreSQL:** El desacoplamiento en 3 capas (Routes, Service, Store) permitió aislar la lógica de persistencia sin alterar los contratos HTTP ni la máquina de estados previamente diseñada.
* **Manejo de Conexiones:** Se implementó `pg.Pool` para reutilizar conexiones activas y evitar sobrecargar el motor de base de datos. Se utilizó la URL de pooling provista por Supabase para compatibilidad con entornos remotos.
* **Atomicidad con `withTransaction`:** Para garantizar la integridad entre el estado de una solicitud (`requests`) y su historial de auditoría (`request_status_history`), se aseguró que ambas operaciones compartan el mismo cliente (`client = await pool.connect()`) dentro de un bloque `BEGIN ... COMMIT`, ejecutando `ROLLBACK` en el bloque `catch` ante cualquier falla.
* **Capa de Transformación (Mapper):** Se utilizó `RequestMapper` para desacoplar la convención de la base de datos (`snake_case`) del formato esperado por el cliente HTTP (`camelCase`).

---

## 2. Registro de Interacción con Asistentes de IA

| Fase | Tarea asistida por IA | Validación humana / Decisión tomada |
| :--- | :--- | :--- |
| **Diseño SQL** | Generación de sentencias de migración para las tablas `requests` y `request_status_history`. | Se verificaron las restricciones `CHECK` en estados y prioridades, y se aseguró la clave foránea `REFERENCES requests(id)`. |
| **Depuración de Conexión** | Diagnóstico del error de pooling en Supabase y modo sin RLS. | Se determinó ejecutar las sentencias DDL sin RLS dado que el acceso se realiza mediante un backend Node.js autenticado vía `DATABASE_URL`. |
| **Transaccionalidad** | Estructura de la función de orden superior `withTransaction`. | Se validó que el cliente obtenido del pool se libere siempre dentro de una cláusula `finally` (`client.release()`) para evitar fugas de conexiones. |
| **Documentación** | Redacción y ajuste de contratos HTTP, matrices de consulta y mapa de errores. | Se revisaron y corrigieron discrepancias entre guiones (`in-progress` vs `in_progress`) y prefijos de ruta (`/api/v1/requests`). |

---

## 3. Conclusión y Aprendizajes

La implementación evidenció que la atomicidad en operaciones compuestas no puede delegarse a llamadas independientes de base de datos; el ciclo de vida del cliente transaccional debe controlarse explícitamente. Asimismo, la arquitectura en capas facilitó la migración sin introducir efectos secundarios en el ruteo ni en el controlador HTTP. 