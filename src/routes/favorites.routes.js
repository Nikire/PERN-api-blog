const { Router } = require('express');
//Controllers
const {
	addFavorite,
	removeFavorite,
} = require('../controllers/favorites.controller');
// Create an instance of the express router
const router = Router();

// Set up the routes
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);

// Export the router
module.exports = router;
