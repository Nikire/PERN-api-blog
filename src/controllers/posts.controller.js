const { Op } = require('sequelize');

const {
	models: { User, Post, Favorites },
} = require('../sequelize');

module.exports = {
	async getPosts(req, res, next) {
		try {
			const posts = await Post.findAll({
				include: {
					model: Favorites,
					attributes: ['userId'],
				},
			});
			res.status(200).json(posts);
		} catch (e) {
			next(e);
		}
	},
	async getPost(req, res, next) {
		const { id } = req.params;
		try {
			const post = await Post.findByPk(id, {
				include: {
					model: Favorites,
					attributes: ['userId'],
				},
			});
			res.status(200).json(post);
		} catch (e) {
			next(e);
		}
	},
	async createPost(req, res, next) {
		const { title, tags, content, userId } = req.body;
		try {
			const post = await Post.create({
				title,
				tags,
				content,
				userId,
			});
			const user = await User.findByPk(userId);
			await user.addPost(post);
			res.status(200).json(post);
		} catch (e) {
			next(e);
		}
	},
	async updatePost(req, res, next) {
		let { title, tags, content } = req.body;
		const { id } = req.params;
		try {
			const postModified = await Post.update(
				{ title, tags, content },
				{ where: { id: { [Op.eq]: id } } }
			);
			res.status(200).json(postModified);
		} catch (e) {
			next(e);
		}
	},
	async deletePost(req, res, next) {
		const { id } = req.params;
		try {
			const postModified = await Post.destroy({
				where: { id: { [Op.eq]: id } },
			});
			res.status(204).json(postModified);
		} catch (e) {
			next(e);
		}
	},
};
