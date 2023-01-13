const { Op } = require('sequelize');
const {
	models: { User, Post, Reactions },
} = require('../sequelize');
module.exports = {
	async addReaction(req, res, next) {
		const { postId, type } = req.body;
		const userId = req.user.id;
		try {
			let types = ['like', 'sad', 'love'];
			if (!type) {
				return res
					.status(401)
					.json({ error: true, message: 'Type must be provided.' });
			}
			if (!types.includes(type))
				return res
					.status(404)
					.json({ error: true, message: 'Type not found in possible types.' });
			//adding
			await Reactions.create({ postId, userId, type });
			res.status(200).json({ message: 'Added post to Reactions' });
		} catch (e) {
			next(e);
		}
	},
	async removeReaction(req, res, next) {
		const { postId } = req.body;
		const userId = req.user.id;
		try {
			await Reactions.destroy({ where: { userId, postId } });
			res.status(200).json({ message: 'Removed reaction' });
		} catch (e) {
			next(e);
		}
	},
	async changeReaction(req, res, next) {
		const { postId, type } = req.body;
		const userId = req.user.id;
		try {
			let types = ['like', 'sad', 'love'];
			if (!type) {
				return res
					.status(401)
					.json({ error: true, message: 'Type must be provided.' });
			}
			if (!types.includes(type))
				return res
					.status(404)
					.json({ error: true, message: 'Type not found in possible types.' });
			if (!types.includes(type))
				return res
					.status(404)
					.json({ message: 'Type not found in possible types' });
			//Updating
			await Reactions.update({ type }, { where: { userId, postId } });
			res.status(200).json({ message: 'Updated reaction' });
		} catch (e) {
			next(e);
		}
	},
};
