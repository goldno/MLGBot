const { SlashCommandBuilder } = require('@discordjs/builders');
const rank = require('../../resources/ranking.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setall')
		.setDescription('Set all score values!')
		.addIntegerOption(option => option.setName('int').setDescription('Enter an integer')),
	async execute(interaction) {
        const integer = interaction.options.getInteger('int');
        const fileData = fs.readFileSync('./resources/ranking.json', 'utf8');
		const jsonData = JSON.parse(fileData);
		jsonData.users.forEach(u => u.score = integer);
		fs.writeFileSync('./resources/ranking.json', JSON.stringify(jsonData, null, '\t'));
		await interaction.reply(`Set all scores with ${integer}`);
	},
};
