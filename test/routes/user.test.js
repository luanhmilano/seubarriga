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

test('Não deve inserir usuário sem nome', () => {
  return request(app).post('/users').send({ email:'walter@gmail.com', passwd: '123456' }).then((res) => {
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Nome é um atributo obrigatório')
  })
})

test('Não deve inserir usuário sem email', async () => {
  const result = await request(app).post('/users').send({name: 'Jesse Pinkman', passwd: '123456'})
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Email é um atributo obrigatório')
})

test('Não deve inserir usuário sem senha', async (done) => {
  const result = await request(app).post('/users').send({ name: 'Walter White', email: 'walter@gmail.com' })
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Senha é um atributo obrigatório')
  done()
})