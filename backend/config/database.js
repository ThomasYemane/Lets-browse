module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'db/dev.db',
    seederStorage: 'sequelize'
  },
  staging: {                       // ← local Postgres test
    username: 'postgres',
    password: null,
    database: 'lets_browse_staging',
    host: '127.0.0.1',
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  production: {                    // ← Render
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    protocol: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: process.env.PGSSLMODE === 'require'
        ? { require: true, rejectUnauthorized: false }
        : undefined
    }
  }
};
