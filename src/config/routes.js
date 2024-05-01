module.exports = (app) => {
    app.route('/users').get(app.routes.users_routes.findAll).post(app.routes.users_routes.create)

    app.route('/accounts').post(app.routes.accounts_routes.create)
}