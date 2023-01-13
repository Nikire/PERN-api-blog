const { Router } = require('express');
// Custom middlewares
const {
	validatePagination,
	validateParamId,
	validatePost,
	handleUpdate,
	handleDelete,
} = require('../helpers/express');

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
router.get('/', validatePagination, getPosts);
router.get('/:id', validateParamId('Post'), getPost);
router.post('/', validatePost('create'), createPost);
router.put('/:id', validatePost('update'), updatePost, handleUpdate);
router.delete('/:id', validateParamId('Post'), deletePost, handleDelete);

// Export the router
module.exports = router;
