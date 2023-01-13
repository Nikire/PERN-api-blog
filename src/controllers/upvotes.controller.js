const { Op } = require('sequelize');
const {
	models: { Upvotes },
} = require('../sequelize');
module.exports = {
	async addUpvote(req, res, next) {
		const { commentId } = req.body;
		const userId = req.user.id;
		try {
			exists = await Upvotes.findOne({
				where: {
					[Op.and]: [
						{ userId: { [Op.eq]: userId } },
						{ commentId: { [Op.eq]: commentId } },
					],
				},
			});
			if (exists) {
				return res
					.status(400)
					.json({ error: true, message: 'Already Upvoted' });
			}
			await Upvotes.create({ commentId, userId });
			res.status(200).json({ message: 'Added upvote' });
		} catch (e) {
			next(e);
		}
	},
	async removeUpvote(req, res, next) {
		const { commentId } = req.body;
		const userId = req.user.id;
		try {
			exists = await Upvotes.findOne({
				where: {
					[Op.and]: [
						{ userId: { [Op.eq]: userId } },
						{ commentId: { [Op.eq]: commentId } },
					],
				},
			});
			if (!exists) {
				return res
					.status(404)
					.json({ error: true, message: 'No Upvote found' });
			}
			await Upvotes.destroy({ where: { userId, commentId } });
			res.status(200).json({ message: 'Upvote removed' });
		} catch (e) {
			next(e);
		}
	},
};
