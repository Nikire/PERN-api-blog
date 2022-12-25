const { Op } = require('sequelize');
const {
	models: { User, Post, Comments },
} = require('../sequelize');
module.exports = {
	async addComment(req, res, next) {
		const { postId, content } = req.body;
		const userId = req.user.id;
		try {
			if (!content) {
				return res
					.status(401)
					.json({ error: true, message: 'Content not provided.' });
			}
			//adding
			await Comments.create({ postId, userId, content });
			res.status(200).json({ message: 'Added comment' });
		} catch (e) {
			next(e);
		}
	},
	async removeComment(req, res, next) {
		const { postId } = req.body;
		const userId = req.user.id;
		try {
			await Comments.destroy({ where: { userId, postId } });
			res.status(200).json({ message: 'Comment removed' });
		} catch (e) {
			next(e);
		}
	},
	async changeComment(req, res, next) {
		const { postId, content } = req.body;
		const userId = req.user.id;
		try {
			if (!content) {
				return res
					.status(401)
					.json({ error: true, message: 'Content not provided.' });
			}
			//updating
			await Comments.update({ content }, { where: { userId, postId } });
			res.status(200).json({ message: 'Updated comment' });
		} catch (e) {
			next(e);
		}
	},
};
