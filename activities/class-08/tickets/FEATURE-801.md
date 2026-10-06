# FEATURE-801 — Claim a request

**Tipo:** funcionalidad pedida por Producto · **Prioridad:** alta · **Estado:** implementada; ejecución de suite/validador pendiente de registrar.

## Historia

> Como agente, quiero tomar una solicitud abierta para indicar que soy
> responsable de atenderla.

## Endpoint

```http
POST /requests/:id/claim
```

No requiere body. La identidad del agente proviene del token.

## Reglas

* Requiere autenticación; solamente un `agent` puede reclamar (un `requester` recibe 403).
* La solicitud debe existir (404 si no), estar `open` y no estar asignada.
* `assignedTo` se obtiene del usuario autenticado — **jamás** del body.
  Si el body intenta enviar `assignedTo`, se rechaza con `400 SERVER_CONTROLLED_FIELD`
  (decisión del curso: hacer visible el contrato en vez de ignorar en silencio).
* El estado cambia a `in_progress` y `updatedAt` se actualiza.
* Se registra un evento de historial `request_claimed` (open → in_progress).
* **Asignación e historial deben ser consistentes**: la misma transacción.
* Repetir el claim devuelve `409 REQUEST_ALREADY_ASSIGNED`.
* Los estados terminales no pueden reclamarse (`409`).
* Se conserva el contrato de errores de la clase 7: `requestId` en errores y logs.

## Respuesta

```http
200 OK
```

```json
{
  "id": 42,
  "title": "Projector failure",
  "status": "in_progress",
  "assignedTo": "<uuid del agente>",
  "updatedAt": "2026-09-29T18:30:00.000Z"
}
```

Segundo intento:

```http
409 Conflict
```

```json
{
  "error": {
    "code": "REQUEST_ALREADY_ASSIGNED",
    "message": "The request is already assigned."
  },
  "requestId": "req_..."
}
```

## Matriz de comportamiento

| Usuario | Estado | Asignada | Resultado |
| --- | --- | ---: | --- |
| agent | open | No | `200` |
| requester | open | No | `403` |
| agent | open | Sí | `409 REQUEST_ALREADY_ASSIGNED` |
| agent | in_progress | No | `409` |
| agent | resolved | No | `409` |
| agent | closed | No | `409` |
| agent | cancelled | No | `409` |
| sin token | open | No | `401` |
| agent | inexistente | — | `404` |

## La pregunta del diseño

> ¿Estamos actualizando dos columnas o ejecutando una acción con
> significado para el negocio?

Claim expresa intención; el servidor deriva la identidad; se ejecutan
varias reglas; produce historial. No es un `PATCH` genérico de campos.

## Definición de terminado

* [x] La matriz está cubierta por casos de API para autenticación, requester,
  agent, inexistente, doble claim, estados no abiertos, body manipulado,
  historial, concurrencia y rollback.
* [x] La regla pura vive en `src/modules/requests/request.policy.js` y se
  cubre sin HTTP ni base en `test/request-policy.test.js`.
* [x] SQL queda en `src/modules/requests/requests.store.js`; el service no
  importa Express.
* [x] La migración aditiva 005 está creada y no modifica migraciones 001–004.
* [ ] Migración 005 aplicada y salida de `npm run db:migrate` guardada:
  pendiente de ejecución/verificación en la base de datos.
* [ ] `npm test` y `npm run validate:class-08` terminan en PASSED:
  pendiente de ejecutar y registrar la salida real.

## Implementación y cobertura

* La ruta `POST /:id/claim` valida el id, obtiene el actor autenticado de
  `req.auth` y delega al service. El router está montado detrás de
  `authenticate`.
* Antes de la decisión de negocio, el service rechaza `assignedTo` como
  campo controlado por el servidor. En una transacción obtiene la fila con
  `FOR UPDATE`, evalúa la policy, actualiza `status` y `assigned_to`, e
  inserta `request_claimed` antes del commit.
* El bloqueo de fila serializa claims concurrentes: tras el primer commit,
  el siguiente intento lee la asignación confirmada y devuelve
  `409 REQUEST_ALREADY_ASSIGNED`.
* El mapper expone `assignedTo` (null antes de una asignación); la migración
  introduce el campo nullable compatible con solicitudes existentes y
  permite el nuevo tipo de evento.
* `test/requests-claim.test.js` prueba el contrato de API y escenarios
  transaccionales; `test/request-policy.test.js` prueba las decisiones
  puras de autorización/estado.
