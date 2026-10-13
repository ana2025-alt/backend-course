# Comparacion: Request API Lite vs Full

| Dimension | Proyecto Lite | Proyecto Full |
| :--- | :--- | :--- |
| **Contrato** | Observado en ejecucion y corregido a posteriori | Definido formalmente en `docs/http-contract.md` antes de codificar |
| **Organizacion** | Un solo archivo monolitico (`server.js`) | Separacion clara de responsabilidades (`server.js`, `app.js`, `routes/`, `data/`) |
| **Uso de IA** | Auditoria manual sin generacion previa | Generacion asistida bajo restricciones y contrato estricto |
| **Lectura** | Recorrido directo secuencial | Navegacion modular por responsabilidades |
| **Complejidad** | Baja | Moderada |
| **Extensibilidad**| Limitada (dificil de escalar) | Preparada para crecer sin acoplamiento |

### Que cambio entre la version Lite recibida y la corregida
1. `/getRequests` cambio a `/requests` para respetar la convencion de recursos REST.
2. `GET /requests/:id` ahora retorna codigo HTTP `404 Not Found` en lugar de un falso `200 OK`.
3. `POST /requests` ahora responde `201 Created` al registrar exitosamente y valida que el campo `title` exista y no este vacio, respondiendo `400 Bad Request` en caso de error. 