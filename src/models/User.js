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
	});
	User.associate = function (models) {
		User.belongsToMany(models.Post, { through: 'users_posts' });
	};
	return User;
};
