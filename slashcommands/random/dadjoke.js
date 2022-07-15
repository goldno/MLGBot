const { SlashCommandBuilder } = require('@discordjs/builders');
const request = require('request');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const options = {
    headers: {
      'User-Agent': 'MLGBot'
    },
    json: true
  };

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dadjoke')
		.setDescription('displays a random dad joke!'),
	async execute(interaction) {
		const file = new MessageAttachment('./resources/images/jorts.png');
        request('https://icanhazdadjoke.com/', options, (err, res, body) => {
            if(err) {
                interaction.channel.send('Failed to retrieve quote :(');
                return console.log(err);
            }
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const embed = new MessageEmbed()
                .setColor(randomColor)
                .setAuthor({ name: 'Dad' })
                .setImage('attachment://jorts.png')
                .setDescription(body.joke)
                .setFooter({ text:'Powered by Icanhazdadjoke API' });
            interaction.reply({ embeds: [embed], files: [file] });
            return;
        });
	},
};
