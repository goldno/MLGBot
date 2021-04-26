const malScraper = require('mal-scraper')
const search = malScraper.search
const type = 'anime'

const Discord = require('discord.js');
const { prefix } = require('../../config.json')

module.exports = {
    name: 'searchanime',
    description: 'search for an anime series!',
    aliases: ['sa'],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        const searchName = args.join(' ')

        var embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setFooter(`Powered by MAL API`)

        // console.log(search.helpers)
        // search.search(type, {
        //     maxResults: 4,
        //     term: searchName,
        // }).then(x => {
        //     console.log(x)
        // })
        // .catch(console.error)
        malScraper.getInfoFromName(searchName)
            .then((data) => {
                var englishTitle = data.title
                var japaneseTitle = data.japaneseTitle
                var synopsis = data.synopsis
                var picture = data.picture
                var trailer = data.trailer
                var type = data.type
                var episodes = data.episodes
                var aired = data.aired
                var studios = data.studios
                var source = data.source
                var rating = data.rating
                var status = data.status
                var genres = data.genres
                var score = data.score
                var url = data.url

                embed.setTitle(`${englishTitle} — ${japaneseTitle}`)
                embed.setThumbnail(picture)
                embed.setDescription(synopsis)
                embed.addField(`Type`, `${type}`, true)
                embed.addField(`Score`, `${score}`, true)
                embed.addField(`Episodes`, `${episodes}`, true)
                embed.addField(`Aired`, `${aired}`, true)
                embed.addField(`Status`, `${status}`, true)

                message.channel.send(embed)
            })
            .catch((err) => console.log(err))

    }
};