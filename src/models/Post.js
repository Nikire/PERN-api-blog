const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Post = sequelize.define('post', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	});
	Post.associate = function (models) {
		Post.belongsToMany(models.User, { through: 'users_posts' });
	};
	return Post;
};
