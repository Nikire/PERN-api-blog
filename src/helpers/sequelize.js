let users = require('../media/JSON/users.json');
module.exports = {
	async testConnection(sequelize) {
		try {
			await sequelize.authenticate();
			console.log('Connection of Sequelize has been established successfully.');
		} catch (error) {
			console.error('Unable to connect Sequelize to the database:', error);
		}
	},
	async loadDB({ User }) {
		users = users.map(({ email, username, password, name }) => ({
			email,
			username,
			password,
			name,
		}));
		await User.bulkCreate(users);
	},
};
