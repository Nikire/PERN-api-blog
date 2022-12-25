const jwt = require('jsonwebtoken');
const { findPostAndUser } = require('./sequelize');

const {
	models: { User, Post },
} = require('../sequelize');

module.exports = {
	errorHandler: () => (err, req, res, next) => {
		const status = err.status || 500;
		const message = err.message || err;
		console.error(err);
		res.status(status).send(message);
	},
	authenticateToken: (req, res, next) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) return res.status(401).json({ message: 'No token provided' });

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
			console.log('validating');
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
			res.status(500).json({ error: true, message: err.message });
		}
	},
};
