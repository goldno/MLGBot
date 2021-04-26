const fs = require('fs')
const Discord = require('discord.js');

module.exports = {
    name: 'nowplaying',
    description: 'displays the current song!',
    aliases: ['np'],
    async execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if(!queue) return message.channel.send('There is nothing currently playing!');

        const nowplaying = new Discord.MessageEmbed()
        .setTitle("Now Playing\n")
        .setColor("#F8AA2A")
        .setDescription(`**Current Song - [${queue.songs[0].name}](${queue.songs[0].link})**`)
        .setTimestamp();

        message.channel.send(nowplaying);
    }
};