const { Router } = require('express');
//Controllers
const {
	deletePost,
	updatePost,
} = require('../../controllers/admin/adminPosts.controller.js');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.delete('/:id', deletePost);
router.put('/:id', updatePost);

// Export the router
module.exports = router;
