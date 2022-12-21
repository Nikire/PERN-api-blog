const { Router } = require('express');

const { authenticateToken } = require('../helpers/express');

// Import of routes
const postsRouter = require('./posts.routes.js');
const usersRouter = require('./users.routes.js');
const authRouter = require('./auth.routes.js');
const favoritesRouter = require('./favorites.routes.js');
const reactionsRouter = require('./reactions.routes.js');

// Create an instance of the express router
const router = Router();

// Set up the routes
router.use('/auth', authRouter);
//router.use('/posts', authenticateToken, postsRouter);
//router.use('/users', authenticateToken, usersRouter);
router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/favorites', favoritesRouter);
router.use('/reactions', reactionsRouter);

// Export the router
module.exports = router;
