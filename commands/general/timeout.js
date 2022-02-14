const parseTime = require('parse-duration').default;
const prettyMS = require('pretty-ms');
const ms = require('ms');

module.exports = {
    name: 'timeout',
    description: 'timeout a user for a defined amount of time',
    aliases: [],
    async execute(message) {
        const args = message.content.split(' ').slice(1);

        if(!message.member.roles.cache.has('925908030468550667')) return message.channel.send('You dont have permissions to do this.');
        const memberTimeout = message.mentions.members.first();
        if(!memberTimeout) return message.channel.send('Please mention a user first.');
        if(memberTimeout.roles.cache.has('925908030468550667')) return message.channel.send('Sorry! You can\'t timeout this gamer.');

        const time = args[1];
        if(!time) return message.channel.send('Please enter an amount of time.');

        const parsedTime = parseTime(time);
        if(parsedTime < ms('5s') || parsedTime > ms('30m')) return message.channel.send('The input time is off limit.');

        await memberTimeout.timeout(parsedTime);
        await message.channel.messages.fetch({ limit: 1 }).then(messages => {
            message.channel.bulkDelete(messages);
        });
        message.channel.send(`\`${memberTimeout.user.tag}\` has been sent to go touch grass for about **${prettyMS(parsedTime, { verbose: true })}**`);
        return;
    }
};