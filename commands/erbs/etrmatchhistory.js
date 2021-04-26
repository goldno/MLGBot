const Discord = require('discord.js');
const {ErBsClient, GameModes} = require('erbs-client')
const key = process.env.ETRKEY
const client = new ErBsClient(key, 'v1')
const prefix = process.env.PREFIX
const erbsInfo = require('../../resources/master.json')

module.exports = {
    name: 'etrmatchhistory',
    description: 'display a 10 game match history for a specific player!',
    aliases: ['etrmh'],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        const name = args[0]
        const {userNum} = await client.getPlayerNumber(name)
        const results = await client.getGamesForPlayer(userNum)

        var embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setFooter(`Powered by ErBs API`)

        var gameModes = ['Norm Solos', 'Norm Duos', 'Norm Squads', 'Ranked Solos', 'Ranked Duos', 'Ranked Squads']
        var gameNum = 1
        for(match of results) {
            var championId = match.characterNum
            var championResult = erbsInfo.characters.filter((x) => {
                return championId == x.id
            })
            var champName = championResult[0].name
            var userName = match.nickname
            var gameMode = gameModes[match.matchingMode]
            var champLevel = match.characterLevel
            var gameRank = match.gameRank
            var kills = match.playerKill
            var asists = match.playerAssistant
            var monsterKills = match.monsterKills

            embed.setTitle(`${userName} — Eternal Return Match History`)
            embed.addField(`${champName}`, `**Level:** ${champLevel} \xa0\xa0 **Mode:** ${gameMode} \xa0\xa0 **Rank:** ${gameRank} \xa0\xa0 **K:** ${kills} \xa0\xa0 **A:** ${asists}`, false)

            gameNum++
        }
        message.channel.send(embed)
    }
};