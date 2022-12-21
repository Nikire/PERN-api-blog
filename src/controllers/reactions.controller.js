const { Op } = require('sequelize');
const {
	models: { User, Post, Reactions },
} = require('../sequelize');
module.exports = {
	async addReaction(req, res, next) {
		const { postId, userId, type } = req.body;
		try {
			let types = ['like', 'sad', 'love'];
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });
			if (!types.includes(type))
				return res
					.status(404)
					.json({ message: 'Type not found in possible types' });
			//adding
			await Reactions.create({ postId, userId, type });
			res.status(200).json({ message: 'Added post to Reactions' });
		} catch (e) {
			next(e);
		}
	},
	async removeReaction(req, res, next) {
		const { postId, userId } = req.body;
		try {
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });
			//removing
			await Reactions.destroy({ where: { userId, postId } });
			res.status(200).json({ message: 'Removed reaction' });
		} catch (e) {
			next(e);
		}
	},
	async changeReaction(req, res, next) {
		const { postId, userId, type } = req.body;
		try {
			let types = ['like', 'sad', 'love'];
			const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
			const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
			//validate
			if (!post) return res.status(404).json({ message: 'Post not found' });
			if (!user) return res.status(404).json({ message: 'User not found' });
			if (!types.includes(type))
				return res
					.status(404)
					.json({ message: 'Type not found in possible types' });
			//removing
			await Reactions.update({ type }, { where: { userId, postId } });
			res.status(200).json({ message: 'Updated reaction' });
		} catch (e) {
			next(e);
		}
	},
};
