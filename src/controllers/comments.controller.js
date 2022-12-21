const { Op } = require('sequelize');
const {
	models: { User, Post, Comments },
} = require('../sequelize');
module.exports = {
	async addComment(req, res, next) {
		const { postId, userId, content } = req.body;
		try {
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!content)
				return res.status(400).json({ message: 'Content not provided' });
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });
			//adding
			await Comments.create({ postId, userId, content });
			res.status(200).json({ message: 'Added comment' });
		} catch (e) {
			next(e);
		}
	},
	async removeComment(req, res, next) {
		const { postId, userId } = req.body;
		try {
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });
			//removing
			await Comments.destroy({ where: { userId, postId } });
			res.status(200).json({ message: 'Comment removed' });
		} catch (e) {
			next(e);
		}
	},
	async changeComment(req, res, next) {
		const { postId, userId, content } = req.body;
		try {
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!content)
				return res.status(400).json({ message: 'Content not provided' });
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });

			//removing
			await Comments.update({ content }, { where: { userId, postId } });
			res.status(200).json({ message: 'Updated comment' });
		} catch (e) {
			next(e);
		}
	},
};
