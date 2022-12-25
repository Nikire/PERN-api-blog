let users = require('../media/JSON/users.json');
const { Op } = require('sequelize');
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
	async findPostAndUser(postId, userId, Post, User) {
		const post = await Post.findOne({ where: { id: { [Op.eq]: postId } } });
		const user = await User.findOne({ where: { id: { [Op.eq]: userId } } });
		return [post, user];
	},
};
