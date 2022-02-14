const { SlashCommandBuilder } = require('@discordjs/builders');
const rank = require('../../resources/ranking.json');
const paginationEmbed = require('discordjs-button-pagination');
const { MessageEmbed, MessageButton } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Display the ranking leaderboard!'),
	async execute(interaction) {
        const ranking = rank.users;
        const server = interaction.guild;

        const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Previous')
            .setStyle('DANGER');
        const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Next')
            .setStyle('SUCCESS');
        const buttonList = [
            button1,
            button2
        ];
        const timeout = 60000;

        const pages = [];
        let k = 10;

        const fileData = fs.readFileSync('./resources/ranking.json', 'utf8');
		const jsonData = JSON.parse(fileData);
        const sortedRanking = jsonData.users.sort(function(a, b) { return b.score - a.score; });
        for (let i = 0; i < sortedRanking.length; i += 10) {
            const current = sortedRanking.slice(i, k);
            let j = i;
            k += 10;

            const info = current.map((user) => `${++j} - ${server.members.cache.get(user.id).displayName}    ${user.score}`).join('\n');

            const embed = new MessageEmbed()
                .setTitle('MLG Leaderboard\n')
                .setColor('#F8AA2A')
                .setDescription(`${info}`);
            pages.push(embed);
        }
        paginationEmbed(interaction, pages, buttonList, timeout);
        interaction.reply({ content: 'Displaying MLG Leaderboard' });
	},
};
