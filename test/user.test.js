const request = require('supertest')

const app = require('../src/app')

test('Deve listar todos os usuários', async () => {
  const res = await request(app).get('/users')
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(1) 
  expect(res.body[0]).toHaveProperty('name', 'John Doe') 
})

test('Deve inserir usuário com sucesso', async () => {
  const res = await request(app).post('/users').send({ name: 'Walter White', mail: 'walterw@gmail.com' })
  expect(res.status).toBe(201)
  expect(res.body.name).toBe('Walter White')
})