// Application setup: middlewares and module mounting. It does not open any
// port.
//
import express from 'express';
import { corsPolicy } from './middleware/cors.js';
import { authenticate } from './middleware/authenticate.js';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRoutes } from './routes/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import requestsRoutes from './modules/requests/requests.routes.js';

const app = express();

// CORS first: preflights must be answered before anything else runs.
app.use(corsPolicy);

// Assign the ID and begin logging before parsing or routing can fail.
app.use(requestId);
app.use(requestLogger);

// Parser errors flow through the same error middleware as route failures.
app.use(express.json());

app.use(healthRoutes);

// /auth mixes public routes (register, login) and one protected route
// (/me), so the module applies `authenticate` internally where needed.
app.use('/auth', authRoutes);

// Every requests route needs a trusted actor: authenticate runs first and
// builds req.auth, or answers 401 and the router never runs.
app.use('/requests', authenticate, requestsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
