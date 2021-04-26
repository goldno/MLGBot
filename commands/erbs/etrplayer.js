const Discord = require('discord.js');
const {ErBsClient, GameModes} = require('erbs-client')
const key = process.env.ETRKEY
const client = new ErBsClient(key, 'v1')
const { prefix } = require('../../config.json')
const erbsInfo = require('../../resources/master.json')
const fetch = require('node-fetch')

module.exports = {
    name: 'etrplayer',
    description: 'display eternal return stats for a specific season and player!',
    aliases: ['etrp'],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        const seasonNum = args[0]
        if(isNaN(seasonNum)) return message.channel.send(`${seasonNum} is an invalid season!`)
        args.shift()
        const name = args.join(' ')
        if(!name) return message.channel.send(`Name must be provided!`)
        const {userNum} = await client.getPlayerNumber(name)
        if(!userNum) return message.channel.send(`${name} does not exist!`)

        var gameModes = ['Norm Solos', 'Norm Duos', 'Norm Squads', 'Ranked Solos', 'Ranked Duos', 'Ranked Squads']

        var embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setFooter(`Powered by ErBs API`)

        var link = `https://open-api.bser.io/v1/user/stats/${userNum}/${seasonNum}`
        fetch(link, {headers: {'content-type': 'application/json', 'x-api-key': '9JWgkRFUnCnR2YaTzG645yQapMEcf8j3Igknq9jd'}}) 
            .then(res => res.json())
            .then(json => {
                var userName = json.userStats[0].nickname
                var rank = json.userStats[0].rank
                var mmr = json.userStats[0].mmr
                var modeSeason = `${gameModes[json.userStats[0].matchingMode]}  Season ${json.userStats[0].seasonId}`
                var avgRank = json.userStats[0].averageRank
                var avgKills = json.userStats[0].averageKills
                var avgAsists = json.userStats[0].averageAssistants
                var totalGames = json.userStats[0].totalGames
                var totalWins = json.userStats[0].totalWins
                var mostUsedChars = []
                json.userStats[0].characterStats.forEach(char => {
                    var charCode = char.characterCode
                    var charGames = char.totalGames
                    var character = erbsInfo.characters.filter((x) => {
                        return charCode == x.id
                    })
                    mostUsedChars.push(character[0].name)
                })
                var mostUsedCharacters = mostUsedChars.join(', ')

                embed.setTitle(`${userName} — ${modeSeason}`)
                embed.addField('Rank', `${rank}`, true)
                embed.addField('MMR', `${mmr}`, true)
                embed.addField('Avg. Rank', `${avgRank}`, true)
                embed.addField('Avg. Kills', `${avgKills}`, true)
                embed.addField('Avg. Asists', `${avgAsists}`, true)
                embed.addField('Total Games', `${totalGames}`, true)
                embed.addField('Total Wins', `${totalWins}`, true)
                embed.addField('Most Used Characters', `${mostUsedCharacters}`, true)

                message.channel.send(embed)
            }).catch(err => {
                message.channel.send(`${seasonNum} is an invalid season!`)
                console.err(err)
            })
    }
};