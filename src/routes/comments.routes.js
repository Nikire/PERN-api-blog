const { Router } = require('express');
//Controllers
const {
	addComment,
	removeComment,
	changeComment,
} = require('../controllers/comments.controller');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.post('/', addComment);
router.put('/', changeComment);
router.delete('/', removeComment);

// Export the router
module.exports = router;
