const { SlashCommandBuilder } = require('@discordjs/builders');
const rank = require('../../resources/ranking.json');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('challenge')
		.setDescription('challenge another member to a duel')
		.addMentionableOption(option => option.setName('mentionable').setDescription('Mention something')),
	async execute(interaction) {
		const c1 = interaction.member;
		const c2 = interaction.options.getMentionable('mentionable');
		if(!c2) return interaction.channel.send(`<@${c1.id}>, You must mention a member to challenge!`);
		if(c1.id == c2.id && c1.id != '90182872316510208') return interaction.channel.send(`<@${c1.id}>, You cannot challenge yourself!`);

		// Get ranking data from JSON file
		const ranking = rank.users;
		const fileData = fs.readFileSync('./resources/ranking.json', 'utf8');
		const jsonData = JSON.parse(fileData);
		const c1CurrentScore = jsonData.users.find(c => c.id === c1.id).score;
		const c1scoreOld = c1CurrentScore;
		const c2CurrentScore = jsonData.users.find(c => c.id === c2.id).score;
		const c2scoreOld = c2CurrentScore;
        const server = interaction.guild;

		// Function to calculate the Probability
		const probability = (r1, r2) => {
            return 1.0 * 1.0 / (1 + 1.0 * Math.pow(10, 1.0 * (r1 - r2) / 400));
        };
		// Function to calculate Elo rating
		// K is a constant.
		// d determines whether
		const constant = 30;
		const eloRating = (r1, r2, k, d) => {
			const Pc1 = probability(r1, r2);
			const Pc2 = probability(r2, r1);
			let c1Elo = 0;
			let c2Elo = 0;
			if(d == 1) {
				c1Elo = Math.round(c1CurrentScore + k * (1 - Pc1));
				c2Elo = Math.round(c2CurrentScore + k * (0 - Pc2));
				return [c1Elo, c2Elo];
			} else {
				c1Elo = Math.round(c1CurrentScore + k * (0 - Pc1));
				c2Elo = Math.round(c2CurrentScore + k * (1 - Pc2));
				return [c1Elo, c2Elo];
			}
		};

		// Create accept/decline buttons
		const accept = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('accept')
					.setLabel('Accept')
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('decline')
					.setLabel('Decline')
					.setStyle('DANGER')
			);
		// Create select winner buttons
		const winnerSelection = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('c1win')
					.setLabel(`${c1.displayName}`)
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('c2win')
					.setLabel(`${c2.displayName}`)
					.setStyle('SUCCESS')
			);

		// server.members.cache.forEach(m => {
		// 	accept.components[0].setDisabled(true);
		// 	accept.components[1].setDisabled(true);
		// 	winnerSelection.components[0].setDisabled(true);
		// 	winnerSelection.components[1].setDisabled(true);
		// });

		// Create duel embeds
		const embedStart = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Duel\n')
			.setDescription('This is a new duel! Please 1v1 in your selection of game and determine a winner.');
		const embedSelectWinner = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Select Winner\n')
			.setDescription('You have 30 minutes to carry out the 1v1 in your selection of game. Then select the correct winner button. (Only the user who initiated the challenge can see the buttons, so please choose who actually won, or you\'re just cringe and will not be able to play)');

		// 1st interaction reply
		await interaction.reply({
			content: `<@${c2.id}>, You have been challenged to a duel by <@${c1.id}>. You have 60 seconds to accept.`,
			components: [accept],
		});

		// 1st button interaction collector
		const filterAccept = i => i.customId === 'accept' && i.user.id === c2.id;
		const collectorAccept = interaction.channel.createMessageComponentCollector({
			filterAccept,
			time: 60000
		});
		collectorAccept.on('collect', async i => {
			if(i.customId === 'accept' && i.user.id === c2.id) {
				await i.update({ content: `<@${c2.id}> Accepted`, components: [] });
				collectorAccept.stop();
			}
			if (i.customId === 'decline' && i.user.id === c2.id) {
				await i.update({ content: `<@${c2.id}> Declined`, components: [] });
				collectorAccept.stop();
			}
		});
		collectorAccept.on('end', collectionAccept => {
			collectionAccept.forEach(clickAccept => {
				if(collectionAccept.first().customId === 'accept') {
					interaction.deleteReply();

					// 2nd ineraction reply
					interaction.followUp({
						components: [winnerSelection],
						embeds: [embedSelectWinner],
						ephemeral: true
					});

					// 2nd button interaction collector
					const filterSelectWinner = i => i.customId === 'c1Win' && (i.user.id === c1.id || i.user.id === c2.id);
					const collectorSelectWinner = interaction.channel.createMessageComponentCollector({
						filterSelectWinner,
						time: 1800000
					});
					collectorSelectWinner.on('collect', async i => {
						if(i.customId === 'c1win' && (i.user.id === c1.id || i.user.id === c2.id)) {
							await i.update({ content: `${c1.displayName} has won the duel!`, components: [] });
							collectorSelectWinner.stop();
						}
						if (i.customId === 'c2win' && (i.user.id === c1.id || i.user.id === c2.id)) {
							await i.update({ content: `${c2.displayName} has won the duel!`, components: [] });
							collectorSelectWinner.stop();
						}
					});
					collectorSelectWinner.on('end', collectionSelectWinner => {
						collectionSelectWinner.forEach(clickSelectWinner => {
							if(collectionSelectWinner.first().customId === 'c1win') {
								const newElo = eloRating(c1CurrentScore, c2CurrentScore, constant, 1);
								const c1Index = ranking.findIndex(e => e.id === c1.id);
								const c2Index = ranking.findIndex(e => e.id === c2.id);
								jsonData.users[c1Index].score = newElo[0];
								jsonData.users[c2Index].score = newElo[1];
								fs.writeFileSync('./resources/ranking.json', JSON.stringify(jsonData, null, '\t'));
								// 3rd ineraction reply
								interaction.followUp({
									content: `The duel has ended.\n${c1.displayName} ${c1scoreOld} -> ${newElo[0]}\n${c2.displayName} ${c2scoreOld} -> ${newElo[1]}`
								});
							}
							if(collectionSelectWinner.first().customId === 'c2win') {
								const newElo = eloRating(c1CurrentScore, c2CurrentScore, constant, 0);
								const c1Index = ranking.findIndex(e => e.id === c1.id);
								const c2Index = ranking.findIndex(e => e.id === c2.id);
								jsonData.users[c1Index].score = newElo[0];
								jsonData.users[c2Index].score = newElo[1];
								fs.writeFileSync('./resources/ranking.json', JSON.stringify(jsonData, null, '\t'));
								// 3rd ineraction reply
								interaction.followUp({
									content: `The duel has ended.\n${c1.displayName} ${c1scoreOld} -> ${newElo[0]}\n${c2.displayName} ${c2scoreOld} -> ${newElo[1]}`
								});
							}
						});
					});
				}
			});
		});
	},
};