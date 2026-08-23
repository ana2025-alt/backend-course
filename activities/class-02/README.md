# Actividad Clase 02 — HTTP como Contrato

## Ticket de Salida

1. **Que informacion comunica el metodo HTTP?**  
   Comunica la intencion semantica de la operacion que se realiza sobre un recurso (p. ej., `GET` para lectura idempotente, `POST` para creacion con efectos secundarios).

2. **Que diferencia existe entre path parameter y query parameter?**  
   El *path parameter* (`/requests/:id`) identifica a un recurso especifico y unico dentro de la jerarquia de la URL. El *query parameter* (`/requests?status=open`) filtra, ordena o modifica la presentacion de la coleccion de recursos sin cambiar la ruta base.

3. **Por que 200 con un body de error representa un contrato contradictorio?**  
   Porque los codigos de estado HTTP estan disenados para comunicar el exito o fallo a nivel de protocolo y red. Devolver `200 OK` le indica al cliente que la peticion fue procesada correctamente, obligandolo a inspeccionar el cuerpo del mensaje para darse cuenta de que ocurrio un error.

4. **Que problema resuelve Express que ya habiamos experimentado manualmente?**  
   Automatiza el enrutamiento complejo, la extraccion de parametros de ruta (`req.params`), el parsing del cuerpo JSON (`req.body`) y la composicion de middlewares, evitando parsear URLs y chunks de datos a bajo nivel con el modulo nativo `http`.

5. **Por que HTTP es suficiente para nuestro proyecto y cuando dejaria de serlo?**  
   Es suficiente porque el proyecto utiliza un modelo clasico de peticion-respuesta iniciado por el cliente. Dejaria de serlo si se requiriera comunicacion bidireccional en tiempo real iniciada por el servidor (por ejemplo, con WebSockets).