const amazonStockCheck = require('../../config/amazon.js')

module.exports = {
    name: 'startAmznCheck',
    description: 'starts the amazon in-stock checking program',
    aliases: ['startACheck'],
    async execute(message) {
        amazonStockCheck.start(message)
        message.channel.send('Amazon check started')
    }
};