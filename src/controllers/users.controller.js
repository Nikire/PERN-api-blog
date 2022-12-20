const bcrypt = require('bcrypt');

const { Op } = require('sequelize');
const {
	models: { User, Post },
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
				include: {
					model: Post,
					attributes: ['id', 'title'],
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
			const user = await User.findByPk(id, {
				include: {
					model: Post,
					attributes: ['id', 'title'],
				},
			});
			res.status(200).json(user);
		} catch (e) {
			next(e);
		}
	},
	async createUser(req, res, next) {
		const { username, email, name } = req.body;
		let { password } = req.body;
		try {
			bcrypt.genSalt(10, async (err, salt) => {
				if (err) return res.send(err);
				bcrypt.hash(password, salt, async (err, hash) => {
					if (err) return res.send(err);
					password = hash;
					const user = await User.create({
						username,
						email,
						password,
						name,
					});
					res.status(200).json(user);
				});
			});
		} catch (e) {
			next(e);
		}
	},
	async updateUser(req, res, next) {
		const { id } = req.params;
		const { username, email, name } = req.body;
		try {
			const userModified = await User.update(
				{ username, email, name },
				{ where: { id: { [Op.eq]: id } } }
			);
			res.status(200).json(userModified);
		} catch (e) {
			next(e);
		}
	},
	async deleteUser(req, res, next) {
		const { id } = req.params;
		try {
			const userModified = await User.destroy({
				where: { id: { [Op.eq]: id } },
			});
			res.status(204).json(userModified);
		} catch (e) {
			next(e);
		}
	},
};
