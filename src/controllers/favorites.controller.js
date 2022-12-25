const { findPostAndUser } = require('../helpers/sequelize');
const {
	models: { User, Post, Favorites },
} = require('../sequelize');
module.exports = {
	async addFavorite(req, res, next) {
		const { postId } = req.body;
		const userId = req.user.id;
		try {
			await Favorites.create({ postId, userId });
			res.status(200).json({ message: 'Added post to favorites' });
		} catch (e) {
			next(e);
		}
	},
	async removeFavorite(req, res, next) {
		const { postId } = req.body;
		const userId = req.user.id;
		try {
			await Favorites.destroy({ where: { userId, postId } });
			res.status(200).json({ message: 'Post removed from favorites' });
		} catch (e) {
			next(e);
		}
	},
};
