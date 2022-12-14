const jwt = require('jsonwebtoken');
module.exports = {
	async login(req, res, next) {
		try {
			const { username, password } = req.body;
			// Verify that the user exists
			const user = { username, password };
			const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN, {
				expiresIn: '30s',
			});
			res
				.header('authorization', accessToken)
				.json({ accessToken, message: 'User authenticated' });
		} catch (e) {
			next(e);
		}
	},
};
