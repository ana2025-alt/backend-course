# Test matrix — Entrega 04

> Fase 1: se declara lo **esperado**. Fase 6: cada caso se ejecuta y se registra lo
> **observado** (línea de estado literal y cuerpo)[cite: 2]. La columna observado se llena
> ejecutando, no copiando[cite: 2].

| Caso | Estado previo | Acción | Esperado | Observado |
| :--- | :--- | :--- | :--- | :--- |
| Conectar correctamente | Proyecto activo | `npm run db:check` | Éxito (`Database connection successful`) | |
| Crear solicitud | — | `POST /requests` | `201 Created` con id numérico, status `open` y fechas | |
| Reiniciar servidor | Solicitud creada | `GET /requests/:id` | Persiste (`200 OK` con datos idénticos) | |
| Buscar inexistente | — | `GET /requests/999` | `404 Not Found` (`REQUEST_NOT_FOUND`) | |
| Filtrar sin resultados | — | Filtro válido (`status=resolved`) | `200 OK` con arreglo vacío `[]` | |
| Cambiar prioridad | `open` | `PATCH /requests/:id` (`priority: "high"`) | `200 OK` con prioridad actualizada | |
| Transición válida | `open` | `PATCH /requests/:id` (`status: "in-progress"`) | `200 OK` con nuevo status | |
| Transición inválida | `open` | `PATCH /requests/:id` (`status: "closed"`) | `409 Conflict` (`INVALID_STATUS_TRANSITION`) | |
| Consultar historia | Transición hecha | `GET /requests/:id/history` | `200 OK` con lista de transiciones | |
| Falla del historial | Estado previo | Cambio transaccional (simular fallo en insert history) | Rollback (`500/503` y `status` en requests sin cambios) | |
| Base no disponible | — | Detener BD / URL inválida y consultar | Error consistente (`503 Service Unavailable`) | |
| Reinicio de Express | Datos existentes | Reiniciar Express y consultar `GET /requests` | Datos conservados (`200 OK`) |

> Agrega tus propios casos (mínimo dos): por ejemplo, `status` enviado al crear (se ignora),
> body sin campos modificables, o el filtro combinado[cite: 2].

| Caso | Estado previo | Acción | Esperado | Observado |
| :--- | :--- | :--- | :--- | :--- |
| Enviar `status` en el payload de creación | — | `POST /requests` enviando `status: "resolved"` | `201 Created` ignorando el valor enviado y forzando status inicial `open` | |
| Filtrado combinado por status y priority | Registros existentes en la base | `GET /requests?status=open&priority=high` | `200 OK` con únicamente los registros que coincidan con ambos filtros | |

## Evidencia clave (texto, sin secretos)

### Persistencia tras reinicio

_(El 201 con su id → el reinicio → el 200 posterior. Nunca la URL de conexión.)_[cite: 2]

```txt
[Pendiente de ejecución en Fase 6] 