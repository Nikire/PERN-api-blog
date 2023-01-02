const jwt = require('jsonwebtoken');
const { findPostAndUser, findCommentAndUser } = require('./sequelize');

const {
	models: { User, Post, Comments },
} = require('../sequelize');

// Middlewares
module.exports = {
	errorHandler: () => (err, req, res, next) => {
		const status = err.status || 500;
		const message = err.message || err;
		console.error('ERROR', err);
		res.status(status).json({ error: true, message });
	},
	authenticateToken: (req, res, next) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token)
			return res
				.status(401)
				.json({ error: true, message: 'No token provided' });

		jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, { user }) => {
			if (err) return res.status(403).json(err);
			req.user = user;
			next();
		});
	},
	validateUserAndPost: async (req, res, next) => {
		const { postId } = req.body;
		const userId = req.user.id;
		try {
			console.log('VALIDATING USER AND POST');
			if (!postId) {
				return res
					.status(401)
					.json({ error: true, message: 'Post ID must be provided.' });
			}
			if (!userId) {
				return res
					.status(401)
					.json({ error: true, message: 'User ID must be provided.' });
			}
			const [post, user] = await findPostAndUser(postId, userId, Post, User);

			if (!post) {
				return res
					.status(404)
					.json({ error: true, message: 'Post not found.' });
			}
			if (!user) {
				return res
					.status(404)
					.json({ error: true, message: 'User not found.' });
			}
			next();
		} catch (err) {
			return res.status(500).json({ error: true, message: err.message });
		}
	},
	validateUserAndComment: async (req, res, next) => {
		const { commentId } = req.body;
		const userId = req.user.id;
		try {
			if (!commentId) {
				return res
					.status(401)
					.json({ error: true, message: 'Comment ID must be provided.' });
			}
			if (!userId) {
				return res
					.status(401)
					.json({ error: true, message: 'User ID must be provided.' });
			}
			const [comment, user] = await findCommentAndUser(
				commentId,
				userId,
				Comments,
				User
			);

			if (!comment) {
				return res
					.status(404)
					.json({ error: true, message: 'Comment not found.' });
			}
			if (!user) {
				return res
					.status(404)
					.json({ error: true, message: 'User not found.' });
			}
			next();
		} catch (err) {
			return res.status(500).json({ error: true, message: err.message });
		}
	},
	isAdmin: async (req, res, next) => {
		const userId = req.user.id;
		const adminStatus = req.user.admin;
		try {
			if (!userId) {
				return res
					.status(401)
					.json({ error: true, message: 'User ID is not provided.' });
			}

			const found = await User.findByPk(userId);

			if (!found) {
				return res
					.status(404)
					.json({ error: true, message: 'User not found.' });
			}

			if (!found.dataValues.admin || !adminStatus) {
				return res.status(401).json({
					error: true,
					message: 'User is not authorized for this route.',
				});
			}

			next();
		} catch (err) {
			return res.status(500).json({ error: true, message: err.message });
		}
	},
	validatePagination: async (req, res, next) => {
		let { page, limit } = req.query;
		try {
			if (!page || page < 1) {
				page = 1;
			}
			if (!limit || limit < 1) {
				limit = 10;
			}
			console.log(page, limit);
			page = parseInt(page);
			limit = parseInt(limit);

			if (Number.isNaN(page)) {
				return res
					.status(400)
					.json({ error: true, message: 'Bad request, page must be a number' });
			}
			if (Number.isNaN(limit)) {
				return res.status(400).json({
					error: true,
					message: 'Bad request, limit must be a number',
				});
			}

			if (limit > 50) {
				limit = 50;
			}

			req.query.limit = limit;
			req.query.page = page;

			next();
		} catch (err) {
			return res.status(500).json({ error: true, message: err.message });
		}
	},
	validateParamId:
		(idName = '') =>
		async (req, res, next) => {
			let { id } = req.params;
			try {
				if (!id || id === '') {
					return res.status(400).json({
						error: true,
						message: `${idName ? `ID of ${idName}` : 'ID'} must be provided.`,
					});
				}
				next();
			} catch (err) {
				return res.status(500).json({ error: true, message: err.message });
			}
		},
	handleUpdate: (req, res, next) => {
		let { changes, type = 'Fields' } = req;
		try {
			let message =
				changes === 1
					? `${type} updated successfully!`
					: `${changes} ${type} were updated!`;
			return changes === 0 || !changes
				? res.status(200).json({ message: 'No changes were applied.' })
				: res.status(200).json({ message });
		} catch (e) {
			next(e);
		}
	},
	handleDelete: (req, res, next) => {
		let { changes, type = 'Fields' } = req;
		try {
			let message =
				changes === 1
					? `${type} deleted successfully!`
					: `${changes} ${type} were deleted!`;
			return changes === 0 || !changes
				? res.status(200).json({ message: 'No changes were applied.' })
				: res.status(200).json({ message });
		} catch (e) {
			next(e);
		}
	},
	validatePost:
		(type = '') =>
		async (req, res, next) => {
			// req.body = {tags,content,title}
			try {
				// type validation
				if (!type || type === '') {
					return res.status(400).json({
						error: true,
						message: 'Type of validation must be provided.',
					});
				}
				if (!['update', 'create'].includes(type)) {
					return res
						.status(400)
						.json({ error: true, message: 'Invalid type of validation.' });
				}
				// input types validation
				if (req.body.title && typeof req.body.title === 'string') {
					req.body.title = req.body.title.trim();
				} else if (req.body.title && typeof req.body.title !== 'string') {
					return res
						.status(400)
						.json({ error: true, message: 'Invalid title type.' });
				}
				if (req.body.content && typeof req.body.content === 'string') {
					req.body.content = req.body.content.trim();
				} else if (req.body.content && typeof req.body.content !== 'string') {
					return res
						.status(400)
						.json({ error: true, message: 'Invalid content type.' });
				}
				if (
					!req.body.tags ||
					!req.body.tags.length ||
					!Array.isArray(req.body.tags)
				) {
					req.body.tags = [];
				}

				switch (type) {
					case 'create': {
						if (!req.body.title || req.body.title === '') {
							return res
								.status(400)
								.json({ error: true, message: 'Title field must be filled' });
						}
						if (!req.body.content || req.body.content === '') {
							return res
								.status(400)
								.json({ error: true, message: 'Content field must be filled' });
						}
						break;
					}
					case 'update': {
						if (!req.body.title) {
							req.body.title = '';
						}
						if (!req.body.content) {
							req.body.content = '';
						}
						break;
					}
					default:
						break;
				}
				let titleRegEx = /^[a-zA-Z0-9\s\,\.\:\'\?\¿\¡\!\"\/]{1,50}$/i;
				let contentRegEx = /^[A-Za-z0-9\s\,\.\:\'\?\¿\¡\!\"\/\<\>]{10,5000}$/i;
				//RegEx
				if (req.body.title && !titleRegEx.test(req.body.title)) {
					return res.status(400).json({
						error: true,
						message:
							'Invalid title, please enter a valid title (must be valid characters and be maximum length of 50)',
					});
				}
				if (req.body.content && !contentRegEx.test(req.body.content)) {
					return res.status(400).json({
						error: true,
						message:
							'Invalid content, please enter a valid content (must be valid characters and 10-5000 characters length)',
					});
				}
				next();
			} catch (err) {
				return res.status(500).json({ error: true, message: err.message });
			}
		},
};
