const {
	testConnection,
	loadDB,
	createBaseAdmin,
} = require('./src/helpers/sequelize');
require('dotenv').config();

// Require Express and Sequelize
const server = require('./src/server');
const { sequelize, models } = require('./src/sequelize');

// Test Sequelize connection
testConnection(sequelize);
// Start Express server
const { ADMIN_NAME, ADMIN_PASSWORD, ADMIN_USERNAME, ADMIN_EMAIL } = process.env;
const { PORT } = process.env;
sequelize.sync({ force: true }).then(() => {
	server.listen(PORT, () => {
		// Load DB with Users and Admin
		loadDB(models);
		createBaseAdmin(
			models.User,
			ADMIN_NAME,
			ADMIN_PASSWORD,
			ADMIN_USERNAME,
			ADMIN_EMAIL
		);
		console.log(`Server started on port ${PORT}`);
	});
});
