const express = require('express')
const app = express()
const knex = require('knex')
const knexfile = require('../knexfile')

// TODO criar chaveamento dinâmico
app.db = knex(knexfile.test)

const consign = require('consign')

consign({ cwd: 'src', verbose: false }).include('./config/middlewares.js').then('./routes').then('./config/routes.js').into(app)

module.exports = app