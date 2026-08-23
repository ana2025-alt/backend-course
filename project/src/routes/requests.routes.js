import express from 'express';
import { requests, generateId } from '../data/requests.js';

const router = express.Router();

// GET /requests (con soporte opcional para filtro ?status=open)
router.get('/', (req, res) => {
  const { status } = req.query;

  if (status) {
    const filtered = requests.filter(
      (item) => item.status.toLowerCase() === status.toLowerCase()
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(requests);
});

// GET /requests/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const request = requests.find((item) => item.id === id);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.status(200).json(request);
});

// POST /requests
router.post('/', (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newRequest = {
    id: generateId(),
    title: title.trim(),
    description: description || '',
    status: 'open',
    priority: priority || 'medium'
  };

  requests.push(newRequest);
  res.status(201).json(newRequest);
});

export default router; 