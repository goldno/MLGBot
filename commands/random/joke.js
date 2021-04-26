const fs = require('fs');
const { default: fetch } = require('node-fetch');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'joke',
    description: 'displays a random joke!',
    aliases: [],
    async execute(message) {
        fetch('https://bruhapi.xyz/joke')
            .then(res => res.json())
            .then(json => {
                const embed = new MessageEmbed()
                    .setColor('#BB7D61')
                    .setAuthor('Haha Funny')
                    .setDescription(json.res)
                    .setFooter('Powered by BruhAPI')
                message.channel.send(embed)
            })
    }
};