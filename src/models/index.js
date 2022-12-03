module.exports = (sequelize) => {
	const User = require('./User')(sequelize);
	const Post = require('./Post')(sequelize);

	return { User, Post };
};
