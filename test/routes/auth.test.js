const request = require('supertest')
const app = require('../../src/app')

test('Deve receber token ao logar', () => {
    const email = `${Date.now()}@gmail.com`
    return app.services.user.save({ name: 'Gus', email, passwd: '123456' }).then(() => request(app).post('/auth/signin').send({ email, passwd: '123456' })).then((res) => {
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
    })
})