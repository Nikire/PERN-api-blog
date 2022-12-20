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
		authorId: {
			type: DataTypes.UUID,
			allowNull: false,
			foreignKey: true,
		},
	});
	Post.associate = function (models) {
		Post.belongsTo(models.User, { foreignKey: 'authorId' });
	};
	return Post;
};
