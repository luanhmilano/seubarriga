module.exports = (app) => {
    app.route('/users').get(app.routes.users_routes.findAll).post(app.routes.users_routes.create)
}