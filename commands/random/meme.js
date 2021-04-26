const fs = require('fs');
const axios = require('axios')
const { MessageEmbed } = require('discord.js')
const ksoftKey = process.env.KSOFTKEY

module.exports = {
    name: 'meme',
    description: 'displays a random meme from reddit!',
    aliases: [],
    async execute(message) {
        axios.get('https://api.ksoft.si/images/random-meme', { headers: { 'Authorization': 'Bearer ' + ksoftKey } })
            .then(res => {
                const embed = new MessageEmbed()
                    .setColor('#BB7D61')
                    .setImage(res.data.image_url)
                    .setAuthor(res.data.title)
                    .setDescription(res.data.subreddit)
                    .setFooter('Powered by Ksoft.API and Reddit')
                    // .setTimestamp(json.appeared_at)
                message.channel.send(embed)
            })
    }
};