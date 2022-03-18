const request = require('request');
const { MessageEmbed } = require('discord.js');
const options = {
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
                message.channel.send('Failed to retrieve bible verse :(');
                return console.log(err);
            }
            const str1 = '<b>';
            const str2 = '</b>';
            const text = body.replace(str1, '');
            const text1 = text.replace(str2, ':');
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const embed = new MessageEmbed()
                .setColor(randomColor)
                .setAuthor({ name: 'God Says' })
                .setDescription(text1)
                .setFooter({ text: 'Powered by Bible Labs API' });
            message.channel.send({ embeds: [embed] });
            return;
        });
    }
};