const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Upvotes = sequelize.define('upvotes', {
		commentId: {
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
	Upvotes.associate = function (models) {
		Upvotes.belongsTo(models.Comments, { foreignKey: 'commentId' });
		Upvotes.belongsTo(models.User, { foreignKey: 'userId' });
	};
	return Upvotes;
};
