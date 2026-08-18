const http = require('http');

// Permite usar el puerto del entorno de despliegue o el 3000 por defecto
const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  // Parseamos la URL para separar la ruta base de posibles parámetros (?query=...)
  // Se usa 'http://localhost' como base dummy porque request.url solo trae el path
  const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Solo permitimos peticiones GET
  if (request.method !== 'GET') {
    response.statusCode = 405; // Method Not Allowed
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Method Not Allowed');
    return;
  }

  if (pathname === '/') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Support server. Available routes: /health, /api/info');
    return;
  }

  if (pathname === '/health') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('OK');
    return;
  }

  if (pathname === '/api/info') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({
      name: 'support-server',
      version: '1.0.0',
      routes: ['/', '/health', '/api/info']
    }));
    return;
  }

  // Fallback 404
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
