const malScraper = require('mal-scraper');
const search = malScraper.search;
// const type = 'anime';

const Discord = require('discord.js');
const prefix = process.env.PREFIX;

module.exports = {
    name: 'searchanime',
    description: 'search for an anime series!',
    aliases: ['sa'],
    async execute(message) {
        const args = message.content.slice(prefix.length).split(/ +/);
        args.shift();
        const searchName = args.join(' ');

        const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setFooter({ text: 'Powered by MAL API' });

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
                const englishTitle = data.title;
                const japaneseTitle = data.japaneseTitle;
                const synopsis = data.synopsis;
                const picture = data.picture;
                const trailer = data.trailer;
                const type = data.type;
                const episodes = data.episodes;
                const aired = data.aired;
                const studios = data.studios;
                const source = data.source;
                const rating = data.rating;
                const status = data.status;
                const genres = data.genres;
                const score = data.score;
                const url = data.url;

                embed.setTitle(`${englishTitle} — ${japaneseTitle}`);
                embed.setThumbnail(picture);
                embed.setDescription(synopsis);
                embed.addField('Type', `${type}`, true);
                embed.addField('Score', `${score}`, true);
                embed.addField('Episodes', `${episodes}`, true);
                embed.addField('Aired', `${aired}`, true);
                embed.addField('Status', `${status}`, true);

                message.channel.send({ embeds: [embed] });
            })
            .catch((err) => console.log(err));

    }
};