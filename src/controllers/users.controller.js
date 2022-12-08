const { Op } = require('sequelize');

const {
	models: { User },
} = require('../sequelize');

module.exports = {
	async getUsers(req, res, next) {
		let { name, email, username } = req.query;
		if (!name) name = '';
		if (!email) email = '';
		if (!username) username = '';
		try {
			const users = await User.findAll({
				where: {
					name: { [Op.iLike]: `%${name}%` },
					email: { [Op.iLike]: `%${email}%` },
					username: { [Op.iLike]: `%${username}%` },
				},
			});
			res.status(200).json(users);
		} catch (e) {
			next(e);
		}
	},
	async getUser(req, res, next) {
		const { id } = req.params;
		try {
			const user = await User.findByPk(id);
			res.status(200).json(user);
		} catch (e) {
			next(e);
		}
	},
	async createUser(req, res, next) {
		const { username, email, name } = req.body;
		try {
			const user = await User.create({
				username,
				email,
				name,
			});
			res.status(200).json(user);
		} catch (e) {
			next(e);
		}
	},
	async updateUser(req, res, next) {
		const { id } = req.params;
		const { username, email, name } = req.body;
		try {
			const usersModified = await User.update(
				{ username, email, name },
				{ where: { id: { [Op.eq]: id } } }
			);
			res.status(200).json(usersModified);
		} catch (e) {
			next(e);
		}
	},
	async deleteUser(req, res, next) {
		const { id } = req.params;
		try {
			const usersModified = await User.destroy({
				where: { id: { [Op.eq]: id } },
			});
			res.status(200).json(usersModified);
		} catch (e) {
			next(e);
		}
	},
};
