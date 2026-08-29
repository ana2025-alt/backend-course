# Matriz de Pruebas — Request API

| # | Caso de Prueba | Método y Ruta | Estado Previo | Entrada / Payload | Código Esperado | Código Observado |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Crear solicitud válida | `POST /requests` | N/A | `{"title":"Bombillo quemado","priority":"high"}` | `201 Created` | *(Pendiente ejecución)* |
| 2 | Crear sin título | `POST /requests` | N/A | `{"description":"Sin titulo"}` | `400 Bad Request` | *(Pendiente ejecución)* |
| 3 | Consultar inexistente | `GET /requests/999` | N/A | Ninguno | `404 Not Found` | *(Pendiente ejecución)* |
| 4 | Filtrar sin coincidencias | `GET /requests?status=cancelled` | 3 items | Ninguno | `200 OK` (`[]`) | *(Pendiente ejecución)* |
| 5 | Transición válida | `PATCH /requests/1` | `open` | `{"status":"in-progress"}` | `200 OK` | *(Pendiente ejecución)* |
| 6 | Transición inválida | `PATCH /requests/1` | `open` | `{"status":"resolved"}` | `409 Conflict` | *(Pendiente ejecución)* |
| 7 | Modificar estado terminal | `PATCH /requests/1` | `resolved` | `{"title":"Nuevo titulo"}` | `409 Conflict` | *(Pendiente ejecución)* |
| 8 | Filtro con valor desconocido | `GET /requests?status=unknown` | N/A | Ninguno | `400 Bad Request` | *(Pendiente ejecución)* | 