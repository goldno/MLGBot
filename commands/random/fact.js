const fs = require('fs')
const request = require('request');
const { MessageEmbed } = require('discord.js')
let options = {
    headers: {
      'User-Agent': 'MLGBot'
    },
    json: true
  };

module.exports = {
    name: 'fact',
    description: 'displays a random fact!',
    aliases: [],
    async execute(message) {
        request('https://uselessfacts.jsph.pl/random.json?language=en', options, (err, res, body) => {
            if(err) {
                message.channel.send('Failed to retrieve fact :(')
                return console.log(err)
            }
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const embed = new MessageEmbed()
                .setColor(randomColor)
                .setAuthor('Rhib Says')
                .setDescription(body.text)
                .setFooter('Powered by Useless Facts API')
            message.channel.send({ embeds: [embed] })
            return
        })
    }
};