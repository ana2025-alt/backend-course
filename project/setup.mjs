import fs from 'fs';

const matrix = `# Matriz de acceso — Request API v5

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
`;

const threats = `# Casos de amenaza — Request API v5

1. Escalamiento vertical en registro: Atacante envía POST /auth/register con rol agent. Servidor responde 400 Bad Request con SERVER_CONTROLLED_FIELD.
2. Suplantación de autor al crear solicitud: Atacante envía POST /requests con createdBy 99. Servidor responde 400 Bad Request con SERVER_CONTROLLED_FIELD.
3. Manipulación de auditoría en edición: Atacante envía PATCH /requests/1 con changedBy 42. Servidor responde 400 Bad Request con SERVER_CONTROLLED_FIELD.
4. Enumeración de solicitudes ajenas: Requester envía GET /requests/45 de otro usuario. Servidor responde 404 Not Found con REQUEST_NOT_FOUND.
5. Requester modificando prioridad: Requester envía PATCH /requests/1 con priority urgent. Servidor responde 403 Forbidden con FORBIDDEN.
6. Petición sin token a ruta protegida: Anónimo envía GET /requests sin header Authorization. Servidor responde 401 Unauthorized con AUTHENTICATION_REQUIRED.
7. Token con firma alterada: Atacante envía GET /auth/me con firma alterada o falsa. Servidor responde 401 Unauthorized con INVALID_TOKEN.
8. Edición mixta con campos no permitidos: Requester envía PATCH /requests/1 con title y priority. Servidor responde 403 Forbidden con FORBIDDEN.
`;

const targets = ['activities/class-05', '../activities/class-05'];

targets.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(`${dir}/access-matrix.md`, matrix, 'utf8');
  fs.writeFileSync(`${dir}/threat-cases.md`, threats, 'utf8');
});

console.log('--- ARCHIVOS ESCRITOS CORRECTAMENTE ---'); 