import express from 'express';
import requestsRouter from './modules/requests/requests.routes.js';

export const app = express();

app.use(express.json());

// Montar el router con el prefijo /api/v1/requests
app.use('/api/v1/requests', requestsRouter);

// Ruta base opcional para verificar que el server responde
app.get('/', (req, res) => {
  res.json({ message: 'Request API v4 running' });
});

// Middleware centralizado de errores
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

export default app; 