const { Op } = require('sequelize');

const {
	models: { User },
} = require('../../sequelize');

module.exports = {
	async updateUser(req, res, next) {
		const { id } = req.params;
		const { username, email, name, admin, status } = req.body;
		try {
			const found = await User.findByPk(id);

			if (!found) {
				return res
					.status(404)
					.json({ error: true, message: 'User does not exist.' });
			}
			await User.update(
				{ username, email, name, admin, status },
				{ where: { id: { [Op.eq]: id } } }
			);

			res.status(200).json({ message: 'User updated successfully!' });
		} catch (e) {
			next(e);
		}
	},
	async deleteUser(req, res, next) {
		const { id } = req.params;
		try {
			const found = await User.findByPk(id);
			if (!found) {
				return res
					.status(404)
					.json({ error: true, message: 'User does not exist.' });
			}

			await User.destroy({
				where: { id: { [Op.eq]: id } },
			});

			res.status(204).json({ message: 'User deleted successfully!' });
		} catch (e) {
			next(e);
		}
	},
};
