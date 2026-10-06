import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/database/pool.js';
import { createUser, createRequestAs } from './helpers/test-data.js';
import { loginAs } from './helpers/test-auth.js';
import { cleanupCreatedData, closePool } from './helpers/cleanup.js';

after(async () => {
  await cleanupCreatedData();
  await closePool();
});

async function createClaimScenario(name) {
  const owner = await createUser({ name: `${name}-owner` });
  const agent = await createUser({ name: `${name}-agent`, role: 'agent' });
  const ownerToken = await loginAs(owner);
  const agentToken = await loginAs(agent);
  const savedRequest = await createRequestAs(ownerToken);
  return { owner, agent, ownerToken, agentToken, savedRequest };
}

test('claim requires authentication', async () => {
  const { savedRequest } = await createClaimScenario('claim-auth');

  const response = await request(app).post(`/requests/${savedRequest.id}/claim`);

  assert.equal(response.status, 401);
  assert.equal(typeof response.body.requestId, 'string');
});

test('a requester cannot claim a request', async () => {
  const { ownerToken, savedRequest } = await createClaimScenario('claim-requester');

  const response = await request(app)
    .post(`/requests/${savedRequest.id}/claim`)
    .set('Authorization', `Bearer ${ownerToken}`);

  assert.equal(response.status, 403);
});

test('an agent claims an open request using the authenticated identity', async () => {
  const { agent, agentToken, savedRequest } = await createClaimScenario('claim-agent');

  const response = await request(app)
    .post(`/requests/${savedRequest.id}/claim`)
    .set('Authorization', `Bearer ${agentToken}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.assignedTo, agent.id);
  assert.equal(response.body.status, 'in_progress');
  assert.ok(new Date(response.body.updatedAt) > new Date(savedRequest.updatedAt));
});

test('claiming a nonexistent request answers 404', async () => {
  const { agentToken } = await createClaimScenario('claim-missing');

  const response = await request(app)
    .post('/requests/999999999/claim')
    .set('Authorization', `Bearer ${agentToken}`);

  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'REQUEST_NOT_FOUND');
});

test('a second claim answers 409 REQUEST_ALREADY_ASSIGNED with a request id', async () => {
  const { agentToken, savedRequest } = await createClaimScenario('claim-repeat');
  const url = `/requests/${savedRequest.id}/claim`;

  const first = await request(app)
    .post(url)
    .set('Authorization', `Bearer ${agentToken}`);
  const second = await request(app)
    .post(url)
    .set('Authorization', `Bearer ${agentToken}`);

  assert.equal(first.status, 200);
  assert.equal(second.status, 409);
  assert.equal(second.body.error.code, 'REQUEST_ALREADY_ASSIGNED');
  assert.equal(typeof second.body.requestId, 'string');
  assert.equal(second.body.requestId, second.headers['x-request-id']);
});

test('concurrent claims allow one agent and reject the other', async () => {
  const { agentToken, savedRequest } = await createClaimScenario('claim-race');
  const url = `/requests/${savedRequest.id}/claim`;
  const [first, second] = await Promise.all([
    request(app).post(url).set('Authorization', `Bearer ${agentToken}`),
    request(app).post(url).set('Authorization', `Bearer ${agentToken}`)
  ]);

  assert.deepEqual([first.status, second.status].sort(), [200, 409]);
});

test('claim rolls assignment and status back if history insertion fails', async () => {
  const { agentToken, ownerToken, savedRequest } = await createClaimScenario('claim-rollback');
  const realConnect = pool.connect.bind(pool);
  const originalConnect = pool.connect;
  const failure = new Error('simulated claim history write failure');
  pool.connect = async (...args) => {
    const client = await realConnect(...args);
    return {
      query(sql, values) {
        if (/INSERT INTO request_history/i.test(sql) && values?.[1] === 'request_claimed') {
          throw failure;
        }
        return client.query(sql, values);
      },
      release() {
        client.release();
      }
    };
  };

  let response;
  try {
    response = await request(app)
      .post(`/requests/${savedRequest.id}/claim`)
      .set('Authorization', `Bearer ${agentToken}`);
  } finally {
    pool.connect = originalConnect;
  }

  assert.equal(response.status, 500);
  const unchanged = await request(app)
    .get(`/requests/${savedRequest.id}`)
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(unchanged.status, 200);
  assert.equal(unchanged.body.status, 'open');
  assert.equal(unchanged.body.assignedTo, null);
});

test('a non-open request cannot be claimed', async () => {
  const { agentToken, ownerToken } = await createClaimScenario('claim-status');
  const transitionSteps = {
    in_progress: ['in_progress'],
    resolved: ['in_progress', 'resolved'],
    closed: ['in_progress', 'resolved', 'closed'],
    cancelled: ['cancelled']
  };

  for (const [status, steps] of Object.entries(transitionSteps)) {
    const savedRequest = await createRequestAs(ownerToken);
    for (const nextStatus of steps) {
      const transition = await request(app)
        .patch(`/requests/${savedRequest.id}`)
        .set('Authorization', `Bearer ${agentToken}`)
        .send({ status: nextStatus });
      assert.equal(transition.status, 200, `prepare request in ${status}`);
    }

    const response = await request(app)
      .post(`/requests/${savedRequest.id}/claim`)
      .set('Authorization', `Bearer ${agentToken}`);
    assert.equal(response.status, 409, `claiming a ${status} request`);
  }
});

test('assignedTo in the body is rejected as a server-controlled field', async () => {
  const { agent, agentToken, savedRequest } = await createClaimScenario('claim-body');

  const response = await request(app)
    .post(`/requests/${savedRequest.id}/claim`)
    .set('Authorization', `Bearer ${agentToken}`)
    .send({ assignedTo: agent.id });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'SERVER_CONTROLLED_FIELD');
});

test('the claim leaves a request_claimed event in the history', async () => {
  const { agentToken, ownerToken, savedRequest } = await createClaimScenario('claim-history');
  const claimed = await request(app)
    .post(`/requests/${savedRequest.id}/claim`)
    .set('Authorization', `Bearer ${agentToken}`);
  const history = await request(app)
    .get(`/requests/${savedRequest.id}/history`)
    .set('Authorization', `Bearer ${ownerToken}`);

  assert.equal(claimed.status, 200);
  assert.equal(history.status, 200);
  assert.ok(history.body.some((event) =>
    event.type === 'request_claimed'
      && event.fromStatus === 'open'
      && event.toStatus === 'in_progress'
  ));
});
