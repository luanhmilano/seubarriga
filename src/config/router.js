const express = require('express')

module.exports = (app) => {
    app.use('/auth', app.routes.auth_routes)
    const protectedRouter = express.Router()

    protectedRouter.use('/users', app.routes.users_routes)
    protectedRouter.use('/accounts', app.routes.accounts_routes)
    protectedRouter.use('/transactions', app.routes.transactions_routes)
    protectedRouter.use('/transfers', app.routes.transfers_routes)
    protectedRouter.use('/balance', app.routes.balance_routes)

    app.use('/v1', app.config.passport.authenticate(), protectedRouter)

    app.get('/v2/users', (req, res) => res.status(200).send('V2 no ar'))
    app.use('/v2', protectedRouter)
}

