# Matriz de acceso — Request API v5

| Operación HTTP | Endpoint | Anónimo | Requester | Agent |
| -------------- | -------- | ------- | --------- | ----- |
| POST | /auth/register | Sí | No | No |
| POST | /auth/login | Sí | Sí | Sí |
| GET | /auth/me | No | Sí | Sí |
| GET | /requests | No | Propias | Sí |
| POST | /requests | No | Sí | No |
| GET | /requests/:id | No | Propias | Sí |
| PATCH | /requests/:id | No | Propia y abierta | Sí |
| PATCH | /requests/:id/priority | No | No | Sí |
| PATCH | /requests/:id/status | No | No | Sí |
| GET | /requests/:id/history | No | Propias | Sí |
| DELETE | /requests/:id | No | Propia y abierta | Sí |
