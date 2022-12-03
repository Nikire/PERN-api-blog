module.exports = {
	async testConnection(sequelize) {
		try {
			await sequelize.authenticate();
			console.log('Connection of Sequelize has been established successfully.');
		} catch (error) {
			console.error('Unable to connect Sequelize to the database:', error);
		}
	},
};
