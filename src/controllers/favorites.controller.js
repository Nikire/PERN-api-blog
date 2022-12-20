const { Op } = require('sequelize');
const {
	models: { User, Post, Favorites },
} = require('../sequelize');
module.exports = {
	async addFavorite(req, res, next) {
		const { postId, userId } = req.body;
		try {
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });
			//adding
			await Favorites.create({ postId, userId });
			res.status(200).json({ message: 'Added post to favorites' });
		} catch (e) {
			next(e);
		}
	},
	async removeFavorite(req, res, next) {
		const { postId, userId } = req.body;
		try {
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });
			//removing
			await Favorites.destroy({ where: { userId, postId } });
			res.status(200).json({ message: 'Post removed from favorites' });
		} catch (e) {
			next(e);
		}
	},
};
