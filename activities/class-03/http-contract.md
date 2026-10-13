# Contrato HTTP — Request API Full (v3)

## Base URL
`http://localhost:3000`

## Estructura Estándar de Errores
Todas las respuestas de error siguen el esquema:
```json
{
  "error": {
    "code": "CODIGO_DEL_ERROR",
    "message": "Mensaje legible explicando la causa"
  }
} 


1. Listar solicitudes (Colección)
Método: GET

Ruta: /requests

Query Params (opcionales y combinables):

status: 'open' | 'in-progress' | 'resolved' | 'cancelled'

priority: 'low' | 'medium' | 'high'

Respuestas:

200 OK: Arreglo de solicitudes que cumplan los filtros (o vacío [] si ninguna coincide).

400 Bad Request: Si se pasa un status o priority con un valor desconocido (INVALID_FILTER).


2. Consultar una solicitud por ID
Método: GET

Ruta: /requests/:id

Respuestas:

200 OK: Objeto de la solicitud encontrada.

404 Not Found: { "error": { "code": "REQUEST_NOT_FOUND", "message": "Request not found" } }

3. Crear una solicitud
Método: POST

Ruta: /requests

Headers: Content-Type: application/json

Body:


{
  "title": "Falla en aire acondicionado",
  "description": "Bota agua en el aula 102",
  "priority": "high"
} 


Respuestas:

201 Created: Objeto creado con id, status: "open", createdAt y updatedAt.

400 Bad Request: Si falta el title o viene vacío (VALIDATION_ERROR).

4. Actualización parcial de una solicitud
Método: PATCH

Ruta: /requests/:id

Headers: Content-Type: application/json

Body (parcial): 


{
  "status": "in-progress",
  "priority": "low"
} 



Respuestas:

200 OK: Objeto con las propiedades actualizadas y nuevo updatedAt.

400 Bad Request: Si no se envía ningún campo modificable válido o falla validación (VALIDATION_ERROR).

404 Not Found: Si el id no existe (REQUEST_NOT_FOUND).

409 Conflict:

Si la solicitud ya está en estado terminal: { "error": { "code": "REQUEST_IN_TERMINAL_STATUS", "message": "Cannot modify a request in terminal status" } }

Si la transición de estado no está permitida: { "error": { "code": "INVALID_STATUS_TRANSITION", "message": "Cannot transition from open to resolved" } } 

