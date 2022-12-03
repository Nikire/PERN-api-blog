// Require Express
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Create Express app
const server = express();

// Setup Express middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(morgan('dev'));
server.use(cors());

// Setup routes
server.get('/', (req, res) => {
	res.send('Hello Express!');
});

module.exports = server;
