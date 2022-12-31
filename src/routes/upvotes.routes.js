const { Router } = require('express');
//Controllers
const {
	addUpvote,
	removeUpvote,
} = require('../controllers/upvotes.controller');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.post('/', addUpvote);
router.delete('/', removeUpvote);

// Export the router
module.exports = router;
