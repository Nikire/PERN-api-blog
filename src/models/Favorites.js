const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Favorites = sequelize.define('favorites', {
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
	Favorites.associate = function (models) {
		Favorites.belongsTo(models.User, { foreignKey: 'userId' });
		Favorites.belongsTo(models.Post, { foreignKey: 'postId' });
	};
	return Favorites;
};
