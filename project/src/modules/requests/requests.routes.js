import { Router } from 'express';
import {
  findAll,
  findById,
  create,
  update,
} from './requests.store.js';
import {
  isValidStatus,
  isTerminalStatus,
  canTransition,
} from './request-status.js';

const router = Router();

const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET /requests (con soporte para filtros combinables status y priority)
router.get('/', (req, res) => {
  const { status, priority } = req.query;

  if (status && !isValidStatus(status)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_FILTER',
        message: `Status '${status}' is not valid. Valid values: open, in-progress, resolved, cancelled`,
      },
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_FILTER',
        message: `Priority '${priority}' is not valid. Valid values: low, medium, high`,
      },
    });
  }

  const results = findAll({ status, priority });
  return res.status(200).json(results);
});

// GET /requests/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const request = findById(id);

  if (!request) {
    return res.status(404).json({
      error: {
        code: 'REQUEST_NOT_FOUND',
        message: `Request with id ${id} not found`,
      },
    });
  }

  return res.status(200).json(request);
});

// POST /requests
router.post('/', (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Field "title" is required and must be a non-empty string',
      },
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: `Priority '${priority}' is not valid. Valid values: low, medium, high`,
      },
    });
  }

  const newRequest = create({
    title: title.trim(),
    description,
    priority,
  });

  return res.status(201).json(newRequest);
});

// PATCH /requests/:id
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const current = findById(id);

  if (!current) {
    return res.status(404).json({
      error: {
        code: 'REQUEST_NOT_FOUND',
        message: `Request with id ${id} not found`,
      },
    });
  }

  if (isTerminalStatus(current.status)) {
    return res.status(409).json({
      error: {
        code: 'REQUEST_IN_TERMINAL_STATUS',
        message: `Cannot modify a request in terminal status '${current.status}'`,
      },
    });
  }

  const { title, description, priority, status } = req.body;

  if (
    title === undefined &&
    description === undefined &&
    priority === undefined &&
    status === undefined
  ) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'At least one modifiable field must be provided (title, description, priority, status)',
      },
    });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Field "title" must be a non-empty string',
      },
    });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: `Priority '${priority}' is not valid. Valid values: low, medium, high`,
      },
    });
  }

  if (status !== undefined) {
    if (!isValidStatus(status)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `Status '${status}' is not valid`,
        },
      });
    }

    if (!canTransition(current.status, status)) {
      return res.status(409).json({
        error: {
          code: 'INVALID_STATUS_TRANSITION',
          message: `Cannot transition from '${current.status}' to '${status}'`,
        },
      });
    }
  }

  const updated = update(id, {
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description }),
    ...(priority !== undefined && { priority }),
    ...(status !== undefined && { status }),
  });

  return res.status(200).json(updated);
});

export default router; 