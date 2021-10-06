const api = require('404studios-api');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'joke',
    description: 'displays a random joke!',
    aliases: [],
    async execute(message) {
        let {joke, answer} = await api.joke();
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        const embed = new MessageEmbed()
            .setColor(randomColor)
            .setDescription(`${joke} ${answer}`)
            .setFooter('Powered by 404 Studios API')
        message.channel.send({ embeds: [embed] })
    }
};