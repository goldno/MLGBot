const Discord = require('discord.js');

module.exports = {
    name: 'presence',
    description: 'get the presence of a member',
    aliases: [],
    async execute(message) {
        let member = message.mentions.members.first()

        //console.log(member.presence)
        //console.log(member.presence.activities[0].timestamps)

        console.log(member.presence)

        let presenceTime = member.presence.activities[0].timestamps.start.getMinutes()
        var today = new Date()
        var currentTime = today.getMinutes()
        var difference = Math.abs(currentTime-presenceTime)

        message.channel.send(`Current Minutes: ${currentTime} m`)
        message.channel.send(`Start Minutes: ${presenceTime} m`)
        message.channel.send(`Difference: ${difference} m`)

    }
};