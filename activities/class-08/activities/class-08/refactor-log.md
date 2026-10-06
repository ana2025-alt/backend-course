# Refactor log — Clase 08

Registro de la separación del handler de historial. La feature de claim se
documenta como funcionalidad nueva, no como refactor. Los resultados de las
pruebas y commits se anotan solo cuando se ejecutan/verifican.

## Antes de empezar

* **Pruebas que protegen el comportamiento previo:**
  `test/requests-history.test.js` (propietario, agente, tercero, orden y
  lista vacía); también `test/requests.test.js` y `test/errors.test.js`
  cubren contratos relacionados.
* **Suite antes del refactor:** no ejecutada/verificada en esta sesión; no
  se atribuye un número de pass/fail.
* **Commit de partida:** hash no disponible/no verificado.
* **Contrato que debe permanecer:** método/ruta, status, representación,
  permisos y contrato de error/requestId de `GET /requests/:id/history`.

## Pasos de refactor

| # | Qué extraje / moví | Destino | Suite después del paso |
| --- | --- | --- | --- |
| 1 | Lectura y validación del id en la ruta se sustituyó por el helper existente `parseIdParam`. | `src/http/parse-id.js`; router conserva el límite HTTP. | No ejecutada/verificada. |
| 2 | Consulta del recurso/historial y control del acceso se movieron del handler al caso de uso; la autorización reutiliza `canViewHistory`. | `requests.service.js` y `request.policy.js`. | No ejecutada/verificada. |
| 3 | SQL directo del handler y mapeo duplicado se reemplazaron por store y mapper existentes. | `requests.store.js` (`findById`, `findHistory`) y `request.mapper.js` (`mapRequestRow`, `mapHistoryEventRow`). | No ejecutada/verificada. |

## Verificación final

* **Diff/comportamiento esperado:** el router conserva `GET
  /requests/:id/history` y responde con la lista mapeada del service.
  No se pretendió cambiar los permisos ni el orden de eventos; las pruebas
  existentes fijan esas expectativas. La suite no se ejecutó aquí, así que
  la preservación está pendiente de verificación dinámica.
* **Suite completa:** pendiente de ejecución; resultado no declarado.
* **Commit `class-08-refactor`:** hash no disponible/no verificado.

## Asistencia de IA y verificación

* La tarea solicitó completar el mapa route/service/store/policy. La
  decisión aplicada fue que la ruta valide entrada HTTP, el service coordine
  el caso de uso, la policy permanezca pura, el store contenga SQL y el
  mapper construya la representación. La correspondencia se comprobó
  leyendo los módulos actuales. La regresión del contrato debe verificarse
  ejecutando `test/requests-history.test.js`; aquí no se informa una
  ejecución que no ocurrió.
* No se proporcionó un historial literal de preguntas/respuestas de IA ni
  una propuesta concreta de sobrearquitectura. Por tanto, no se atribuyen
  propuestas al asistente. Como decisión de alcance, no se añadieron una
  capa genérica de acciones ni un repositorio adicional: los helpers y
  límites de módulo existentes bastan para este único caso de uso.

## Feature separada del refactor

`POST /requests/:id/claim` es nueva funcionalidad: agrega una política pura,
coordinación transaccional, bloqueo de fila, actualización de asignación y
evento de historial. Sus pruebas están en `test/request-policy.test.js` y
`test/requests-claim.test.js`; su estado de ejecución también debe
registrarse después de `npm test`.
