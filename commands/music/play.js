const ytdl = require("ytdl-core");
const ytsr = require('ytsr');
const { prefix } = require('../../config.json');
const _ = require('lodash');
const spotify = require('../../config/spotify.js')
const Song = require('../../models/Song.js');
const COOKIE = process.env.COOKIE
var firstSpotifyPlaylistSong = null
var tracksLeft = null

module.exports = {
    name: "play",
    description: "plays a youtube search result, youtube link, spotify track link, or spotify playlist link!",
    guildOnly: true,
    args: true,
    aliases: [],
    async execute(message) {
      const query = message.content.slice(prefix.length).split(/ +/);
      query.shift()
      // console.log(query)

      const queue = message.client.queue
      const guildId = message.guild.id
      const serverQueue = queue.get(guildId)
      const textChannel = message.channel
      const voiceChannel = message.member.voice.channel
      if (!query.length)
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
      if (!voiceChannel)
        return message.channel.send("You need to be in a voice channel to play music!")
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
      }

      if (!serverQueue) {
        const queueConstruct = {
          textChannel: textChannel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          loop: false,
          volume: 5,
          playing: false
        }
        queue.set(message.guild.id, queueConstruct)
        const song = await this.getSongFromQuery(message, query)
        if(firstSpotifyPlaylistSong !== null) {
          queueConstruct.songs.push(firstSpotifyPlaylistSong)
          this.sendAddedSongMessage(message, firstSpotifyPlaylistSong)
          if (!queueConstruct.playing) this.startPlaying(message, firstSpotifyPlaylistSong)
          console.log(tracksLeft)
          this.loadSpotifyPlaylistFinish(queueConstruct, tracksLeft)
          textChannel.send(`**Finished loading Spotify playlist of ${tracksLeft.length+1} tracks.**`)
          firstSpotifyPlaylistSong = null
        } else {
          if (!song) 
            return textChannel.send(`Could not find a resource from:\n${query}`)
          song.searchQuery = query.join(' ')
          queueConstruct.songs.push(song)
          this.sendAddedSongMessage(message, song)
          if (!queueConstruct.playing) this.startPlaying(message, song)
        }
      } else {
        const song = await this.getSongFromQuery(message, query)
        if(firstSpotifyPlaylistSong !== null) {
          serverQueue.songs.push(firstSpotifyPlaylistSong)
          this.sendAddedSongMessage(message, firstSpotifyPlaylistSong)
          if (!serverQueue.playing) this.startPlaying(message, firstSpotifyPlaylistSong)
          console.log(tracksLeft)
          this.loadSpotifyPlaylistFinish(serverQueue, tracksLeft)
          textChannel.send(`**Finished loading Spotify playlist of ${tracksLeft.length+1} tracks.**`)
          firstSpotifyPlaylistSong = null
          tracksLeft = null
        } else {
          const song = await this.getSongFromQuery(message, query)
          if (!song) 
            return textChannel.send(`Could not find a resource from:\n${query}`)
          serverQueue.songs.push(song)
          this.sendAddedSongMessage(message, song)
        }
      }

    },  

    async addSong(message, query) {
      const textChannel = message.channel
      const voiceChannel = message.member.voice.channel
      const queue = message.client.queue
      const song = await this.getSongFromQuery(message, query)
      if (!song) 
        return textChannel.send(`Could not find a resource from:\n${query}`)
      
      if (!serverQueue.songs) {
        const queueConstruct = {
          textChannel: textChannel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          loop: false,
          volume: 5,
          playing: false
        }
        queue.set(message.guild.id, queueConstruct)
        queueConstruct.songs.push(song)
        this.sendAddedSongMessage(message, song)
        if (!queueConstruct.playing) this.startPlaying(message, song)
      }
    },

    async startPlaying(message, song) {
      const voiceChannel = message.member.voice.channel
      const serverQueue = message.client.queue.get(message.guild.id)
      serverQueue.playing = song
      if(!serverQueue.playing) {
          return this.stop(message)
      }
      
      serverQueue.connection = serverQueue.connection || await voiceChannel.join()
      serverQueue.connection.play(song.resource())
          .on('finish', () => {
              const lastSong = serverQueue.songs.shift()
              if(serverQueue.loop) serverQueue.songs.push(lastSong)
              this.startPlaying(message, _.head(serverQueue.songs))
          }).on('error', console.log)
      },

    stop(message) {
      const textChannel = message.channel
      const serverQueue = message.client.queue.get(message.guild.id)
      const queue = message.client.queue
      const guildId = message.guild.id
      serverQueue.connection.disconnect()
      queue.delete(guildId)
      if(message)
          textChannel.send(`The music queue has ended!`)
    },

    sendAddedSongMessage(message, song) {
      const textChannel = message.channel
      textChannel.send(`Added song **${song.name}** by ${song.artist}.`)
    },

    async getSongFromQuery(message, query) {
      // console.log('YTLink: '+this.isYTLink(query))
      // console.log('Track: '+spotify.isTrack(query))
      // console.log('Playlist: '+spotify.isPlaylist(query))
      if(this.isYTLink(query)) {
          return await this.getYTSong(query)
      } else if(spotify.isTrack(query)) {
          return await this.getSpotifySong(query)
      } else if(spotify.isPlaylist(query)) {
          return await this.loadSpotifyPlaylistStart(message, query)
      }
      q = query.join(" ")
      return await this.searchYT(q)
    },

    isYTLink(query) {
      return /https:\/\/www\.youtube\.com\/watch\?v=\S+/.test(query) 
      || /https:\/\/youtu\.be\/\S+/.test(query)
    },

    async getYTSong(query, title=null, artist=null) {
      const link = _.split(query, /\s+/, 1)[0]
      const optionsYT = { 
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        requestOptions: { headers: { cookie: COOKIE }, }, }
      const info = await ytdl.getInfo(link, optionsYT)
      const videoDetails = info.videoDetails
      return new Song(
          title || videoDetails.title,
          artist || videoDetails.ownerChannelName,
          () => ytdl(link, optionsYT),
          info,
          videoDetails.video_url,
          null)
    },

    async searchYT(args, title=null, artist=null) {
      // console.log(args)
      const searchResults = await ytsr(args, { limit: 10 })
      const video = searchResults.items.filter(i => i.type === 'video')[0]
      // console.log(video.link)
      // console.log(video.title)
      // console.log(video.author.name)
      return await this.getYTSong(
        video.link,
        title || video.title,
        artist || video.author.name)
    },

    async getSpotifySong(query) {
      const track = await spotify.getTrack(spotify.getSpotifyId(query))
      const title = track.body.name
      const artistName = track.body.artists[0].name
      return await this.searchYTForSong(`${title} ' ' ${artistName}`, title, artistName)
    },

    async loadSpotifyPlaylistStart(message, query) {
      const queue = message.client.queue
      const serverQueue = queue.get(message.guild.id)
      const playlistTracks = await spotify.getPlaylistTracks(spotify.getSpotifyId(query))
      // console.log(playlistTracks)

      const trackToSong = async (trackData) => {
          const title = trackData.track.name
          const artist = trackData.track.artists[0].name
          let song = await this.searchYT(`${title} ${artist}`, title, artist)
          return song
      }

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      const firstTitle = playlistTracks[0].track.name
      const firstArtist = playlistTracks[0].track.artists[0].name
      let firstSongSearch = await this.searchYT(`${firstTitle} ${firstArtist}`, firstTitle, firstArtist)
      let firstSong = playlistTracks[0]
      firstSpotifyPlaylistSong = firstSongSearch

      playlistTracks.shift()
      tracksLeft = playlistTracks

      return await trackToSong(firstSong)
    },

    async loadSpotifyPlaylistFinish(queue, playlist) {
      

      for(let i=0; i<playlist.length; i++) {
        console.log(`Song ${i}: `+playlist[i].track.name)
        const title = playlist[i].track.name
        const artist = playlist[i].track.artists[0].name
        let song = await this.searchYT(`${title} ${artist}`, title, artist)
        queue.songs.push(song)
      }

    }
};

