# Registro de Uso de Inteligencia Artificial — Clase 03

## 1. My design before using AI
Antes de solicitar apoyo a la IA, se diseñaron manualmente y se congelaron bajo el tag `class-03-design` los siguientes artefactos:
* El modelo del recurso con sus campos requeridos, opcionales y controlados por el servidor (`resource-model.md`).
* El contrato HTTP con 4 endpoints y códigos de estado estándar (`http-contract.md`).
* El mapa de transiciones con estados terminales `resolved` y `cancelled` (`transition-map.md`).
* La matriz inicial de casos de prueba (`test-matrix.md`).

## 2. What I asked the AI
* Asistencia para modularizar el código bajo la arquitectura `modules/requests/` (`requests.routes.js`, `requests.store.js`, `request-status.js`)
* Implementación de la máquina de estados con validación de transiciones y códigos `409 Conflict` ante modificaciones terminales.
* Generación de la plantilla de nota de decisión técnica para la exclusión del método `DELETE`

## 3. What the AI proposed
* Una estructura modular por dominio separando el manejo de rutas, almacenamiento en memoria y reglas de estado
* Un middleware / función utilitaria para verificar transiciones válidas contra un diccionario de estados permitidos
* Respuestas de error consistentes con el formato `{ error: { code, message } }`.

## 4. What I accepted
* La separación en 3 archivos dentro de `modules/requests/`
* La validación estricta de `PATCH` que ignora campos generados por el servidor (`id`, `createdAt`, `updatedAt`) y exige al menos un campo modificable.
* El uso del código `409 Conflict` tanto para transiciones no permitidas como para recursos en estado terminal.

## 5. What I rejected or changed
* Se rechazó el uso de controladores, servicios o repositorios adicionales para mantener la simplicidad y cumplir las exclusiones de la rúbrica.
* Se rechazó la inclusión de librerías de validación de terceros (como Joi o Zod) o bases de datos, implementando validaciones nativas de JavaScript.

## 6. How I verified the result
* Se levantó el servidor con `npm start` y se ejecutó la matriz de pruebas mediante peticiones `curl.exe` verificando códigos de estado `200`, `201`, `400`, `404` y `409`.

## 7. What I still do not understand
* El manejo avanzado de concurrencia cuando múltiples clientes intentan hacer transiciones simultáneas sobre el mismo recurso en memoria.