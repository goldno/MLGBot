const fs = require('fs')
const Discord = require('discord.js');
const lyricsFinder = require("lyrics-finder")
// const g = require('genius-lyrics-api');
// const geniusKey = process.env.GENIUS_KEY;
// const options = {
//     apiKey: geniusKey,
//     title: '',
//     artist: '',
//     optimizeQuery: true
// };
const prefix = process.env.PREFIX

module.exports = {
    name: 'lyrics',
    description: 'displays the lyrics of the currently playing song or give arguments: [Format: \'song title\' / \'artist\']',
    aliases: ['ly'],
    async execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        var query = message.content.slice(prefix.length).split(/ +/);
        query.shift()
        let lyrics = null
        let songName = null

        if(query.length == 0) {
            if(!queue) return message.channel.send('There is nothing currently playing!');
            try {
                lyrics = await lyricsFinder(queue.songs[0].name, '')
                if(!lyrics) lyrics = `No lyrics found for ${queue.songs[0].name}.`
                songName = queue.songs[0].name
            } catch(error) {
                lyrics = `No lyrics found for ${queue.songs[0].name}.`
            }
        } else {
            var args = message.content.split(' ').slice(1)
            title = args.join(' ')

            try {
                lyrics = await lyricsFinder(title, '')
                if(!lyrics) lyrics = `No lyrics found for ${title}.`
                songName = title
            } catch(error) {
                lyrics = `No lyrics found for ${title}.`
            }
        }

        if(lyrics.length > 2048) {
            var lyrics1 = lyrics.substring(0, 2048);
            var lyrics2 = lyrics.substring(2049, lyrics.length)
            const lyricsEmbed1 = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${queue.songs[0].name} — Lyrics`)
                .setDescription(lyrics1)
            const lyricsEmbed2 = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setDescription(lyrics2)
                .setTimestamp()
            message.channel.send(lyricsEmbed1);
            message.channel.send(lyricsEmbed2);
        } else {
            const lyricsEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${songName} — Lyrics`)
                .setDescription(`${lyrics}`)
                .setTimestamp()
            message.channel.send(lyricsEmbed);
        }
    }
};