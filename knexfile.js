const { host, password, database, port } = require("pg/lib/defaults");

module.exports = {
    test: {
        client: 'pg',
        version: '9.6',
        connection: {
            host: 'localhost',
            port: '5433',
            user: 'postgres',
            password: 'postgres',
            database: 'barriga'
        },
        migrations: {
            directory: 'src/migrations'
        },
        seeds: {
            directory: 'src/seeds'
        }
    }
}