const api = require('404studios-api');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'joke',
    description: 'displays a random joke!',
    aliases: [],
    async execute(message) {
        let {joke, answer} = await api.joke();
        const embed = new MessageEmbed()
            .setColor('#BB7D61')
            .setDescription(`${joke} ${answer}`)
            .setFooter('Powered by 404 Studios API')
        message.channel.send({ embeds: [embed] })
    }
};