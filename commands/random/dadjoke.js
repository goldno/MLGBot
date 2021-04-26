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
    name: 'dadjoke',
    description: 'displays a random dad joke!',
    aliases: [],
    async execute(message) {
        request('https://icanhazdadjoke.com/', options, (err, res, body) => {
            if(err) {
                message.channel.send('Failed to retrieve quote :(')
                return console.log(err)
            }
            const embed = new MessageEmbed()
                .setColor('#BB7D61')
                .setAuthor('Dad')
                .attachFiles(['./resources/images/jorts.png'])
                .setImage('attachment://jorts.png')
                .setDescription(body.joke)
                .setFooter('Powered by Icanhazdadjoke API')
            message.channel.send(embed)
            return
        })
    }
};