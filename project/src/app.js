import express from 'express';
import requestsRoutes from './modules/requests/requests.routes.js';

const app = express();

app.use(express.json());
app.use('/requests', requestsRoutes);

export default app; 