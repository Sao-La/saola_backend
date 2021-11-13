require('dotenv').config({ silent: true });

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWD,
    "database": `${process.env.DB_NAME_PREFIX}_development`,
    "host": process.env.DB_URL,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWD,
    "database": `${process.env.DB_NAME_PREFIX}_test`,
    "host": process.env.DB_URL,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWD,
    "database": `${process.env.DB_NAME_PREFIX}_production`,
    "host": process.env.DB_URL,
    "dialect": "postgres",
	"dialectOptions": {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		}
	}
  }
}
