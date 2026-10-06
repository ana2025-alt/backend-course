<<<<<<< HEAD
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
=======
// Traceability tests — INCOMPLETE, on purpose.
//
// They become real as you resolve OPS-703. The hard part is not asserting
// what the logs contain, but what they do NOT contain: capture
// console.log/console.error during a request and inspect the lines.
// (The request logger writes on the response 'finish' event — wait a few
// milliseconds before restoring the console.)
import test from 'node:test';

test('every response carries an X-Request-Id header', { todo: true }, () => {
  // GET /health (or any route) -> the header exists.
});

test('an error body carries the same requestId as the header', { todo: true }, () => {
  // GET /requests/999999999 -> body.requestId === headers['x-request-id'].
});

test('a well-formed client X-Request-Id is kept', { todo: true }, () => {
  // Send X-Request-Id: 'frontend-trace-42' -> the response echoes it.
});

test('a suspicious client X-Request-Id is replaced, never trusted', { todo: true }, () => {
  // Send 300 characters of junk -> the response carries a server-generated id.
});

test('the log line of a request carries the same requestId as the response', { todo: true }, () => {
  // Capture the console during one request; parse each line as JSON; one
  // line must have requestId === the response header.
});

test('the Authorization header and the token never reach the log', { todo: true }, () => {
  // Capture the console during an AUTHENTICATED request and assert no
  // line includes the token or the string 'Bearer '.
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
});
