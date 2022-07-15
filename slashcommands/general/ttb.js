const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ttb')
		.setDescription('Have the bot send text!')
		.addStringOption(text => text.setName('input').setDescription('Enter a string').setRequired(true)),
	async execute(interaction) {
		const string = interaction.options.getString('input');
		await interaction.reply({ content: 'Text sent to MLGBot!', ephemeral: true });
		interaction.channel.send(string);
	},
};
