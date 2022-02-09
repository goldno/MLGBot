const prefix = process.env.PREFIX
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

module.exports = {
    name: 'play',
    description: 'plays a youtube search result!',
    guildOnly: true,
    args: true,
    aliases: [],
    async execute(message) {
        //Checking for the voicechannel and permissions.
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        //Get youtube search and download video
        const args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        if (!args.length)
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`)    

        let song = {};
        //If the first argument is a link. Set the song object to have two keys. Title and URl.
        if (ytdl.validateURL(args[0])) {
            const song_info = await ytdl.getInfo(args[0]);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
        } else {
            //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
            const video_finder = async (query) =>{
                const options = { limit: 1 }
                const video_result = await ytsr(query, options);
                //console.log(video_result)
                return (video_result.items.length >= 1) ? video_result.items[0] : null;
            }

            const video = await video_finder(args.join(' '));
            if (video){
                song = { title: video.title, url: video.url, thumbnail: video.bestThumbnail.url, duration: video.duration }
            } else {
                 message.channel.send('Error finding video.');
            }
        }

        //Initialize global queue
        const queue = message.client.queue
        const serverQueue = queue.get(message.guild.id);
        const textChannel = message.channel

        if(!serverQueue) { //If queue is not set up, initialize queue and add first song
            const player = createAudioPlayer(); //Create audio player object (used in video_player)
            const queueConstruct = {
                voiceChannel: voiceChannel,
                textChannel: textChannel,
                connection: null,
                songs: [],
                loop: false,
                playing: false,
                player: player
            }
            queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            //Establish a connection and play the song with the video_player function.
            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                queueConstruct.connection = connection;
                video_player(message, message.guild, queueConstruct.songs[0]);
            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('There was an error connecting!');
                throw err;
            }
        } else { //If queue is already set up, add new song to queue
            serverQueue.songs.push(song);
            return message.channel.send(`👍 **${song.title}** added to queue!`);
        }
    }
};

const video_player = async(message, guild, song) => {
    const queue = message.client.queue
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(message.guild.id);
        return;
    }

    const stream = ytdl(song.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    const player = song_queue.player
    player.play(resource);
    song_queue.connection.subscribe(player)
    player.on(AudioPlayerStatus.Idle, () => {
        song_queue.songs.shift();
        video_player(message.guild, song_queue.songs[0]);
        song_queue.connection.destroy();
    });
    await song_queue.textChannel.send(`🎶 Now playing **${song.title}**`)
}