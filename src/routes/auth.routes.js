const { Router } = require('express');
//Controllers
const { login } = require('../controllers/auth.controller');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.post('/login', login);

// Export the router
module.exports = router;
