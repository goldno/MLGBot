module.exports = {
    name: 'pog',
    description: 'pogs in chat!',
    aliases: [],
    async execute(message) {
        message.channel.send('pog! :O');
    }
};