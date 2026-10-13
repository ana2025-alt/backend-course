# Registro de Uso de IA

* **Que se le pidio a la IA:**
  Generar la estructura modular inicial (`app.js`, `server.js`, `requests.routes.js`, `requests.js`) y documentar el contrato HTTP en Markdown respetando la especificacion previa.

* **Que restricciones se impusieron:**
  Excluir bases de datos reales, TypeScript, autenticacion, middlewares de terceros innecesarios, capas complejas (controllers, services, repositories) y metodos no solicitados (PUT, DELETE).

* **Que se acepto:**
  La division de responsabilidades entre el arranque del servidor (`server.js`) y la configuracion de middlewares/rutas (`app.js`), junto con la persistencia en memoria centralizada en `data/requests.js`.

* **Que se descarto o ajusto:**
  Cualquier intento de crear controladores abstractos o validadores con librerias externas tipo Zod/Joi, manteniendo validacion manual directa en el router. 