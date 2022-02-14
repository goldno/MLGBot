const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addMentionableOption(option => option.setName('mentionable').setDescription('Mention something')),
	async execute(interaction) {
		const mentionable = interaction.options.getMentionable('mentionable');
		await interaction.reply('Pong!');
		console.log(mentionable);
	},
};
