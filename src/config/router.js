const express = require('express')

module.exports = (app) => {
    app.use('/auth', app.routes.auth_routes)
    const protectedRouter = express.Router()

    protectedRouter.use('/users', app.routes.users_routes)
    protectedRouter.use('/accounts', app.routes.accounts_routes)

    app.use('/v1', app.config.passport.authenticate(), protectedRouter)
}

