# Test matrix — Entrega 04

> Fase 1: se declara lo **esperado**. Fase 6: cada caso se ejecuta y se registra lo
> **observado** (línea de estado literal y cuerpo). La columna observado se llena
> ejecutando, no copiando.

| Caso | Estado previo | Acción | Esperado | Observado |
| :--- | :--- | :--- | :--- | :--- |
| Conectar correctamente | Proyecto activo | `npm run db:check` | Éxito (`Database connection established`) | `✓ Environment variable found`<br>`✓ Database connection established`<br>`✓ PostgreSQL version detected (17.6)` |
| Crear solicitud | — | `POST /api/v1/requests` | `201 Created` con id numérico, status `open` y fechas | `HTTP/1.1 201 Created`<br>`{"data":{"id":1,"title":"Solicitud de prueba","description":"Verificando entrega 04","priority":"high","status":"open","createdAt":"2026-09-14T16:57:03.889Z","updatedAt":"2026-09-14T16:57:03.889Z"}}` |
| Reiniciar servidor | Solicitud creada (id 1) | `GET /api/v1/requests/1` | Persiste (`200 OK` con datos idénticos) | `HTTP/1.1 200 OK`<br>`{"data":{"id":1,"title":"Solicitud de prueba","description":"Verificando entrega 04","priority":"high","status":"open","createdAt":"2026-09-14T16:57:03.889Z","updatedAt":"2026-09-14T16:57:03.889Z","history":[{"previousStatus":null,"newStatus":"open","changedAt":"2026-09-14T16:57:03.889Z"}]}}` |
| Buscar inexistente | — | `GET /api/v1/requests/999` | `404 Not Found` | `HTTP/1.1 404 Not Found`<br>`{"error":"Request with id 999 not found"}` |
| Filtrar sin resultados | — | `GET /api/v1/requests?status=resolved` | `200 OK` con arreglo vacío `[]` | `HTTP/1.1 200 OK`<br>`{"data":[]}` |
| Transición válida | `open` | `PATCH /api/v1/requests/1/status` (`{"status":"in_progress"}`) | `200 OK` con nuevo status | `HTTP/1.1 200 OK`<br>`{"data":{"id":1,"title":"Solicitud de prueba","description":"Verificando entrega 04","priority":"high","status":"in_progress","createdAt":"2026-09-14T16:57:03.889Z","updatedAt":"2026-09-14T17:01:08.540Z"}}` |
| Transición inválida | `open` | `PATCH /api/v1/requests/1/status` (`{"status":"closed"}`) | `400/409 Conflict/Bad Request` | `HTTP/1.1 400 Bad Request`<br>`{"error":"Invalid status transition"}` |
| Consultar historia | Transición hecha | `GET /api/v1/requests/1` | `200 OK` con lista de transiciones en `history` | `HTTP/1.1 200 OK`<br>`{"data":{...,"history":[{"previousStatus":null,"newStatus":"open","changedAt":"..."},{"previousStatus":"open","newStatus":"in_progress","changedAt":"..."}]}}` |
| Falla del historial | Estado previo | Cambio transaccional (simular fallo en insert history) | Rollback (`500` y `status` en requests sin cambios) | `HTTP/1.1 500 Internal Server Error`<br>`Transacción abortada mediante ROLLBACK, request conserva status previo.` |
| Base no disponible | — | `DATABASE_URL` inválida y consultar | Error consistente (`500/503`) | `HTTP/1.1 500 Internal Server Error`<br>`{"error":"getaddrinfo ENOTFOUND aws-0-us-east-2.pooler.supabase.com"}` |
| Reinicio de Express | Datos existentes | Reiniciar Express y consultar `GET /api/v1/requests` | Datos conservados (`200 OK`) | `HTTP/1.1 200 OK`<br>`{"data":[{"id":1,"title":"Solicitud de prueba",...}]}` |

### Casos Adicionales

| Caso | Estado previo | Acción | Esperado | Observado |
| :--- | :--- | :--- | :--- | :--- |
| Enviar `status` en el payload de creación | — | `POST /api/v1/requests` enviando `status: "resolved"` | `201 Created` ignorando el valor enviado y forzando status inicial `open` | `HTTP/1.1 201 Created`<br>`{"data":{"id":2,"title":"Test status override","status":"open",...}}` |
| Filtrado combinado por status y priority | Registros existentes | `GET /api/v1/requests?status=in_progress&priority=high` | `200 OK` con únicamente los registros que coincidan con ambos filtros | `HTTP/1.1 200 OK`<br>`{"data":[{"id":1,"status":"in_progress","priority":"high",...}]}` |

## Evidencia clave (texto, sin secretos)

### Persistencia tras reinicio

```http
POST /api/v1/requests HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"title":"Solicitud de prueba","description":"Verificando entrega 04","priority":"high"}

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "data": {
    "id": 1,
    "title": "Solicitud de prueba",
    "description": "Verificando entrega 04",
    "priority": "high",
    "status": "open",
    "createdAt": "2026-09-14T16:57:03.889Z",
    "updatedAt": "2026-09-14T16:57:03.889Z"
  }
}

--- REINICIO DEL SERVIDOR (Ctrl+C -> npm start) ---

GET /api/v1/requests/1 HTTP/1.1
Host: localhost:3000

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "data": {
    "id": 1,
    "title": "Solicitud de prueba",
    "description": "Verificando entrega 04",
    "priority": "high",
    "status": "open",
    "createdAt": "2026-09-14T16:57:03.889Z",
    "updatedAt": "2026-09-14T16:57:03.889Z",
    "history": [
      {
        "previousStatus": null,
        "newStatus": "open",
        "changedAt": "2026-09-14T16:57:03.889Z"
      }
    ]
  }
} 