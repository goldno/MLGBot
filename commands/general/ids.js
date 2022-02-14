const Discord = require('discord.js');
const Client = require('../../client/Client');
const client = new Client();

module.exports = {
    name: 'ids',
    description: 'console log all guild member\'s IDs.',
    aliases: [],
    async execute(message) {
        const server = message.channel.guild;
        server.members.cache.forEach(m => {
            console.log(`ID: ${m.id} Name: ${m.displayName}`);
        });
    }
};