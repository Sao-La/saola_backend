require('dotenv').config({ silent: true });

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWD,
    "database": `${process.env.DB_NAME_PREFIX}_development`,
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWD,
    "database": `${process.env.DB_NAME_PREFIX}_test`,
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWD,
    "database": `${process.env.DB_NAME_PREFIX}_production`,
    "host": "127.0.0.1",
    "dialect": "postgres",
	"use_env_variable": "DATABASE_URL",
	"ssl": true,
  }
}
