# Casos de amenaza — Request API v5

1. Escalamiento vertical en registro: Atacante envía POST /auth/register con rol agent. Servidor responde 400 Bad Request con SERVER_CONTROLLED_FIELD.
2. Suplantación de autor al crear solicitud: Atacante envía POST /requests con createdBy 99. Servidor responde 400 Bad Request con SERVER_CONTROLLED_FIELD.
3. Manipulación de auditoría en edición: Atacante envía PATCH /requests/1 con changedBy 42. Servidor responde 400 Bad Request con SERVER_CONTROLLED_FIELD.
4. Enumeración de solicitudes ajenas: Requester envía GET /requests/45 de otro usuario. Servidor responde 404 Not Found con REQUEST_NOT_FOUND.
5. Requester modificando prioridad: Requester envía PATCH /requests/1 con priority urgent. Servidor responde 403 Forbidden con FORBIDDEN.
6. Petición sin token a ruta protegida: Anónimo envía GET /requests sin header Authorization. Servidor responde 401 Unauthorized con AUTHENTICATION_REQUIRED.
7. Token con firma alterada: Atacante envía GET /auth/me con firma alterada o falsa. Servidor responde 401 Unauthorized con INVALID_TOKEN.
8. Edición mixta con campos no permitidos: Requester envía PATCH /requests/1 con title y priority. Servidor responde 403 Forbidden con FORBIDDEN.
