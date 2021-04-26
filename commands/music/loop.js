module.exports = {
	name: 'loop',
	description: 'toggle music loop!',
	aliases: [],
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to loop the music!');
		if (!serverQueue) return message.channel.send('There is no song that I could loop!');

		serverQueue.loop = !serverQueue.loop;
		return message.channel.send(`Loop is now ${serverQueue.loop ? "**on**" : "**off**"}`).catch(console.error);
	}
};