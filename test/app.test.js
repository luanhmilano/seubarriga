const request = require("supertest");

const app = require('../src/app')

test('Deve responder na raiz', async () => {
  const res = await request(app).get('/users');
  expect(res.status).toBe(200);
})