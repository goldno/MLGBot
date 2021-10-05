const Anime_Images = require('anime-images-api')
const API = new Anime_Images()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'hug',
    description: 'displays a random anime hug gif!',
    aliases: [],
    async execute(message) {
        API.sfw.hug().then(response => {
            message.channel.send(response.image)
        })
    }
};