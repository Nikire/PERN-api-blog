const { Router } = require('express');
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
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Export the router
module.exports = router;
