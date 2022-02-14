const moment = require('moment');
require('moment-duration-format');

module.exports = {
    name: 'uptime',
    description: 'displays the uptime of the bot!',
    aliases: ['up'],
    async execute(message) {
        const duration = moment.duration(message.client.uptime).format(' D [days], H [hrs], m [mins], s [sec]');
        message.channel.send(duration);
    }
};