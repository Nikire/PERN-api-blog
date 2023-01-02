const { Router } = require('express');
//Auth
const {
	authenticateToken,
	validateParamId,
	validateSearch,
	validateUser,
	handleUpdate,
	handleDelete,
} = require('../helpers/express');

//Controllers
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/users.controller');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.get('/', authenticateToken, validateSearch, getUsers);
router.get('/:id', authenticateToken, validateParamId('User'), getUser);
router.post('/', validateUser('create'), createUser);
router.put(
	'/:id',
	authenticateToken,
	validateParamId('User'),
	validateUser('update'),
	updateUser,
	handleUpdate
);
router.delete(
	'/:id',
	authenticateToken,
	validateParamId('User'),
	deleteUser,
	handleDelete
);

// Export the router
module.exports = router;
