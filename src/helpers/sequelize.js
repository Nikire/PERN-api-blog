let users = require('../media/JSON/users.json');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = {
	async testConnection(sequelize) {
		try {
			await sequelize.authenticate();
			console.log('Connection of Sequelize has been established successfully.');
		} catch (error) {
			console.error('Unable to connect Sequelize to the database:', error);
		}
	},
	async loadDB({ User }) {
		users = users.map(({ email, username, password, name }) => ({
			email,
			username,
			password,
			name,
		}));
		await User.bulkCreate(users);
	},
	parseModel(model) {
		return { ...model.dataValues };
	},
	notOwner(userId, post) {
		return userId !== post.dataValues.userId ? true : false;
	},
	async findCommentAndUser(commentId, userId, Comments, User) {
		const comment = await Comments.findOne({
			where: { id: { [Op.eq]: commentId } },
		});
		const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
		return [comment, user];
	},
	async findPostAndUser(postId, userId, Post, User) {
		const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
		const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
		return [post, user];
	},
	async createBaseAdmin(
		User,
		ADMIN_NAME,
		ADMIN_PASSWORD,
		ADMIN_USERNAME,
		ADMIN_EMAIL
	) {
		try {
			bcrypt.genSalt(10, async (err, salt) => {
				if (err) return res.send(err);
				bcrypt.hash(ADMIN_PASSWORD, salt, async (err, hash) => {
					if (err) return res.send(err);
					ADMIN_PASSWORD = hash;
					await User.create({
						name: ADMIN_NAME,
						email: ADMIN_EMAIL,
						username: ADMIN_USERNAME,
						password: ADMIN_PASSWORD,
						admin: true,
					});
				});
			});
		} catch (e) {
			console.error(e.message);
			return e;
		}
	},
};
