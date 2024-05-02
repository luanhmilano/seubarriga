const request = require('supertest')
const app = require('../../src/app')

test('Deve criar usuário via signup', () => {
    return request(app).post('/auth/signup')
    .send({ name: 'Gus', email: `${Date.now()}@gmail.com`, passwd: '123456' })
    .then((res) => {
        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Gus')
        expect(res.body).toHaveProperty('email')
        expect(res.body).not.toHaveProperty('passwd')
    })
})

test('Deve receber token ao logar', () => {
    const email = `${Date.now()}@gmail.com`
    return app.services.user.save({ name: 'Gus', email, passwd: '123456' }).then(() => request(app).post('/auth/signin').send({ email, passwd: '123456' })).then((res) => {
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
    })
})

test('Não deve autenticar usuário com senha errada', () => {
    const email = `${Date.now()}@gmail.com`
    return app.services.user.save({ name: 'Gus', email, passwd: '123456' }).then(() => request(app).post('/auth/signin').send({ email, passwd: '654321' })).then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Usuário ou senha inválido')
    })
})

test('Não deve autenticar usuário inexistente', () => {
    return request(app).post('/auth/signin').send({ email: 'naoExiste@gmail.com', passwd: '654321' }).then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Usuário ou senha inválido')
    })
})

test('Não deve acessar uma rota protegida sem token', () => {
    return request(app).get('/users').then((res) => {
        expect(res.status).toBe(401)
    })
})