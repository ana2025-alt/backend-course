# Registro de decisiones — Clase 05
# Registro de decisiones — Clase 05

**1. Dónde se guarda la identidad del actor:**
la única fuente de verdad para la identidad es el objeto `req.auth`, el cual es construido por el middleware de autenticación tras verificar la firma del JWT. 
* *Alternativa descartada:* Confiar en un campo `createdBy` enviado en el `req.body`. Lo rechazamos porque el cliente es manipulable (un atacante podría enviar el ID de otra persona).

**2. Por qué los recursos ajenos responden 404 (y no 403):**
Cuando un `requester` intenta hacer un GET a un ID que pertenece a otro usuario, el backend responde `404 REQUEST_NOT_FOUND` en lugar de `403 FORBIDDEN`. 
* *Por qué:* Para evitar la filtración de información y la enumeración de recursos. Si devolviéramos 403, le estaríamos confirmando al atacante que ese ID de solicitud existe en nuestra base de datos. Un 404 enmascara la existencia del recurso.

**3. Qué pasa con las solicitudes heredadas (createdBy = NULL):**
Las solicitudes creadas antes de la clase 05 no tienen un dueño asignado.
* *Decisión:* Decidimos que ningún `requester` puede verlas, editarlas ni reclamarlas (ya que la regla exige que `request.createdBy === actor.userId`). Estas solicitudes quedan como huérfanas y únicamente son visibles y gestionables por los usuarios con rol de `agent`.