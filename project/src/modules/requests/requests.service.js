// ============================================================================
// STARTER NOTE — Stations 6 and 7 evolve this file.
// ============================================================================

import { withTransaction } from '../../database/transaction.js';
import {
  findAll,
  findById,
  insertRequest,
  updateRequest,
  insertStatusHistory,
  findHistory
} from './requests.store.js';
import { mapRequestRow, mapHistoryRow } from './request.mapper.js';
import { STATUSES, isValidStatus, isTerminal, canTransition } from './request-status.js';
import { AppError } from '../../app-error.js';
import {
  canViewRequest,
  canViewHistory,
  canCreateRequest,
  canEditContent,
  canChangePriority,
  canChangeStatus
} from './request.policy.js';

const PRIORITIES = ['low', 'medium', 'high'];
const UPDATABLE_FIELDS = ['title', 'description', 'priority', 'status'];
const SERVER_CONTROLLED = ['id', 'createdBy', 'createdAt', 'updatedAt', 'changedBy'];

function assertValidPriority(priority) {
  if (!PRIORITIES.includes(priority)) {
    throw new AppError('contract', 'INVALID_PRIORITY',
      `Unknown priority "${priority}". Valid values: ${PRIORITIES.join(', ')}.`);
  }
}

function assertNoServerControlledFields(body, isPost = false) {
  if (!body) return;
  const fields = [...SERVER_CONTROLLED];
  if (isPost) fields.push('status');
  
  for (const field of fields) {
    if (body[field] !== undefined) {
      throw new AppError('contract', 'SERVER_CONTROLLED_FIELD', `Field ${field} is server-controlled.`);
    }
  }
}

export async function listRequests(actor, filters) {
  if (filters.status !== undefined && !isValidStatus(filters.status)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown status "${filters.status}". Valid values: ${STATUSES.join(', ')}.`);
  }
  if (filters.priority !== undefined && !PRIORITIES.includes(filters.priority)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown priority "${filters.priority}". Valid values: ${PRIORITIES.join(', ')}.`);
  }
  
  if (actor.role === 'requester') {
    filters.createdBy = actor.userId;
  }

  const rows = await findAll(filters);
  return rows.map(mapRequestRow);
}

export async function getRequest(actor, id) {
  const row = await findById(id);
  if (!row) {
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }
  
  const request = mapRequestRow(row);
  if (!canViewRequest(actor, request)) {
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }
  
  return request;
}

export async function createRequest(actor, input) {
  assertNoServerControlledFields(input, true);
  
  if (!canCreateRequest(actor)) {
    throw new AppError('forbidden', 'FORBIDDEN', 'Role not authorized to create requests.');
  }

  const { title, description, priority } = input ?? {};

  if (typeof title !== 'string' || title.trim() === '') {
    throw new AppError('contract', 'TITLE_REQUIRED', 'A request needs a non-empty title.');
  }
  if (priority !== undefined) assertValidPriority(priority);

  const row = await withTransaction(async (client) => {
    const created = await insertRequest({
      title: title.trim(),
      description: typeof description === 'string' ? description : null,
      priority: priority ?? 'medium',
      createdBy: actor.userId
    }, client);
    await insertStatusHistory(created.id, null, created.status, actor.userId, client);
    return created;
  });

  return mapRequestRow(row);
}

export async function patchRequest(actor, id, body) {
  assertNoServerControlledFields(body, false);

  const changes = {};
  for (const field of UPDATABLE_FIELDS) {
    if (body?.[field] !== undefined) changes[field] = body[field];
  }

  if (Object.keys(changes).length === 0) {
    throw new AppError('contract', 'NO_UPDATABLE_FIELDS',
      `The body must include at least one of: ${UPDATABLE_FIELDS.join(', ')}.`);
  }
  if (changes.title !== undefined && (typeof changes.title !== 'string' || changes.title.trim() === '')) {
    throw new AppError('contract', 'TITLE_REQUIRED', 'The title cannot be empty.');
  }
  if (changes.priority !== undefined) assertValidPriority(changes.priority);
  if (changes.status !== undefined && !isValidStatus(changes.status)) {
    throw new AppError('contract', 'INVALID_STATUS',
      `Unknown status "${changes.status}". Valid values: ${STATUSES.join(', ')}.`);
  }
  if (changes.title !== undefined) changes.title = changes.title.trim();

  const row = await withTransaction(async (client) => {
    const currentRow = await findById(id, client);
    if (!currentRow) {
      throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
    }
    
    const current = mapRequestRow(currentRow);

    if (!canViewRequest(actor, current)) {
      throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
    }

    if (isTerminal(current.status)) {
      throw new AppError('domain', 'REQUEST_IN_TERMINAL_STATUS',
        `Request ${id} is ${current.status} and can no longer be modified.`);
    }

    if (changes.priority !== undefined && !canChangePriority(actor)) {
      throw new AppError('forbidden', 'FORBIDDEN', 'Role not authorized to change priority.');
    }
    if (changes.status !== undefined && !canChangeStatus(actor)) {
      throw new AppError('forbidden', 'FORBIDDEN', 'Role not authorized to change status.');
    }
    if ((changes.title !== undefined || changes.description !== undefined) && !canEditContent(actor, current)) {
      throw new AppError('forbidden', 'FORBIDDEN', 'Not authorized to edit content.');
    }

    const statusChanges = changes.status !== undefined && changes.status !== current.status;
    if (statusChanges && !canTransition(current.status, changes.status)) {
      throw new AppError('domain', 'INVALID_STATUS_TRANSITION',
        `A request cannot move from ${current.status} to ${changes.status}.`);
    }

    const updated = await updateRequest(id, changes, client);
    if (statusChanges) {
      await insertStatusHistory(id, current.status, changes.status, actor.userId, client);
    }
    return updated;
  });

  return mapRequestRow(row);
}

export async function getHistory(actor, id) {
  const row = await findById(id);
  if (!row) {
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }

  const request = mapRequestRow(row);
  if (!canViewHistory(actor, request)) {
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }

  const rows = await findHistory(id);
  return rows.map(mapHistoryRow);
} 