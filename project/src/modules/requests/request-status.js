export const STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled',
};

export const VALID_STATUSES = Object.values(STATUS);
export const TERMINAL_STATUSES = [STATUS.RESOLVED, STATUS.CANCELLED];

export const VALID_TRANSITIONS = {
  [STATUS.OPEN]: [STATUS.IN_PROGRESS, STATUS.CANCELLED],
  [STATUS.IN_PROGRESS]: [STATUS.RESOLVED, STATUS.CANCELLED],
  [STATUS.RESOLVED]: [],
  [STATUS.CANCELLED]: [],
};

export function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

export function isTerminalStatus(status) {
  return TERMINAL_STATUSES.includes(status);
}

export function canTransition(fromStatus, toStatus) {
  const allowed = VALID_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
} 