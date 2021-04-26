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
    name: 'script',
    description: 'displays a random bible verse!',
    aliases: [],
    async execute(message) {
        request('https://labs.bible.org/api/?passage=random', options, (err, res, body) => {
            if(err) {
                message.channel.send('Failed to retrieve bible verse :(')
                return console.log(err)
            }
            var str1 = '<b>'
            var str2 = '</b>'
            text = body.replace(str1, '')
            text1 = text.replace(str2, ':')
            const embed = new MessageEmbed()
                .setColor('#BB7D61')
                .setAuthor('God Says')
                // .attachFiles(['./resources/images/jorts.png'])
                // .setImage('attachment://jorts.png')
                .setDescription(text1)
                .setFooter('Powered by Bible Labs API')
            message.channel.send(embed)
            return
        })
    }
};