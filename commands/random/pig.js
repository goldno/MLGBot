const fs = require('fs')
const Discord = require('discord.js');

module.exports = {
    name: 'pig',
    description: 'displays a random picture of Bella the Pig!',
    aliases: [],
    async execute(message) {
        this.pigPath = './resources/images/pig/'
        fs.readdir(this.pigPath, (err, files) => {
            const pigFiles = files.filter(filename => filename.endsWith('.jpg'));
            const chosenPig = randomElement(pigFiles);
            const attachment = new Discord.MessageAttachment(this.pigPath+chosenPig, chosenPig);
            if(chosenPig === 'p8.jpg') {
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('PIG POG')
                    .attachFiles(attachment)
                    .setImage(`attachment://${chosenPig}`)
                    .setFooter('RARE: THICCC BELLA')
                message.channel.send(embed);
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('PIG POG')
                    .attachFiles(attachment)
                    .setImage(`attachment://${chosenPig}`)
                message.channel.send(embed);
            }
        })
    }
};

function randomElement(arg) {
    return arg[Math.floor(Math.random() * arg.length)];
}