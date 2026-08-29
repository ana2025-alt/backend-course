# 001. Cancelar en lugar de eliminar solicitudes

* **Fecha:**  2026-08-29
* **Estado:** Aceptada

## Contexto
El sistema gestiona solicitudes de mantenimiento de una institución. Surge la duda de si se debe permitir a los usuarios o administradores borrar físicamente solicitudes (`DELETE /requests/:id`) cuando ya no son necesarias o cuando fueron creadas por error.

## Opciones consideradas

### Opción A: Permitir borrado físico (`DELETE /requests/:id`)
* **Beneficio:** Libera memoria y permite purgar datos basura o creados por equivocación de inmediato.
* **Costo:** Se pierde la trazabilidad histórica y el registro de auditoría. Si una solicitud referenciaba materiales, tiempos o personal, esa información desaparece sin dejar rastro de qué ocurrió.

### Opción B: Cancelación lógica mediante máquina de estados (`PATCH /requests/:id` con `status: "cancelled"`)
* **Beneficio:** Preserva el historial completo de incidencias. Permite auditar motivos de cancelación, conocer métricas de reportes erróneos y previene la pérdida accidental de datos.
* **Costo:** El recurso permanece en memoria ocupando espacio y requiere manejar estados terminales para evitar que se sigan modificando una vez cancelados.

## Decisión
Se adopta la **Opción B (Cancelación lógica)**. No se implementará el método HTTP `DELETE` en la API. Toda solicitud que no deba proceder pasará al estado terminal `cancelled`.

## Consecuencias
* La API no expone endpoints `DELETE`.
* Una vez que una solicitud pasa a `cancelled`, la máquina de estados bloquea cualquier intento posterior de edición retornando `409 Conflict`.
* Los clientes pueden filtrar solicitudes activas o canceladas utilizando los parámetros de consulta `?status=`. 