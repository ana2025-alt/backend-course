import { Router } from 'express';
import { RequestsService } from './requests.service.js';

export const requestsRouter = Router();

// GET /api/v1/requests
requestsRouter.get('/', async (req, res, next) => {
  try {
    const { status, priority, limit, offset } = req.query;
    const data = await RequestsService.listRequests({
      status,
      priority,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined
    });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/requests/:id
requestsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await RequestsService.getRequestById(id);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/requests
requestsRouter.post('/', async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const data = await RequestsService.createRequest({ title, description, priority });
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/requests/:id/status
requestsRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const data = await RequestsService.updateStatus(id, status);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/requests/:id -> Cancelación lógica
requestsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await RequestsService.cancelRequest(id);
    res.status(200).json({ data, message: 'Request successfully cancelled' });
  } catch (error) {
    next(error);
  }
});

export default requestsRouter; 