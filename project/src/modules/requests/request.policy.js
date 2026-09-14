export function canListAllRequests(actor) {
  return actor?.role === 'agent';
}

export function canViewRequest(actor, request) {
  if (!actor || !request) return false;
  if (actor.role === 'agent') return true;
  if (actor.role === 'requester') {
    const actorId = actor.userId || actor.id || actor.sub;
    return request.createdBy !== null && request.createdBy !== undefined && String(request.createdBy) === String(actorId);
  }
  return false;
}

export function canViewHistory(actor, request) {
  return canViewRequest(actor, request);
}

export function canCreateRequest(actor) {
  return actor?.role === 'requester';
}

export function canEditContent(actor, request) {
  if (!actor || !request) return false;
  if (actor.role !== 'requester') return false;
  const actorId = actor.userId || actor.id || actor.sub;
  const isOwner = request.createdBy !== null && String(request.createdBy) === String(actorId);
  const isOpen = request.status === 'open';
  return isOwner && isOpen;
}

export function canChangePriority(actor) {
  return actor?.role === 'agent';
}

export function canChangeStatus(actor) {
  return actor?.role === 'agent';
}  