// HTTP layer of the requests module: it extracts path, query and body,
// passes the authenticated actor to the service, and sends the result.
// SQL and business rules live outside the router.

import express from 'express';
import {
  listRequests,
  getRequest,
  getHistory,
  createRequest,
  patchRequest,
  claimRequest
} from './requests.service.js';
import { parseIdParam } from '../../http/parse-id.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { status, priority } = req.query;
  res.status(200).json(await listRequests(req.auth, { status, priority }));
});

router.get('/:id', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await getRequest(req.auth, id));
});

router.get('/:id/history', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await getHistory(req.auth, id));
});

router.post('/:id/claim', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await claimRequest(req.auth, id, req.body));
});

router.post('/', async (req, res) => {
  res.status(201).json(await createRequest(req.auth, req.body));
});

router.patch('/:id', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await patchRequest(req.auth, id, req.body));
});

export default router;
