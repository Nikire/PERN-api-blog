const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Comments = sequelize.define('comments', {
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		postId: {
			type: DataTypes.UUID,
			allowNull: false,
			foreignKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			foreignKey: true,
		},
	});
	Comments.associate = function (models) {
		Comments.belongsTo(models.User, { foreignKey: 'userId' });
		Comments.belongsTo(models.Post, { foreignKey: 'postId' });
	};
	return Comments;
};
