module.exports = (sequelize) => {
	const User = require('./User')(sequelize);
	const Post = require('./Post')(sequelize);
	const Favorites = require('./Favorites')(sequelize);

	return { User, Post, Favorites };
};
