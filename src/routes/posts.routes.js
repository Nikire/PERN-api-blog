const { Router } = require('express');

//Controllers
const {
	getPosts,
	getPost,
	createPost,
	updatePost,
	deletePost,
} = require('../controllers/posts.controller');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Export the router
module.exports = router;
