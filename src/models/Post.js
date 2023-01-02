const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Post = sequelize.define('post', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			foreignKey: true,
		},
	});
	Post.associate = function (models) {
		Post.belongsTo(models.User, { foreignKey: 'userId' });
		Post.hasMany(models.Favorites, { foreignKey: 'postId' });
		Post.hasMany(models.Reactions, { foreignKey: 'postId' });
		Post.hasMany(models.Comments, { foreignKey: 'postId' });
	};
	return Post;
};
