// Application setup: middlewares and module mounting. It does not open any
// port.
//
<<<<<<< HEAD
import express from 'express';
import { corsPolicy } from './middleware/cors.js';
import { authenticate } from './middleware/authenticate.js';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRoutes } from './routes/health.routes.js';
=======
// TODO(OPS-703): this file will grow during the workshop. The new pieces
// live in src/middleware/ and src/routes/ as guided skeletons:
//   - requestId       every request gets one identifier (src/middleware/request-id.js)
//   - requestLogger   one JSON log line per finished request (src/middleware/request-logger.js)
//   - healthRoutes    GET /health and GET /ready (src/routes/health.routes.js)
//   - notFound        a JSON answer when no route matched (src/middleware/not-found.js)
//   - errorHandler    ONE place that turns errors into responses (src/middleware/error-handler.js)
// Before registering each one, answer: WHERE does it belong, and why?
// An error middleware only sees what happened BEFORE it in this file.
import express from 'express';
import { corsPolicy } from './middleware/cors.js';
import { authenticate } from './middleware/authenticate.js';
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
import authRoutes from './modules/auth/auth.routes.js';
import requestsRoutes from './modules/requests/requests.routes.js';

const app = express();

// CORS first: preflights must be answered before anything else runs.
app.use(corsPolicy);

<<<<<<< HEAD
// Assign the ID and begin logging before parsing or routing can fail.
app.use(requestId);
app.use(requestLogger);

// Parser errors flow through the same error middleware as route failures.
app.use(express.json());

app.use(healthRoutes);

=======
// Parses incoming JSON bodies into req.body.
app.use(express.json());

>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
// /auth mixes public routes (register, login) and one protected route
// (/me), so the module applies `authenticate` internally where needed.
app.use('/auth', authRoutes);

// Every requests route needs a trusted actor: authenticate runs first and
// builds req.auth, or answers 401 and the router never runs.
app.use('/requests', authenticate, requestsRoutes);

<<<<<<< HEAD
app.use(notFound);
app.use(errorHandler);

=======
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
export default app;
