module.exports = {
	name: 'stop',
	description: 'stops the current song and clears the queue!',
	aliases: [],
	execute(message) {
		const queue = message.client.queue
		const serverQueue = queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
		if(!serverQueue) return message.channel.send('There is nothing currently playing!').catch(console.error)

		serverQueue.connection.disconnect()
		queue.delete(message.guild.id)
        serverQueue.songs = [];
        if(message)
			message.channel.send(`${message.author} ⏹ stopped the music!`)
	}
};