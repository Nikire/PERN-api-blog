const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const User = sequelize.define('user', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	});
	User.associate = function (models) {
		User.hasMany(models.Post, { foreignKey: 'userId' });
		User.hasMany(models.Favorites, { foreignKey: 'userId' });
		User.hasMany(models.Reactions, { foreignKey: 'userId' });
		User.hasMany(models.Comments, { foreignKey: 'userId' });
		User.hasMany(models.Upvotes, { foreignKey: 'userId' });
	};
	return User;
};
