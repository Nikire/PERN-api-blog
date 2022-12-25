const { Router } = require('express');

// Custom middlewares

// Import of routes
const postsRouter = require('./adminPosts.routes');
const usersRouter = require('./adminUsers.routes');
// Create an instance of the express router
const router = Router();

// if ✅ means that it is authenticated,tested and working

// Set up the routes
router.use('/posts', postsRouter);
router.use('/users', usersRouter);

// Export the router
module.exports = router;
