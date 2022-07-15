const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('clear a certain number of messages from a channel!')
		.addIntegerOption(amount =>
			amount.setName('input').setDescription('The number of lines to delete').setRequired(true)),
	async execute(interaction) {
		const amount = interaction.options.getInteger('input');
		const channel = interaction.channel;

        if(amount > 100) {
			await interaction.reply({ content:'You cannot delete more than 100 messages at a time!' });
			setTimeout(() => interaction.deleteReply(), 10000);
		}
        else if(amount < 1) {
			await interaction.reply({ content:'You must delete at least 1 message!' });
			setTimeout(() => interaction.deleteReply(), 10000);
		}
		else {
			channel.messages.fetch({ limit: amount }).then(messages => {
				channel.bulkDelete(messages, true);
			interaction.reply({ content: `${messages.size} messages have been deleted.` });
			setTimeout(() => interaction.deleteReply(), 10000);
			});
		}
	},
};
