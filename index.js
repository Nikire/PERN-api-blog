const { testConnection } = require('./helpers/sequelize');
require('dotenv').config();

// Require Express and Sequelize
const server = require('./server');
const sequelize = require('./sequelize');

// Test Sequelize connection
testConnection(sequelize);

// Start Express server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
