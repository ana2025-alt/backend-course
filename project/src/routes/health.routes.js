// Separates process liveness from database readiness.
import express from 'express';
import { pool } from '../database/pool.js';
import { logTechnicalFailure } from '../middleware/error-handler.js';

export function createHealthRouter({ checkDatabase } = {}) {
  const router = express.Router();
  const check = checkDatabase ?? (() => pool.query('SELECT 1'));

  router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/ready', async (req, res) => {
    try {
      await check();
      return res.status(200).json({ status: 'ready', database: 'available' });
    } catch (error) {
      res.locals.errorCode = 'DATABASE_UNAVAILABLE';
      logTechnicalFailure('readiness_check_failed', error, req.requestId);
      return res.status(503).json({
        status: 'not_ready',
        database: 'unavailable',
        requestId: req.requestId
      });
    }
  });

  return router;
}

export const healthRoutes = createHealthRouter();
