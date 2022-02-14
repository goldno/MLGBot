const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'pig',
    description: 'displays a random picture of Bella the Pig!',
    aliases: [],
    async execute(message) {
        this.pigPath = './resources/images/pig/';
        fs.readdir(this.pigPath, (err, files) => {
            const pigFiles = files.filter(filename => filename.endsWith('.jpg'));
            const chosenPig = randomElement(pigFiles);
            const attachment = new Discord.MessageAttachment(this.pigPath + chosenPig, chosenPig);
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            if(chosenPig === 'p8.jpg') {
                const embed = new Discord.MessageEmbed()
                    .setColor(randomColor)
                    .setTitle('PIG POG')
                    .setImage(`attachment://${chosenPig}`)
                    .setFooter({ text: 'RARE: THICCC BELLA' });
                message.channel.send({ embeds: [embed], files: [attachment] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(randomColor)
                    .setTitle('PIG POG')
                    .setImage(`attachment://${chosenPig}`);
                message.channel.send({ embeds: [embed], files: [attachment] });
            }
        });
    }
};

function randomElement(arg) {
    return arg[Math.floor(Math.random() * arg.length)];
}