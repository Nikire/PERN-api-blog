const { testConnection, loadDB } = require('./src/helpers/sequelize');
require('dotenv').config();

// Require Express and Sequelize
const server = require('./src/server');
const { sequelize, models } = require('./src/sequelize');

// Test Sequelize connection
testConnection(sequelize);

// Start Express server
const PORT = process.env.PORT || 5000;
sequelize.sync({ force: true }).then(() => {
	server.listen(PORT, () => {
		// Load DB with Users
		loadDB(models);
		console.log(`Server started on port ${PORT}`);
	});
});
