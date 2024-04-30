const request = require('supertest')

const app = require('../../src/app')
const { password } = require('pg/lib/defaults')

test('Deve listar todos os usuários', async () => {
  const res = await request(app).get('/users')
  expect(res.status).toBe(200)
  expect(res.body.length).toBeGreaterThan(0)
})

test('Deve inserir usuário com sucesso', async () => {
  const email = `${Date.now()}@gmail.com`
  const res = await request(app).post('/users').send({ name: 'Walter White', email, passwd: '123456' })
  expect(res.status).toBe(201)
  expect(res.body.name).toBe('Walter White')
})