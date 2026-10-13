<<<<<<< HEAD
import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { createHealthRouter } from '../src/routes/health.routes.js';
import { requestId } from '../src/middleware/request-id.js';
import { requestLogger } from '../src/middleware/request-logger.js';

function createTestApp(checkDatabase) {
  const app = express();
  app.use(requestId);
  app.use(requestLogger);
  app.use(createHealthRouter({ checkDatabase }));
  return app;
}

test('GET /health answers 200 without checking PostgreSQL', async () => {
  let checks = 0;
  const app = createTestApp(async () => {
    checks += 1;
    throw new Error('health must not run the database check');
  });

  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
  assert.equal(checks, 0);
});

test('GET /ready answers 200 when the database check succeeds', async () => {
  const app = createTestApp(async () => {});

  const response = await request(app).get('/ready');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ready', database: 'available' });
});

test('GET /ready answers 503 with a correlated generic response when the check fails', async () => {
  const failure = new Error('connection refused at db.internal:5432');
  const app = createTestApp(async () => { throw failure; });
  const requestId = 'readiness-correlation-42';
  const capturedLogs = [];
  const realConsoleError = console.error;
  console.error = (line) => capturedLogs.push(String(line));

  let response;
  try {
    response = await request(app)
      .get('/ready')
      .set('X-Request-Id', requestId);
  } finally {
    console.error = realConsoleError;
  }

  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    status: 'not_ready',
    database: 'unavailable',
    requestId
  });
  assert.equal(response.headers['x-request-id'], requestId);

  const readinessLog = capturedLogs
    .map((line) => JSON.parse(line))
    .find((entry) => entry.event === 'readiness_check_failed');
  assert.ok(readinessLog);
  assert.equal(readinessLog.requestId, requestId);
  assert.match(readinessLog.errorStack, /db.internal:5432/);
});

test('readiness failure responses never reveal connection details', async () => {
  const app = createTestApp(async () => {
    throw new Error('postgres://private-user:private-password@db.internal:5432/app; SELECT 1');
  });
  const realConsoleError = console.error;
  console.error = () => {};

  let response;
  try {
    response = await request(app).get('/ready');
  } finally {
    console.error = realConsoleError;
  }

  assert.equal(response.status, 503);
  assert.equal(typeof response.body.requestId, 'string');
  assert.doesNotMatch(
    JSON.stringify(response.body),
    /postgres|private-user|private-password|db\.internal|5432|SELECT/i
  );
=======
// Health and readiness tests — INCOMPLETE, on purpose.
//
// The interesting case is "/ready when the database is down" WITHOUT
// touching your real credentials: createHealthRouter accepts an injectable
// checkDatabase function — hand it one that throws, mounted on a tiny
// throwaway express() app.
import test from 'node:test';

test('GET /health answers 200 ok without touching PostgreSQL', { todo: true }, () => {
  // Bonus proof: sabotage pool.query for the duration of the test and
  // /health must still answer 200.
});

test('GET /ready answers 200 when PostgreSQL responds', { todo: true }, () => {
  // { status: 'ready', database: 'available' }
});

test('GET /ready answers 503 when the database check fails', { todo: true }, () => {
  // createHealthRouter({ checkDatabase: failing }) -> 503
  // { status: 'not_ready', database: 'unavailable' }
});

test('the readiness response never reveals connection details', { todo: true }, () => {
  // Make the injected check throw an error mentioning a host and a port:
  // neither may appear in the response body.
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
});
