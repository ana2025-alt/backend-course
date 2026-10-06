# Responsibility map — Clase 08

Análisis del handler inicial `GET /requests/:id/history` y del destino de
cada responsabilidad tras el refactor. La ruta sigue siendo el límite HTTP;
el objetivo es sacar de ese handler las reglas, SQL y transformación de
filas que duplicaba.

## El handler analizado

**Ruta/operación:** `GET /requests/:id/history`.

En la versión inicial, una sola función extraía y validaba `req.params.id`,
ejecutaba las consultas de solicitud e historial, aplicaba una regla de
visibilidad, convertía filas snake_case y enviaba el status/body. El
refactor actual delega al helper, service, policy, store y mapper existentes.

## Clasificación de bloques

| Categoría | Qué hacía en el handler inicial | Destino de la responsabilidad |
| --- | --- | --- |
| HTTP (leer params/identidad) | Leer el `id` de `req.params`, validarlo y leer `req.auth`. | `requests.routes.js` lee params/actor; `src/http/parse-id.js` valida el identificador. |
| Aplicación (coordinar el caso) | Ordenar lectura de solicitud, permiso, lectura del historial y resultado. | `getHistory(actor, id)` en `requests.service.js`. |
| Negocio (¿puede verse?) | Permitir agente o propietario; ocultar recurso ajeno con el mismo 404 que uno inexistente. | `canViewHistory(actor, request)` en `request.policy.js`; el service traduce el rechazo al error de recurso existente. |
| Persistencia (SQL) | Consultar solicitud e historial directamente desde Express. | `findById` y `findHistory` en `requests.store.js`, con parámetros SQL. |
| Presentación (construir respuesta) | Transformar columnas snake_case en eventos camelCase y responder JSON. | `mapRequestRow`/`mapHistoryEventRow` en `request.mapper.js`; la ruta devuelve el resultado del service con status 200. |
| Observabilidad (errores/requestId) | El handler no debía fabricar su propia política de respuesta ni log. Errores async se propagan desde Express 5. | `app.js` monta `requestId`, `requestLogger` y `errorHandler`; el middleware central correlaciona errores. |

## Las preguntas del análisis

* **¿Cuántas razones distintas tenía esta función para cambiar?**  
  Al menos seis: contrato HTTP/validación, coordinación del caso de uso,
  regla de visibilidad, SQL de lectura, forma de la representación y
  estrategia de errores/observabilidad. Los cambios en cualquiera de estas
  áreas podían obligar a editar el mismo handler.

* **¿Qué piezas existentes duplicaba?**  
  Repetía la búsqueda que corresponde a `findById`, la consulta de
  `findHistory`, la regla de visibilidad cubierta por `canViewHistory` y la
  conversión ya representada por `mapRequestRow` y `mapHistoryEventRow`.
  También mezclaba validación de id que ya tiene `parseIdParam`.

* **¿Qué no se puede probar de forma aislada mientras todo viva junto?**  
  La regla de autorización no podía probarse como función pura sin Express,
  PostgreSQL ni token. El mapping requería atravesar SQL/HTTP para observarse,
  y la coordinación no podía verificarse separada de la consulta y la
  respuesta. El servicio y la policy separados permiten pruebas enfocadas;
  el contrato completo sigue comprobándose con la suite HTTP.

## Fronteras que conserva FEATURE-801

El endpoint claim usa la misma separación: la ruta valida y pasa la
identidad autenticada; el service aplica policy y transacción; el store
bloquea/actualiza filas mediante SQL parametrizado; el mapper presenta
`assignedTo`. La prueba de `canClaimRequest` no requiere HTTP ni base de
datos, y los tests de claim validan el contrato de integración.
