# Actividad Clase 01: Primer servidor con Node.js

## Objetivo de la actividad
Construir un servidor HTTP funcional utilizando únicamente el módulo nativo `http` de Node.js, implementando enrutamiento básico para diferentes URLs y documentando el diagnóstico de fallas en servidores defectuosos.

## Instrucciones de ejecución
1. Abre una terminal.
2. Navega a la carpeta del código: `cd activities\class-01\src`
3. Ejecuta el servidor: `node server.js`
4. Accede en el navegador o mediante curl a `http://localhost:3000`

## Solución desarrollada y casos comprobados
Se implementó un servidor con manejo de rutas mediante sentencias condicionales (`if`). Los casos comprobados son:
* **Ruta `/`:** Devuelve Status 200 y un texto de bienvenida (`text/plain`).
* **Ruta `/health`:** Devuelve Status 200 y el texto `OK` (`text/plain`).
* **Ruta `/api/info`:** Devuelve Status 200 y un objeto estructurado (`application/json`).
* **Rutas inexistentes:** Cualquier otra ruta devuelve Status 404 Not found.
* Validación y robustez: Se implementó la clase URL para ignorar posibles parámetros (?query=...) y se bloquean las peticiones que no sean GET (Status 405 Method Not Allowed).

## Evidencia reproducible
El código final en `src/server.js` puede ejecutarse sin dependencias adicionales (`npm install` no es requerido, solo `node`). Al probar cada ruta en el navegador, se observa la respuesta esperada y la consola del servidor registra cada método y URL solicitada (ej. `GET /health`).

## Explicación conceptual (Recorrido de la petición)
```text
Cliente (Navegador/curl)       Servidor Node.js (server.js)
       |                                   |
       | 1. Petición HTTP (Ej: GET /health)|
       |---------------------------------->|
       |                                   | 2. Imprime log: console.log(...)
       |                                   | 
       |                                   | 3. Evalúa las rutas (if request.url):
       |                                   |    ├── if ('/') -> 200 OK
       |                                   |    ├── if ('/health') -> 200 OK
       |                                   |    ├── if ('/api/info') -> 200 OK (JSON)
       |                                   |    └── else -> 404 Not found
       |                                   |
       | 4. Respuesta HTTP                 |     | 3. Verifica el método HTTP y evalúa la ruta                                                         (pathname):
|                                                ├── if ('/') -> 200 OK
       |<----------------------------------|
       |    (Ej: Status 200, Body: 'OK')   | 
