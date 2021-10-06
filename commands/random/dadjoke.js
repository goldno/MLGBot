const fs = require('fs')
const request = require('request');
const { MessageAttachment, MessageEmbed } = require('discord.js')
let options = {
    headers: {
      'User-Agent': 'MLGBot'
    },
    json: true
  };

module.exports = {
    name: 'dadjoke',
    description: 'displays a random dad joke!',
    aliases: [],
    async execute(message) {
        const file = new MessageAttachment('./resources/images/jorts.png');
        request('https://icanhazdadjoke.com/', options, (err, res, body) => {
            if(err) {
                message.channel.send('Failed to retrieve quote :(')
                return console.log(err)
            }
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const embed = new MessageEmbed()
                .setColor(randomColor)
                .setAuthor('Dad')
                .setImage('attachment://jorts.png')
                .setDescription(body.joke)
                .setFooter('Powered by Icanhazdadjoke API')
            message.channel.send({ embeds: [embed], files: [file] })
            return
        })
    }
};