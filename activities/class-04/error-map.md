# Error map — Entrega 04

> Fase 1 · clasifica cada situación por categoría y define la respuesta externa.
> Regla transversal: la respuesta al cliente jamás incluye contraseñas, hosts,
> sentencias SQL, stack traces ni errores crudos de PostgreSQL.

## Categorías

| Categoría | Significado | Estado HTTP |
| :--- | :--- | :--- |
| Contrato | La petición está mal en sí misma | 400 Bad Request |
| Recurso | El recurso referido no existe | 404 Not Found |
| Dominio | Petición válida que el estado actual prohíbe | 409 Conflict |
| Persistencia | La base rechazó algo que la app creía válido | 500 Internal Server Error |
| Infraestructura | La base no está disponible | 503 Service Unavailable |
| Interno | Error inesperado no identificado | 500 Internal Server Error |

## Situaciones concretas

| Situación | Categoría | Estado | Código de error |
| :--- | :--- | :--- | :--- |
| Falta `title` al crear | Contrato | 400 | VALIDATION_ERROR |
| Prioridad desconocida | Contrato | 400 | VALIDATION_ERROR |
| Filtro con valor desconocido | Contrato | 400 | INVALID_FILTER |
| Solicitud inexistente | Recurso | 404 | REQUEST_NOT_FOUND |
| Transición inválida | Dominio | 409 | INVALID_STATUS_TRANSITION |
| Solicitud terminal | Dominio | 409 | REQUEST_IN_TERMINAL_STATUS |
| Restricción CHECK rechaza un INSERT | Persistencia | 500 | DATABASE_ERROR |
| Base pausada / sin red | Infraestructura | 503 | DATABASE_UNAVAILABLE |
| Error de pg no identificado | Interno | 500 | INTERNAL_ERROR |

## Qué se registra en el log interno

* **Información necesaria para el diagnóstico:**
  * Identificador o código interno del error (ej. código `code` de PostgreSQL como `23505`, `23514`, `ECONNREFUSED`).
  * Ruta HTTP y método de la petición (`req.method`, `req.originalUrl`).
  * Mensaje de error técnico y traza de ejecución (*stack trace*) en consola para depuración en desarrollo.
  * Contexto de la operación afectada (ej. `requestId`, operación de store o paso transaccional que falló).

* **Prohibido registrar en logs:**
  * La cadena completa de conexión `DATABASE_URL` o cualquier credencial de acceso (contraseñas, tokens).
  * Datos sensibles o información de autenticación del entorno.
  * Respuestas crudas que expongan la topología interna del servidor al cliente.