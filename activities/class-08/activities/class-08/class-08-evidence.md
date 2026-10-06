# Evidencia de la Clase 08 — refactor y FEATURE-801

Esta evidencia describe los cambios visibles en el código. No se inventan
hashes, ejecuciones de base de datos ni resultados de pruebas. El checkpoint
de Clase 8 se completa con la evidencia de ejecución descrita al final.

## Evidencia del refactor y de la feature

* **Baseline `class-08-baseline`:** hash no disponible/no verificado en este
  entorno. No hay una salida registrada que permita afirmar un commit.
* **Commits `class-08-refactor` y `class-08-feature`:** hashes no disponibles
  ni verificados. Deben ser registrados al confirmar y publicar el trabajo.
* **Mapa de responsabilidades:** completado en
  [`responsibility-map.md`](./responsibility-map.md).
* **Separación route/service/store/policy:**
  * `src/modules/requests/requests.routes.js` valida el parámetro HTTP, pasa
    `req.auth` y llama al caso de uso.
  * `src/modules/requests/requests.service.js` coordina las transacciones,
    acceso autorizado, actualización y registro del evento.
  * `src/modules/requests/requests.store.js` contiene consultas SQL
    parametrizadas; `findByIdForUpdate` bloquea la fila reclamada.
  * `src/modules/requests/request.policy.js` expresa la decisión pura de
    claim (`NOT_AGENT`, `ALREADY_ASSIGNED`, `NOT_OPEN`).
  * `src/modules/requests/request.mapper.js` convierte columnas SQL al
    contrato camelCase, incluyendo `assignedTo`.
* **Migración de assignment:** `database/migrations/005_add_request_assignment.sql`
  agrega la columna nullable, su índice y el tipo de evento. El archivo está
  presente; no se dispone de salida de `npm run db:migrate`, por lo que la
  aplicación en una base queda **no verificada**.
* **Endpoint claim:** implementado como `POST /requests/:id/claim`, protegido
  por el montaje autenticado de `/requests`. La identidad asignada deriva
  exclusivamente de `req.auth.userId`; `assignedTo` en el body se rechaza.
  Evidencia de implementación en `requests.routes.js` y `requests.service.js`;
  respuesta real HTTP aún no verificada por ejecución.
* **Estado e historial:** dentro de una misma transacción se actualiza la
  solicitud a `in_progress`, se establece `assigned_to` y se escribe
  `request_claimed` (`open` → `in_progress`). La transacción y el bloqueo
  evitan confirmar el estado sin historial y serializan claims concurrentes.
* **Pruebas:** la policy se prueba con objetos planos en
  `test/request-policy.test.js`; el endpoint/matriz y el evento se prueban
  en `test/requests-claim.test.js`, incluyendo dos claims concurrentes y
  rollback simulado cuando falla la escritura de historial; el contrato
  previo está cubierto por `test/requests-history.test.js` y la suite
  restante. Los casos están implementados, pero no se afirma que hayan
  pasado sin una ejecución.
* **Validador:** `scripts/validate-class-08.js` es el validador designado.
  Estado de esta evidencia: `NOT RUN / NOT VERIFIED`; no hay salida válida
  con `FINAL RESULT: PASSED`.

## Explicación integradora

El refactor de `GET /requests/:id/history` deja al router con la lectura y
validación del parámetro, y traslada la coordinación a `getHistory` en el
service. La autorización de visibilidad reutiliza `canViewHistory` en la
policy; SQL de lectura vive en `findById` y `findHistory` del store, y la
representación usa `mapRequestRow`/`mapHistoryEventRow`. FEATURE-801 añade
un caso de uso distinto: claim deriva el agente de la identidad autenticada,
evalúa reglas puras y actualiza la asignación y el historial atómicamente.
Las pruebas guardan la matriz de reglas sin HTTP y las respuestas reales de
la API, además del evento histórico. La preservación efectiva del contrato
está expresada en pruebas existentes, pero su ejecución final debe quedar
registrada por `npm test` y `npm run validate:class-08`; no se declara PASSED
sin esos resultados.

## Cierre verificable pendiente

Antes de presentar el checkpoint, ejecutar desde `activities/class-08`:

1. `npm run db:migrate` y conservar su salida real para confirmar que 005 se
   aplicó (o fue omitida por ya estar aplicada).
2. `npm test` y `npm run validate:class-08`; guardar la salida completa del
   validador en `activities/class-08/validation-evidence.txt`.
3. Registrar hashes reales de los commits baseline/refactor/feature y
   confirmar que estén publicados en el remoto.
