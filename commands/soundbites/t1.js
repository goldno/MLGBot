const fs = require('fs');

module.exports = {
    name: 't1',
    description: 'plays a random Tyler1 screaming sound bite!',
    aliases: [],
    async execute(message) {
        if(!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
        const queue = message.client.queue.get(message.guild.id);
        if(queue) return message.channel.send('The bot is currenly connected and playing music!');


        this.yellPath = './resources/sounds/T1/';
        const connection = message.member.voice.channel.join()
            .then(c => {
                fs.readdir(this.yellPath, (err, files) => {
                    const yellFiles = files.filter(filename => filename.endsWith('.mp3'));
                    const chosenYell = randomElement(yellFiles);
                    chosenYell.play(this.yellPath + chosenYell, { volume: 0.9 })
                        .on('finish', () => {
                            c.disconnect();
                        });
                });

            });
    }
};

function randomElement(arg) {
    return arg[Math.floor(Math.random() * arg.length)];
}