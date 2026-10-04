# Reflexión — Clase 05

¡Perfecto! Ese 12/12 confirma que tu código está impecable y que la limpieza de carpetas fue un éxito.

Basándome en la imagen que compartiste antes con las instrucciones del taller, el archivo `reflection.md` tiene 6 preguntas clave sobre diseño y seguridad.

Aquí tienes las respuestas conceptuales para que las copies, las adaptes con tus propias palabras y las pegues en tu archivo:

### Respuestas para `reflection.md`

**1. ¿Qué diferencia identidad, autenticación y autorización?**

* **Identidad:** Es quién afirmas ser (por ejemplo, tu correo electrónico o tu ID de usuario).
* **Autenticación:** Es la prueba o verificación de esa identidad (demostrar que eres tú mediante una contraseña y recibir un JWT).
* **Autorización:** Son los permisos que tienes una vez dentro (qué operaciones te deja hacer el sistema según el archivo `request.policy.js`).

**2. ¿Por qué `createdBy` no llega desde el body?**

* Por pura seguridad. Si el servidor confiara en el `body`, un usuario malintencionado podría enviar un POST diciendo `"createdBy": 999` y crear solicitudes a nombre de otra persona. Al sacarlo directamente de `req.auth.userId` (el token verificado), el backend garantiza que el creador es exactamente la persona que inició sesión.

**3. ¿Qué autorización depende del rol y cuál de la propiedad?**

* **Por rol:** Depende exclusivamente del tipo de usuario. Por ejemplo, solo el rol `agent` puede cambiar la prioridad o el estado de una solicitud, sin importar de quién sea.
* **Por propiedad:** Depende de quién es el dueño del recurso. Por ejemplo, un `requester` solo puede editar el contenido (título/descripción) de una solicitud si esta le pertenece (`request.createdBy === actor.userId`) y está en estado abierto.

**4. ¿Qué intentó romper el validador?**

* El validador (la "Boss Battle") intentó ataques típicos: trató de enviar campos controlados por el servidor en el body (como `createdBy` y `changedBy`), intentó que un requester viera los datos de otro usuario (para verificar que devolviera un 404), probó tokens alterados o sin esquema Bearer, e intentó transiciones de estado prohibidas.

**5. ¿Qué propuesta de IA rechazaste y por qué?**

 Rechacé cualquier propuesta que sugiriera validar permisos basándose en lo que envía el cliente o intentar hacer validaciones de seguridad únicamente ocultando botones en el frontend. La seguridad real y los permisos (como rechazar un body mixto) deben vivir estrictamente en las reglas del backend.

**6. ¿Qué demostraría que el backend está protegido aunque el frontend sea manipulado?**

* Si un atacante modifica el código del frontend (o usa una herramienta como Postman) para forzar una petición `PATCH` e intentar cambiar la prioridad siendo un `requester`, el backend interceptará la petición y devolverá un `403 FORBIDDEN` (o un `400` si inyecta campos no permitidos). La interfaz puede ser engañada, pero el backend jamás.

---
## Ticket de Salida


Clasifica: ¿identidad, authn, authz o auditoría?
Identidad = Quién dices ser. Authn (Autenticación) = Demostrar que eres tú. Authz (Autorización) = Qué tienes permitido hacer. Auditoría = Registrar qué hiciste y cuándo.

¿Qué contiene request.auth?
Contiene únicamente la identidad confiable extraída del token: el userId y el role.

¿Qué NO debe llevar un JWT?
Jamás debe llevar datos sensibles (como contraseñas, hashes o información personal privada), porque el payload solo está codificado en Base64 y cualquiera puede leerlo.

¿Decodificar vs verificar?
Decodificar es solo traducir el Base64 a texto legible (inseguro). Verificar es comprobar criptográficamente la firma del token para garantizar que fue emitido por ti y no ha sido manipulado.

¿Por qué el registro no acepta role?
Para evitar una vulnerabilidad de escalamiento de privilegios. Si lo aceptara, cualquier atacante podría registrarse pasándole "role": "agent" en el body y obtener permisos administrativos.

¿Quién establece createdBy?
El backend, y lo hace extrayendo el ID del usuario directamente del token verificado (req.auth.userId).

¿Cuándo usarías 401?
(No autorizado / No autenticado). Lo uso cuando no hay una identidad confiable: falta el token, expiró, es inválido o no tiene el formato Bearer.

¿Cuándo usarías 403?
(Prohibido). Lo uso cuando sí sé quién es el usuario (el token es válido), pero su rol o propiedad no le dan permiso para hacer esa acción específica.

¿Por qué lo ajeno puede dar 404?
Es una decisión de diseño para aislar a los usuarios. Si devolviéramos 403 al pedir un recurso ajeno, le confirmaríamos a un atacante que ese ID existe. Con el 404, ocultamos su existencia.

¿Por qué agent no salta open -> closed?
Porque la autorización (quién eres) no anula las reglas de dominio (la máquina de estados). Un agent tiene permiso para cambiar estados, pero aún debe seguir el flujo lógico (ej. pasar primero por resolved o in_progress).

¿Qué comprueba el boss battle?
Comprueba que el backend sea completamente independiente del cliente: que rechace campos inyectados, proteja recursos por dueño y rol, aísle la información ajena y valide la autenticidad del token.

¿Qué problema aún NO resolvemos?
Aún no resolvemos la revocación de tokens (cerrar sesión globalmente), el refresco de tokens, rate limiting, ni recuperación de contraseñas. 