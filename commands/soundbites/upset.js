module.exports = {
    name: 'upset',
    description: 'plays the there is no need to be upset song!',
    aliases: [],
    async execute(message) {
        if(!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
        const queue = message.client.queue.get(message.guild.id);
        if(queue) return message.channel.send('The bot is currenly connected and playing music!');

        const upsetPath = './resources/sounds/upset.mp3';
        const connection = message.member.voice.channel.join()
            .then(c => {
                c.play(upsetPath, { volume : 0.9 })
                    .on('finish', () => {
                        c.disconnect();
                    });
            });
    }
};