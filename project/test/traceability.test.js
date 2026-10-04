import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('every error response carries an X-Request-Id header', async () => {
  const response = await request(app).get('/unknown-traceability-route');

  assert.equal(response.status, 404);
  assert.match(response.headers['x-request-id'], /^[A-Za-z0-9._-]{1,64}$/);
});

test('an error body carries the same requestId as the response header', async () => {
  const response = await request(app).get('/unknown-traceability-route');

  assert.equal(response.body.requestId, response.headers['x-request-id']);
});

test('a valid client X-Request-Id is retained', async () => {
  const requestId = 'frontend-trace-42';
  const response = await request(app)
    .get('/unknown-traceability-route')
    .set('X-Request-Id', requestId);

  assert.equal(response.headers['x-request-id'], requestId);
  assert.equal(response.body.requestId, requestId);
});

test('an oversized client X-Request-Id is replaced', async () => {
  const response = await request(app)
    .get('/unknown-traceability-route')
    .set('X-Request-Id', 'x'.repeat(300));

  assert.notEqual(response.headers['x-request-id'], 'x'.repeat(300));
  assert.match(response.headers['x-request-id'], /^req_[A-Fa-f0-9-]{36}$/);
  assert.equal(response.body.requestId, response.headers['x-request-id']);
});

test('the request log carries the response requestId and excludes credentials', async () => {
  const requestId = 'trace-log-safe-42';
  const markerToken = 'token-that-must-not-be-logged';
  const capturedLogs = [];
  const realConsoleLog = console.log;
  console.log = (line) => capturedLogs.push(String(line));

  let response;
  try {
    response = await request(app)
      .get('/unknown-traceability-route')
      .set('X-Request-Id', requestId)
      .set('Authorization', `Bearer ${markerToken}`);
  } finally {
    console.log = realConsoleLog;
  }

  const requestLog = capturedLogs
    .map((line) => JSON.parse(line))
    .find((entry) => entry.event === 'request_completed');
  assert.ok(requestLog);
  assert.equal(requestLog.requestId, response.headers['x-request-id']);
  assert.equal(requestLog.requestId, requestId);
  assert.doesNotMatch(capturedLogs.join('\n'), new RegExp(markerToken));
  assert.doesNotMatch(capturedLogs.join('\n'), /Authorization|Bearer /i);
});
