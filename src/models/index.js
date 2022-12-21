module.exports = (sequelize) => {
	const User = require('./User')(sequelize);
	const Post = require('./Post')(sequelize);
	const Favorites = require('./Favorites')(sequelize);
	const Reactions = require('./Reactions')(sequelize);
	const Comments = require('./Comments')(sequelize);

	return { User, Post, Favorites, Reactions, Comments };
};
