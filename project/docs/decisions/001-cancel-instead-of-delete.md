# 001. Cancelar en lugar de eliminar solicitudes físicamente

* **Fecha:** 2026-08-29 (Actualizado: 2026-09-14)
* **Estado:** Aceptada

## Contexto
El sistema gestiona solicitudes de mantenimiento institucional. Surge la necesidad de definir el comportamiento ante peticiones de eliminación (`DELETE /api/v1/requests/:id`) cuando un reporte ya no es necesario o fue creado por error.

## Opciones consideradas

### Opción A: Borrado físico en base de datos (`DELETE FROM requests`)
* **Beneficio:** Purga datos erróneos de la base de datos de inmediato.
* **Costo:** Se destruye la trazabilidad histórica y la auditoría. Si la solicitud tenía eventos asociados o métricas de gestión, esa información desaparece y rompería la integridad referencial con `request_status_history`.

### Opción B: Cancelación lógica transaccional (`status: "cancelled"`)
* **Beneficio:** Preserva el registro histórico completo y la auditoría relacional. Permite evaluar incidentes descartados sin alterar la integridad referencial.
* **Costo:** Requiere persistir registros inactivos en PostgreSQL y aplicar reglas estrictas para bloquear modificaciones sobre estados terminales.

## Decisión
Se adopta la **Opción B (Cancelación lógica)** expuesta a través del método semántico `DELETE /api/v1/requests/:id` y `PATCH /api/v1/requests/:id/status`. 

La API atiende solicitudes `DELETE`, pero en lugar de destruir la fila en PostgreSQL, ejecuta una actualización transaccional que establece `status = 'cancelled'` e inserta el evento correspondiente en `request_status_history`.

## Consecuencias
* La API expone `DELETE /api/v1/requests/:id`, devolviendo `200 OK` con la solicitud actualizada a estado `cancelled`.
* Una vez que una solicitud alcanza el estado `cancelled`, la máquina de estados y las reglas de servicio prohíben mutaciones posteriores retornando `409 Conflict`.
* Los clientes pueden auditar solicitudes canceladas o excluirlas mediante filtros en `GET /api/v1/requests?status=`.
* Se preserva la integridad de la clave foránea en la tabla de auditoría `request_status_history`. 