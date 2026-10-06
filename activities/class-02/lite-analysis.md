# Análisis de Contrato — Request API Lite

## Tabla de Auditoría

| ENDPOINT | INTENCIÓN | ENTRADA | RESPUESTA ACTUAL | PROBLEMA | PROPUESTA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET /getRequests` | Listar todas las solicitudes | Ninguna | `200 OK` con el arreglo completo en JSON | Ruta basada en verbo de acción (`/getRequests`) en vez de recurso plural (`/requests`). No soporta filtros. | Método: `GET`<br>Ruta: `/requests`<br>Query opcional: `?status=open`<br>Estado: `200 OK` |
| `GET /requests/:id` | Obtener solicitud por identificador | Path parameter: `id` | Si existe: `200 OK`. Si no existe: `200 OK` con `{ "error": "Request not found" }` | Contrato contradictorio: devuelve código de éxito `200` cuando el recurso no existe en el servidor. | Método: `GET`<br>Ruta: `/requests/:id`<br>Estado: `200 OK` si existe, `404 Not Found` si no existe |
| `POST /requests` | Crear una nueva solicitud | Body JSON: `{ title, description, priority }` | `200 OK` con el objeto creado. Si falta `title`, lo crea con valores vacíos o `undefined`. | 1. Usa `200 OK` en lugar de `201 Created`.<br>2. No valida datos requeridos (permite crear sin título). | Método: `POST`<br>Ruta: `/requests`<br>Entrada: JSON con `title` obligatorio<br>Estado: `201 Created` al crear, `400 Bad Request` si falta el título | 