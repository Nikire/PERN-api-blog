const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.USER,
	process.env.PASSWORD,
	{
		host: process.env.HOST,
		dialect: 'postgres',
		port: 5432,
		logging: false,
	}
);

const models = require('./models')(sequelize);

module.exports = { sequelize, ...models };
