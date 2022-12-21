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

//associations
models.User.associate(models);
models.Post.associate(models);
models.Favorites.associate(models);
models.Reactions.associate(models);

module.exports = { sequelize, models };
