const bcrypt = require('bcrypt');

const { Op } = require('sequelize');

const {
	models: { User, Post, Favorites, Reactions },
} = require('../sequelize');

const { parseModel } = require('../helpers/sequelize');

module.exports = {
	async getUsers(req, res, next) {
		let { name, email, username } = req.query;
		if (!name) name = '';
		if (!email) email = '';
		if (!username) username = '';
		try {
			let users = await User.findAll({
				where: {
					name: { [Op.iLike]: `%${name}%` },
					email: { [Op.iLike]: `%${email}%` },
					username: { [Op.iLike]: `%${username}%` },
				},
				attributes: ['id', 'name', 'email', 'username'],
				include: [
					{
						model: Post,
						attributes: ['id', 'title'],
					},
					{
						model: Favorites,
						attributes: ['postId'],
					},
					{
						model: Reactions,
						attributes: ['postId', 'type'],
					},
				],
			});

			if (!users || !users.length) {
				return res
					.status(404)
					.json({ error: true, message: 'No users found.' });
			}

			users = users.map((user) => parseModel(user));
			users = users.map((user) => ({
				...user,
				favorites: user.favorites
					.map((fav) => parseModel(fav))
					.map((fav) => fav.postId),
			}));
			res.status(200).json(users);
		} catch (e) {
			next(e);
		}
	},
	async getUser(req, res, next) {
		const { id } = req.params;
		try {
			if (!id || id === '') {
				return res
					.status(400)
					.json({ error: true, message: 'ID must be provided.' });
			}

			const user = await User.findByPk(id, {
				attributes: ['id', 'name', 'email', 'username'],
				include: [
					{
						model: Post,
						attributes: ['id', 'title'],
					},
					{
						model: Favorites,
						attributes: ['postId'],
					},
					{
						model: Reactions,
						attributes: ['postId', 'type'],
					},
				],
			});
			if (!user) {
				return res.status(404).json({ error: true, message: 'No user found.' });
			}
			res.status(200).json(user);
		} catch (e) {
			next(e);
		}
	},
	async createUser(req, res, next) {
		const { username, email, name } = req.body;
		let { password } = req.body;
		try {
			if (!username || !email || !name || !password) {
				return res
					.status(400)
					.json({ error: true, message: 'Every field must be provided.' });
			}

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
		const userId = req.user.id;
		try {
			if (userId !== id) {
				return res
					.status(401)
					.json({ error: true, message: 'User cannot update other users.' });
			}
			const found = await User.findByPk(id);

			if (!found) {
				return res
					.status(404)
					.json({ error: true, message: 'User does not exist.' });
			}
			await User.update(
				{ username, email, name },
				{ where: { id: { [Op.eq]: id } } }
			);

			res.status(200).json({ message: 'User updated successfully!' });
		} catch (e) {
			next(e);
		}
	},
	async deleteUser(req, res, next) {
		const { id } = req.params;
		const userId = req.user.id;
		try {
			if (userId !== id) {
				return res
					.status(401)
					.json({ error: true, message: 'User cannot delete other users.' });
			}

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
