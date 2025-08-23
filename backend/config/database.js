module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'db/dev.db',
    seederStorage: 'sequelize',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  },
};
