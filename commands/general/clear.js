const Discord = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'clear a certain number of messages from a channel!',
    aliases: [],
    async execute(message) {
        const args = message.content.split(' ').slice(1);
        const amount = args.join(' ');

        if(!amount) return message.channel.send('You must give an amount of messages to be deleted!');
        if(isNaN(amount)) return message.channel.send('The parameter you gave is not a number!');

        if(amount > 100) return message.channel.send('You cannot delete more than 100 messages at a time!');
        if(amount < 1) return message.channel.send('You must delete at least 1 message!');

        await message.channel.messages.fetch({ limit: amount }).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
};