const { Router } = require('express');
//Auth
const { authenticateToken } = require('../helpers/express');

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
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);
router.post('/', createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

// Export the router
module.exports = router;
