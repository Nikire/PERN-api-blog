const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
	models: { User },
} = require('../sequelize');
module.exports = {
	async login(req, res, next) {
		try {
			const { username, password } = req.body;
			const finded = await User.findOne({ where: { username } });
			if (!finded) return res.status(404).json({ message: 'User not found' });
			let hash = finded.password;
			bcrypt.compare(password, hash, function (err, result) {
				if (err) return res.status(500).json({ error: err });
				if (!result)
					return res
						.status(401)
						.json({ message: 'Unauthorized, password is incorrect' });
				// Verify that the user exists
				const user = { username, password };
				const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN, {
					expiresIn: '30m',
				});
				res
					.header('authorization', accessToken)
					.json({ accessToken, message: 'User authenticated' });
			});
		} catch (e) {
			next(e);
		}
	},
};
