const { Op } = require('sequelize');

const {
	models: { User, Post, Favorites, Comments, Reactions, Upvotes },
} = require('../sequelize');

const { parseModel, notOwner } = require('../helpers/sequelize');

module.exports = {
	async getPosts(req, res, next) {
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

			res.status(200).json(posts);
		} catch (e) {
			next(e);
		}
	},
	async getPost(req, res, next) {
		const { id } = req.params;
		try {
			if (!id || id === '') {
				return res
					.status(400)
					.json({ error: true, message: 'ID of post must be provided' });
			}
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
		const { id } = req.user;
		try {
			if (!tags || !tags.length) {
				tags = [];
			}
			if (!title || !content) {
				return res
					.status(400)
					.json({ error: true, message: 'All fields must be filled' });
			}

			const post = await Post.create({
				title,
				tags,
				content,
				userId: id,
			});
			const user = await User.findByPk(id);

			await user.addPost(post);
			res.status(200).json(post);
		} catch (e) {
			next(e);
		}
	},
	async updatePost(req, res, next) {
		let { title, tags, content } = req.body;
		const { id } = req.params;
		const userId = req.user.id;
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
				{ title, tags, content },
				{ where: { id: { [Op.eq]: id } } }
			);
			if (notOwner(userId, found)) {
				return res
					.status(401)
					.json({ error: true, message: 'You are not the owner of this post' });
			}
			res.status(200).json({ message: 'Post updated succesfully!' });
		} catch (e) {
			next(e);
		}
	},
	async deletePost(req, res, next) {
		const { id } = req.params;
		const userId = req.user.id;
		try {
			if (!id || id === '') {
				return res
					.status(400)
					.json({ error: true, message: 'ID of post must be provided' });
			}
			const found = await Post.findByPk(id);
			if (notOwner(userId, found)) {
				return res
					.status(401)
					.json({ error: true, message: 'You are not the owner of this post' });
			}
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
};
