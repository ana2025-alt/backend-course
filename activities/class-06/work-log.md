# Class 06 work log

## Environment

**What did I configure?**
Configuré la conexión a la base de datos de PostgreSQL en Supabase, integrando la URL del Session pooler en la variable `DATABASE_URL` de mi archivo `.env` para asegurar la conectividad desde mi entorno local.
**Which command confirmed that it worked?**
Ejecuté `npm run class-06:doctor`, el cual me confirmó que la red, las migraciones y el seed respondían perfectamente.

## Request flow

**Where does the request enter?**
Las peticiones entran a través de la capa HTTP mediante las rutas de Express configuradas en `src/modules/requests/requests.routes.js`.
**Where is authentication checked?**
Se valida previamente en el middleware global de autenticación en `app.js`, que inyecta la identidad del actor en `req.auth`.
**Where is authorization checked?**
En la capa de servicio (`src/modules/requests/requests.service.js`), evaluando las políticas de acceso definidas en `request.policy.js`.
**Where is PostgreSQL accessed?**
Directamente en el Store (`src/modules/requests/requests.store.js`) a través de consultas SQL parametrizadas seguras.

## Bug fixed

**What was happening?**
Al realizar consultas con filtros que no arrojaban ningún resultado, la API devolvía un error 404 en lugar de una colección vacía (BUG-106).
**What should happen?**
Debería responder con un código HTTP 200 OK y un arreglo vacío `[]`.
**Which file did I modify?**
Modifiqué el archivo `src/modules/requests/requests.service.js` dentro de la función `listRequests`.
**Which test protects the behavior?**
Los tests automatizados de validación de colecciones vacías.

## Feature implemented

**What does GET /requests/:id/history do?**
Permite consultar la trazabilidad y el historial completo de cambios de estatus y prioridad de una solicitud en concreto.
**Who can use it?**
Solamente el usuario propietario de la solicitud o un agente autorizado.
**How is the result ordered?**
Se ordena estrictamente de forma cronológica, mostrando los eventos más antiguos primero (`ORDER BY created_at ASC, id ASC`).

## Test explained

**Choose one test.**
La prueba de ordenamiento del historial (`Events are ordered correctly`).
**What data does it prepare?**
Se encarga de levantar una solicitud de prueba que experimenta varias modificaciones de estado a lo largo del tiempo.
**What action does it perform?**
Realiza una petición de tipo `GET` al endpoint de historial autenticándose como el propietario.
**What does it check?**
Valida que el primer elemento devuelto corresponda al evento inicial de creación (`fromStatus: null`) y que la secuencia mantenga el orden ascendente correcto.
**Which rule does it protect?**
La regla de negocio del FEATURE-206 sobre la inmutabilidad y orden cronológico del historial.

## AI assistance

**What did AI help me understand?**
Me ayudó a identificar por qué el mapeador omitía el estado inicial `null` del evento de nacimiento y a estructurar las condiciones de orden en las consultas SQL.
**What code did it help produce?**
Las consultas en el store para la recuperación del historial y los ajustes en el mapeador de filas.
**What did I verify myself?**
Me encargué de levantar el entorno, correr las migraciones, ejecutar el seed y validar la suite de pruebas y el script de validación hasta alcanzar el 12/12.
**What suggestion was incorrect or incomplete?**
Algunas alternativas planteadas con manipulación de arreglos en JavaScript no resolvían la raíz del problema, por lo que terminamos aplicando la solución óptima directamente a nivel de base de datos y reglas de servicio.

## Remaining doubt

**What part do I still not understand?**
Todo el flujo por capas (Routes, Service, Store) y el manejo de transacciones me quedaron muy claros, sin dudas pendientes. 