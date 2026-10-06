import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canClaimRequest } from '../src/modules/requests/request.policy.js';

const agent = { userId: 'agent-1', role: 'agent' };
const requester = { userId: 'requester-1', role: 'requester' };
const openUnassigned = { status: 'open', assignedTo: null };

test('an agent can claim an open, unassigned request', () => {
  assert.deepEqual(canClaimRequest({ actor: agent, request: openUnassigned }), {
    allowed: true
  });
});

test('a requester cannot claim, even an open request', () => {
  assert.deepEqual(canClaimRequest({ actor: requester, request: openUnassigned }), {
    allowed: false,
    reason: 'NOT_AGENT'
  });
});

test('an already assigned request cannot be claimed again', () => {
  assert.deepEqual(canClaimRequest({
    actor: agent,
    request: { ...openUnassigned, assignedTo: 'agent-2' }
  }), {
    allowed: false,
    reason: 'ALREADY_ASSIGNED'
  });
});

test('a request that is not open cannot be claimed', () => {
  for (const status of ['in_progress', 'resolved', 'closed', 'cancelled']) {
    assert.deepEqual(canClaimRequest({
      actor: agent,
      request: { ...openUnassigned, status }
    }), {
      allowed: false,
      reason: 'NOT_OPEN'
    }, `expected ${status} to be rejected`);
  }
});

test('the role rule wins over the state rules', () => {
  assert.deepEqual(canClaimRequest({
    actor: requester,
    request: { status: 'closed', assignedTo: 'agent-2' }
  }), {
    allowed: false,
    reason: 'NOT_AGENT'
  });
});
