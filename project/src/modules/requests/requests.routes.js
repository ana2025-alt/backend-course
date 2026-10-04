// HTTP layer of the requests module: it extracts path, query, body and
// the authenticated actor, invokes the operation, and translates results
// and typed errors into HTTP responses. It contains no SQL and no domain
// rules. The router assumes app.js mounted it behind `authenticate`, so
// req.auth is always present here.

import express from 'express';
import {
  listRequests,
  getRequest,
  createRequest,
  patchRequest,
  getHistory
} from './requests.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { status, priority } = req.query;
  res.status(200).json(await listRequests(req.auth, { status, priority }));
});

router.get('/:id', async (req, res) => {
  res.status(200).json(await getRequest(req.auth, req.params.id));
});

router.get('/:id/history', async (req, res) => {
  res.status(200).json(await getHistory(req.auth, req.params.id));
});

router.post('/', async (req, res) => {
  res.status(201).json(await createRequest(req.auth, req.body));
});

router.patch('/:id', async (req, res) => {
  res.status(200).json(await patchRequest(req.auth, req.params.id, req.body));
});

export default router;
