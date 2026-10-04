# Matriz de Pruebas — Request API

| # | Caso de Prueba | Método y Ruta | Estado Previo | Entrada / Payload | Código Esperado | Código Observado |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Crear solicitud válida | `POST /requests` | N/A | `{"title":"Bombillo quemado","priority":"high"}` | `201 Created` | `HTTP/1.1 201 Created` |
| 2 | Crear sin título | `POST /requests` | N/A | `{"description":"Sin titulo"}` | `400 Bad Request` | `HTTP/1.1 400 Bad Request` |
| 3 | Consultar inexistente | `GET /requests/999` | N/A | Ninguno | `404 Not Found` | `HTTP/1.1 404 Not Found` |
| 4 | Filtrar sin coincidencias | `GET /requests?status=cancelled` | 3 items | Ninguno | `200 OK` (`[]`) | `HTTP/1.1 200 OK` (`[]`) |
| 5 | Transición válida | `PATCH /requests/1` | `open` | `{"status":"in-progress"}` | `200 OK` | `HTTP/1.1 200 OK` |
| 6 | Transición inválida | `PATCH /requests/1` | `in-progress` | `{"status":"open"}` | `409 Conflict` | `HTTP/1.1 409 Conflict` (`INVALID_STATUS_TRANSITION`) |
| 7 | Modificar estado terminal | `PATCH /requests/1` | `resolved` | `{"title":"Nuevo titulo"}` | `409 Conflict` | `HTTP/1.1 409 Conflict` (`REQUEST_IN_TERMINAL_STATUS`) |
| 8 | Filtro con valor desconocido | `GET /requests?status=unknown` | N/A | Ninguno | `400 Bad Request` | `HTTP/1.1 400 Bad Request` (`INVALID_FILTER`) | 
 