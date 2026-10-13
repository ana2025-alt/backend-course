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
<<<<<<< HEAD
=======
import { respondError } from '../../http/respond-error.js';
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649

const router = express.Router();

router.get('/', async (req, res) => {
<<<<<<< HEAD
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
=======
  try {
    const { status, priority } = req.query;
    res.status(200).json(await listRequests(req.auth, { status, priority }));
  } catch (error) {
    respondError(res, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    res.status(200).json(await getRequest(req.auth, Number(req.params.id)));
  } catch (error) {
    respondError(res, error);
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    res.status(200).json(await getHistory(req.auth, Number(req.params.id)));
  } catch (error) {
    respondError(res, error);
  }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await createRequest(req.auth, req.body));
  } catch (error) {
    respondError(res, error);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    res.status(200).json(await patchRequest(req.auth, Number(req.params.id), req.body));
  } catch (error) {
    respondError(res, error);
  }
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
});

export default router;
