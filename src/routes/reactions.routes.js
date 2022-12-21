const { Router } = require('express');
//Controllers
const {
	addReaction,
	changeReaction,
	removeReaction,
} = require('../controllers/reactions.controller');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.post('/', addReaction);
router.put('/', changeReaction);
router.delete('/', removeReaction);

// Export the router
module.exports = router;
