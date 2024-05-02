const request = require('supertest')
const jwt = require('jwt-simple')

const app = require('../../src/app')

const email = `${Date.now()}@gmail.com`
let user

beforeAll(async () => {
    const res = await app.services.user.save({ name: 'User Account', email: `${Date.now()}@gmail.com`, passwd: '123456' })
    user = { ...res[0] }
    user.token = jwt.encode(user, 'Segredo!')
})

test('Deve listar todos os usuários', async () => {
  const res = await request(app).get('/users')
  .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(200)
  expect(res.body.length).toBeGreaterThan(0)
})

test('Deve inserir usuário com sucesso', async () => {
  const res = await request(app).post('/users').send({ name: 'Walter White', email, passwd: '123456' })
  .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(201)
  expect(res.body.name).toBe('Walter White')
  expect(res.body).not.toHaveProperty('passwd')
})

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post('/users')
  .send({ name: 'Walter White', email: `${Date.now()}@gmail.com`, passwd: '123456' })
  .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(201)

  const { id } = res.body
  const userDB = await app.services.user.findOne({id})
  expect(userDB.passwd).not.toBeUndefined()
  expect(userDB.passwd).not.toBe('123456')
})

test('Não deve inserir usuário sem nome', () => {
  return request(app).post('/users').send({ email:'walter@gmail.com', passwd: '123456' })
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Nome é um atributo obrigatório')
  })
})

test('Não deve inserir usuário sem email', async () => {
  const result = await request(app).post('/users').send({name: 'Jesse Pinkman', passwd: '123456'})
  .set('authorization', `bearer ${user.token}`)
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Email é um atributo obrigatório')
})

test('Não deve inserir usuário sem senha', async (done) => {
  const result = await request(app).post('/users').send({ name: 'Walter White', email: 'walter@gmail.com' })
  .set('authorization', `bearer ${user.token}`)
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Senha é um atributo obrigatório')
  done()
})

test('Não deve inserir usuário com email já existente', async () => {
  const res = await request(app).post('/users').send({ name: 'Walter White', email, passwd: '123456' })
  .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(400)
  expect(res.body.error).toBe('Já existe um usuário com esse email')
})