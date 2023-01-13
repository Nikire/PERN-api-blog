const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Reactions = sequelize.define('reactions', {
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [['like', 'sad', 'love']],
			},
		},
		postId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			foreignKey: true,
		},
	});
	Reactions.associate = function (models) {
		Reactions.belongsTo(models.User, { foreignKey: 'userId' });
		Reactions.belongsTo(models.Post, { foreignKey: 'postId' });
	};
	return Reactions;
};
