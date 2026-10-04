import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/database/pool.js';
import { cleanupCreatedData, closePool } from './helpers/cleanup.js';
import { createRequestAs, createUser } from './helpers/test-data.js';
import { loginAs } from './helpers/test-auth.js';

after(async () => {
  await cleanupCreatedData();
  await closePool();
});

async function authenticatedRequester(name = 'error-case') {
  const user = await createUser({ name });
  return { user, token: await loginAs(user) };
}

function assertErrorContract(response) {
  assert.equal(typeof response.body.error?.code, 'string');
  assert.equal(typeof response.body.error?.message, 'string');
  assert.equal(typeof response.body.requestId, 'string');
  assert.equal(response.body.requestId, response.headers['x-request-id']);
}

test('an alphabetic id answers 400 INVALID_REQUEST_ID, not 500', async () => {
  const { token } = await authenticatedRequester('bad-id-alpha');

  const response = await request(app)
    .get('/requests/not-a-number')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'INVALID_REQUEST_ID');
  assertErrorContract(response);
});

test('decimal, zero, negative, and partially numeric ids are rejected', async () => {
  const { token } = await authenticatedRequester('bad-id-format');

  for (const id of ['1.5', '0', '-3', '12abc']) {
    const response = await request(app)
      .get(`/requests/${id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 400, `expected 400 for id ${id}`);
    assert.equal(response.body.error.code, 'INVALID_REQUEST_ID');
    assertErrorContract(response);
  }
});

test('a well-formed id that matches nothing still answers 404', async () => {
  const { token } = await authenticatedRequester('missing-request');

  const response = await request(app)
    .get('/requests/999999999')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'REQUEST_NOT_FOUND');
  assertErrorContract(response);
});

test('an invalid priority answers 400 before opening a database connection', async () => {
  const owner = await createUser({ name: 'priority-owner' });
  const agent = await createUser({ name: 'priority-agent', role: 'agent' });
  const ownerToken = await loginAs(owner);
  const agentToken = await loginAs(agent);
  const savedRequest = await createRequestAs(ownerToken, { priority: 'low' });
  const realConnect = pool.connect;
  let connectionAttempts = 0;

  pool.connect = async () => {
    connectionAttempts += 1;
    throw new Error('invalid priority reached the database');
  };

  let response;
  try {
    response = await request(app)
      .patch(`/requests/${savedRequest.id}`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ priority: 'critical' });
  } finally {
    pool.connect = realConnect;
  }

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'INVALID_PRIORITY');
  assert.equal(connectionAttempts, 0);
  assertErrorContract(response);
});

test('a valid priority change still works', async () => {
  const owner = await createUser({ name: 'valid-priority-owner' });
  const agent = await createUser({ name: 'valid-priority-agent', role: 'agent' });
  const ownerToken = await loginAs(owner);
  const agentToken = await loginAs(agent);
  const savedRequest = await createRequestAs(ownerToken, { priority: 'low' });

  const response = await request(app)
    .patch(`/requests/${savedRequest.id}`)
    .set('Authorization', `Bearer ${agentToken}`)
    .send({ priority: 'high' });

  assert.equal(response.status, 200);
  assert.equal(response.body.priority, 'high');
});

test('an invalid JSON body gets a safe, correlated 400 response', async () => {
  const response = await request(app)
    .post('/auth/login')
    .set('Content-Type', 'application/json')
    .send('{"email":');

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'INVALID_JSON');
  assertErrorContract(response);
});

test('an unexpected error returns a generic 500 and logs details with its request id', async () => {
  const { token } = await authenticatedRequester('unexpected-error');
  const realQuery = pool.query;
  const internalMarker = 'test-only internal failure detail; Authorization: Bearer test-secret-token';
  const clientRequestId = 'test-error-correlation-42';
  const capturedLogs = [];
  const realConsoleError = console.error;

  pool.query = async () => {
    throw new Error(internalMarker);
  };
  console.error = (line) => capturedLogs.push(String(line));

  let response;
  try {
    response = await request(app)
      .get('/requests')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Request-Id', clientRequestId);
  } finally {
    pool.query = realQuery;
    console.error = realConsoleError;
  }

  assert.equal(response.status, 500);
  assert.equal(response.body.error.code, 'INTERNAL_ERROR');
  assertErrorContract(response);
  assert.equal(response.body.requestId, clientRequestId);
  assert.doesNotMatch(JSON.stringify(response.body), /test-only internal failure detail|Error:|at /);

  const internalLog = capturedLogs
    .map((line) => JSON.parse(line))
    .find((entry) => entry.event === 'unexpected_error');
  const requestLog = capturedLogs
    .map((line) => JSON.parse(line))
    .find((entry) => entry.event === 'request_failed');
  assert.ok(internalLog);
  assert.ok(requestLog);
  assert.equal(internalLog.requestId, clientRequestId);
  assert.equal(requestLog.requestId, clientRequestId);
  assert.match(internalLog.errorMessage, /test-only internal failure detail/);
  assert.match(internalLog.errorStack, /test-only internal failure detail/);
  assert.doesNotMatch(capturedLogs.join('\n'), /test-secret-token|Authorization|Bearer /i);
});

test('database outages return a generic 503 and keep technical details in correlated logs', async () => {
  const { token } = await authenticatedRequester('database-outage');
  const realQuery = pool.query;
  const internalMarker = 'connection refused at postgres://private-user:private-password@db.example:5432/app';
  const clientRequestId = 'test-database-correlation-43';
  const capturedLogs = [];
  const realConsoleError = console.error;

  pool.query = async () => {
    throw Object.assign(new Error(internalMarker), { code: 'ECONNREFUSED' });
  };
  console.error = (line) => capturedLogs.push(String(line));

  let response;
  try {
    response = await request(app)
      .get('/requests')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Request-Id', clientRequestId);
  } finally {
    pool.query = realQuery;
    console.error = realConsoleError;
  }

  assert.equal(response.status, 503);
  assert.equal(response.body.error.code, 'DATABASE_UNAVAILABLE');
  assertErrorContract(response);
  assert.equal(response.body.requestId, clientRequestId);
  assert.doesNotMatch(JSON.stringify(response.body), /postgres|private-user|private-password|ECONNREFUSED/i);

  const outageLog = capturedLogs
    .map((line) => JSON.parse(line))
    .find((entry) => entry.event === 'database_unavailable');
  assert.ok(outageLog);
  assert.equal(outageLog.requestId, clientRequestId);
  assert.match(outageLog.errorStack, /connection refused/);
  assert.doesNotMatch(JSON.stringify(outageLog), /private-user|private-password/);
});

test('all expected errors use the shared response shape', async () => {
  const response = await request(app).get('/path-that-does-not-exist');

  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'ROUTE_NOT_FOUND');
  assertErrorContract(response);
});
