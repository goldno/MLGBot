const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('displays the uptime of the bot!'),
	async execute(interaction) {
		const duration = moment.duration(interaction.client.uptime).format(' D [days], H [hrs], m [mins], s [sec]');
		await interaction.reply(duration);
	},
};
