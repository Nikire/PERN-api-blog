const jwt = require('jsonwebtoken');
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
};
