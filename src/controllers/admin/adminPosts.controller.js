const { Op } = require('sequelize');

const {
	models: { Post },
} = require('../../sequelize');

module.exports = {
	async deletePost(req, res, next) {
		const { id } = req.params;
		try {
			if (!id || id === '') {
				return res
					.status(400)
					.json({ error: true, message: 'ID of post must be provided' });
			}
			const found = await Post.findByPk(id);
			if (!found) {
				return res.status(404).json({ error: true, message: 'Post not found' });
			}
			await Post.destroy({
				where: { id: { [Op.eq]: id } },
			});

			res.status(200).json({ message: 'Post deleted succesfully!' });
		} catch (e) {
			next(e);
		}
	},
	async updatePost(req, res, next) {
		const { id } = req.params;
		const { title, tags, content, disabled } = req.body;
		try {
			if (!id || id === '') {
				return res
					.status(400)
					.json({ error: true, message: 'ID of post must be provided' });
			}
			const found = await Post.findByPk(id);
			if (!found) {
				return res.status(404).json({ error: true, message: 'Post not found' });
			}
			await Post.update(
				{ title, tags, content, disabled },
				{ where: { id: { [Op.eq]: id } } }
			);
			res.status(200).json({ message: 'Post updated succesfully!' });
		} catch (e) {
			next(e);
		}
	},
};
