const { Router } = require('express');

// Import of routes
const postsRouter = require('./posts.routes.js');
const usersRouter = require('./users.routes.js');

// Create an instance of the express router
const router = Router();

// Set up the routes
router.use('/posts', postsRouter);
router.use('/users', usersRouter);

// Export the router
module.exports = router;
