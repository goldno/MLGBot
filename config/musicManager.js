const ytdl = require("ytdl-core");
const ytsr = require('youtube-sr')
const _ = require('lodash');
const sleep  = require('../lib/sleep.js')
// const shuffle = require('../lib/shuffle.js')
const spotify = require('./spotify.js')
const Song = require('../models/Song.js')

// const key = process.env.YT_SEARCH_KEY;
// const { YTSearcher } = require('ytsearcher');
// const searcher = new YTSearcher({
//   key,
//   revealed: true
// });

class MusicManager {
    constructor(message) {
        this.guildId = message.guild.id
        this.textChannel = message.channel
        this.voiceChannel = message.member.voice.channel
        this.connection = null
        this.queue = []
        this.playing = false;
        this.looping = false;
        this.playlistLoadDelay = 5000
    }

    async startPlaying(song) {
        this.playing = song
        if(!this.playing) {
            return this.stop()
        }
        
        this.connection = this.connection || await this.voiceChannel.join()
        this.connection.play(song.resource())
            .on('finish', () => {
                const lastSong = this.queue.shift()
                if(this.looping) this.queue.push(lastSong)
                this.startPlaying(_.head(this.queue))
            }).on('error', console.log)
    }

    async addSong(query) {
        const song = await this.getSongFromQuery(query)
        if (!song) 
          return this.textChannel?.send(`Could not find a resource from:\n${query}`)
    
        this.songQueue.push(song)
        this.sendAddedSongMsg(song)
        if (!this.playing) {
          this.startPlaying(song)
        }
    }

    async stop(message) {
        this.connection.disconnect()
        guilds.delete(this.guildId)
        if(message)
            this.textChannel.send(`${message.author} ⏹ stopped the music!`)
    }

    async pause() { this.connection.dispatcher.paused || this.connection.dispatcher.pause() }
    async resume() { !this.connection.dispatcher.resumed || this.connection.dispatcher.resume() }
    async skip() { !this.connection.dispatcher.end() }
    async loop() { return this.looping = !this.looping }
    async clear() { this.queue = this.queue.slice(0,1) }
    async shuffle() {
        const queueCopy = [...this.queue]
        shuffle(queueCopies)
        this.clear()
        queueCopy.forEach(song => this.queue.push(song))
        this.skip()
    }

    sendAddedSongMessage(song) {
        this.textChannel.send(`Added song **${song.name}** by ${song.artist}.`)
    }

    async getSongFromQuery(query) {
        if(this.isYTLink(query)) {
            return await this.getYTSong(query)
        } else if(spotify.isTrack(query)) {
            return await this.getSpotifySong(query)
        } else if(spotify.isPlaylist(query)) {
            return await this.loadSpotifyPlaylist(query)
        }
        return await this.searchYT(query)
    }

    isYTLink(query) {
        return /https:\/\/www\.youtube\.com\/watch\?v=\S+/.test(query) 
        || /https:\/\/youtu\.be\/\S+/.test(query)
    }

    async getYTSong(query, title=null, artist=null) {
        const link = _.split(query, /\s+/, 1)?.[0]
        const info = await ytdl.getInfo(link)
        const videoDetails = info.videoDetails
        return new Song(
            title || videoDetails.title,
            artist || videoDetails.ownerChannelName,
            () => ytdl(link),
            info)
    }

    async searchYT(query, title=null, artist=null) {
        const searchResults = await ytsr.searchOne(query)
        if(searchResults) {
            const link = `https://youtube.com/watch?v=${searchResults?.id}`
            return await this.getYTSong(link,
                title || searchResults.title,
                artist || searchResults.channel.name)
        }
    }

    async getSpotifySong(query) {
        const track = await spotify.getTrack(spotify.getSpotifyId(query))
        const title = track.body.name
        const artistName = track.body.artists[0].name
        return await this.searchYTForSong(`${title} by ${artistName}`, title, artistName)
    }

    async loadSpotifyPlaylist(query) {
        const playlistTracks = await spotify.getPlaylistTracks(spotify.getSpotityID(query))

        const trackToSong = async (trackData) => {
            const title = trackData?.track?.name
            const artist = trackData?.track?.artists?.[0]?.name
            return await this.searchYT(`${title} by ${artist}`, title, artist)
        }

        _.chain(playlistTracks)
            .slice(1)
            .chunk(20)
            .reduce((queuePromise, tracks) =>
                queuePromise.then(() =>
                    Promise.all(tracks.map(track =>
                        trackToSong(track).then(song =>
                            this.queue.push(song))))
                        .then(() => sleep(this.playlistLoadDelay)))
            , Promise.resolve())
            .value()
            .then(() => this.textChannel.send(`Playlist of ${playlistTracks?.length} loaded`))
        
        return await trackToSong(playListTracks?.[0])
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

const guilds = new Map()
const getMusicManager = (message, { createIfNotFound } = { createIfNotFound: true }) => {
    const guildId = message.guild.id
    if(!guilds.has(guildId) && createIfNotFound) {
        guilds.set(guildId, new MusicManager(message))
    }
    return guilds.get(guildId)
}
module.exports = getMusicManager()