const { Op } = require('sequelize');

const {
	models: { User, Post, Favorites, Comments, Reactions, Upvotes },
} = require('../sequelize');

const { parseModel, notOwner } = require('../helpers/sequelize');

module.exports = {
	async getPosts(req, res, next) {
		let { page, limit } = req.query;
		try {
			let posts = await Post.findAll({
				include: [
					{
						model: Favorites,
						attributes: ['userId'],
					},
					{
						model: Comments,
						attributes: ['id', 'userId', 'content'],
						include: {
							model: Upvotes,
							attributes: ['userId'],
						},
					},
					{
						model: Reactions,
						attributes: ['userId', 'type'],
					},
				],
			});
			if (!posts || posts.length === 0) {
				return res
					.status(404)
					.json({ error: true, message: 'No posts found.' });
			}

			posts = posts.map((post) => parseModel(post));
			posts = posts.map((post) => ({
				...post,
				favorites: post.favorites
					.map((fav) => parseModel(fav))
					.map((fav) => fav.userId),
				comments: post.comments.map((comment) => parseModel(comment)),
			}));

			let info = {
				count: posts.length,
				pages: Math.floor(posts.length / limit) + 1,
				nextPage:
					page + 1 > Math.floor(posts.length / limit) + 1 ? null : page + 1,
				prevPage: page - 1 <= 0 ? null : page - 1,
			};

			posts = posts.splice((page - 1) * limit, limit);

			if (!posts || posts.length === 0) {
				return res
					.status(404)
					.json({ error: true, message: 'No posts found.' });
			}

			res.status(200).json({ info, results: posts });
		} catch (e) {
			next(e);
		}
	},
	async getPost(req, res, next) {
		const { id } = req.params;
		try {
			let post = await Post.findByPk(id, {
				include: [
					{
						model: Favorites,
						attributes: ['userId'],
					},
					{
						model: Comments,
						attributes: ['id', 'userId', 'content'],
					},
					{
						model: Reactions,
						attributes: ['userId', 'type'],
					},
				],
			});
			if (!post) {
				return res.status(404).json({ error: true, message: 'No post found.' });
			}

			post = parseModel(post);
			post = {
				...post,
				favorites: post.favorites
					.map((fav) => parseModel(fav))
					.map((fav) => fav.userId),
				comments: post.comments.map((comment) => parseModel(comment)),
			};
			res.status(200).json(post);
		} catch (e) {
			next(e);
		}
	},
	async createPost(req, res, next) {
		let { title, tags, content } = req.body;
		const userId = req.user.id;
		try {
			const post = await Post.create({
				title,
				tags,
				content,
				userId,
			});
			const user = await User.findByPk(userId);
			await user.addPost(post);

			res.status(200).json({ post, message: 'Post created successfully' });
		} catch (e) {
			next(e);
		}
	},
	async updatePost(req, res, next) {
		let { title, tags, content } = req.body;
		const { id } = req.params;
		const userId = req.user.id;
		try {
			const found = await Post.findByPk(id);
			if (!found) {
				return res.status(404).json({ error: true, message: 'Post not found' });
			}
			if (notOwner(userId, found)) {
				return res
					.status(401)
					.json({ error: true, message: 'You are not the owner of this post' });
			}
			const changes = await Post.update(
				{ title, tags, content },
				{ where: { id: { [Op.eq]: id } } }
			);
			req.changes = changes[0];
			req.type = 'Post';
			next();
		} catch (e) {
			next(e);
		}
	},
	async deletePost(req, res, next) {
		const { id } = req.params;
		const userId = req.user.id;
		try {
			const found = await Post.findByPk(id);
			if (!found) {
				return res.status(404).json({ error: true, message: 'Post not found' });
			}
			if (notOwner(userId, found)) {
				return res
					.status(401)
					.json({ error: true, message: 'You are not the owner of this post' });
			}
			const changes = await Post.destroy({
				where: { id: { [Op.eq]: id } },
			});
			req.changes = changes;
			req.type = 'Post';
			next();
		} catch (e) {
			next(e);
		}
	},
};
