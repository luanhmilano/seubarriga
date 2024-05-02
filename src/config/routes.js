module.exports = (app) => {
    app.route('/auth/signin').post(app.routes.auth_routes.signin)
    app.route('/auth/signup').post(app.routes.users_routes.create)

    app.route('/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.users_routes.findAll)
    .post(app.routes.users_routes.create)

    app.route('/accounts')
    .all(app.config.passport.authenticate())
    .get(app.routes.accounts_routes.getAll)
    .post(app.routes.accounts_routes.create)

    app.route('/accounts/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.accounts_routes.get)
    .put(app.routes.accounts_routes.update)
    .delete(app.routes.accounts_routes.remove)
}