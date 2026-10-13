# AI usage

## What I asked
Le pedí a la IA que me ayudara a interpretar el error del validador `[11/12] Status rules preserved... missing acting agent in changedBy`. Posteriormente, le pedí ayuda para identificar qué archivos de mi estructura se debían modificar para inyectar correctamente el actor en todo el flujo de la aplicación y rechazar la inyección de campos restringidos.

## What the AI proposed
La IA propuso:
1. Asegurar que la migración 005 tuviera la columna `changed_by`.
2. Actualizar `requests.store.js` para aceptar el parámetro del usuario.
3. Inyectar `req.auth` como primer parámetro en las rutas (`requests.routes.js`) para que llegara a los servicios.
4. Implementar las reglas de `request.policy.js` dentro del método PATCH para bloquear intentos de edición no autorizados.

## What I accepted
Acepté la implementación de la inyección de dependencias pasando el objeto `actor` a las funciones de `requests.service.js` y usándolo para sobreescribir `createdBy` en las inserciones, bloqueando completamente la entrada del body.

## What I rejected
Cualquier sugerencia inicial que implicara modificar el estado o validar permisos en la capa de la base de datos o en la ruta. Me mantuve apegado a la arquitectura de tener políticas puras en `request.policy.js`.

## How I verified the implementation
Ejecutando iterativamente el comando `npm run validate:class-05` hasta lograr que el Boss Battle me diera el resultado `12/12 PASS`. 