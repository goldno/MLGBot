const fs = require('fs')

module.exports = {
    name: 'pog',
    description: 'this is a pog command!',
    aliases: [],
    async execute(message) {
        message.channel.send('pog! :O')
    }
};