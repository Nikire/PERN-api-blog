const { Sequelize } = require('sequelize');
const { testConnection } = require('./helpers/sequelize');
require('dotenv').config();

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
testConnection(sequelize);
