module.exports = {
  development: {
    username: 'postgres',
    password: 'password',
    database: 'mydatabase',
    host: 'db',  // Ensure this matches the service name in docker-compose.yml
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: 'password',
    database: 'mydatabase',
    host: 'db',
    port: 5432,
    dialect: 'postgres'
  },
  production: {
    username: 'postgres',
    password: 'password',
    database: 'mydatabase',
    host: 'db',
    port: 5432,
    dialect: 'postgres'
  }
};
