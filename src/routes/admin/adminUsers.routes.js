const { Router } = require('express');
//Controllers
const {
	deleteUser,
	updateUser,
} = require('../../controllers/admin/adminUsers.controller.js');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

// Export the router
module.exports = router;
