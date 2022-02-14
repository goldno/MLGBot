module.exports = {
    name: 'yell',
    description: 'plays the scream sound bite!',
    aliases: [],
    async execute(message) {
        if(!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
        const queue = message.client.queue.get(message.guild.id);
        if(queue) return message.channel.send('The bot is currenly connected and playing music!');

        const yellPath = './resources/sounds/aaaaaashort.mp3';
        const connection = message.member.voice.channel.join()
            .then(c => {
                c.play(yellPath, { volume : 0.9 })
                    .on('finish', () => {
                        c.disconnect();
                    });
            });
    }
};

function randomElement(arg) {
    return arg[Math.floor(Math.random() * arg.length)];
}