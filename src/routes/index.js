const { Router } = require('express');

const { authenticateToken } = require('../helpers/express');

// Import of routes
const postsRouter = require('./posts.routes.js');
const usersRouter = require('./users.routes.js');
const authRouter = require('./auth.routes.js');
const favoritesRouter = require('./favorites.routes.js');
const reactionsRouter = require('./reactions.routes.js');
const commentsRouter = require('./comments.routes.js');

// Create an instance of the express router
const router = Router();

// if ✅ means that it is authenticated,tested and working

// Set up the routes
router.use('/auth', authRouter); // ✅
router.use('/posts', authenticateToken, postsRouter); // ✅
router.use('/users', usersRouter); // ✅
router.use('/favorites', authenticateToken, favoritesRouter); // ✅
router.use('/reactions', authenticateToken, reactionsRouter); // ✅
router.use('/comments', authenticateToken, commentsRouter); // ✅

// Export the router
module.exports = router;
