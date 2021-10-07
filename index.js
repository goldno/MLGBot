const Discord =  require('discord.js')
const fs = require('fs')
const Client = require('./client/Client')
require('dotenv').config()
var cron = require("cron")
const bot_name = process.env.BOT_NAME
const prefix = process.env.PREFIX
const client = new Client()

const modules = ['general', 'music', 'random', 'soundbites', 'weather', 'anime', 'erbs']
modules.forEach(c => {
    fs.readdir(`./commands/${c}/`, (err, files) => {
        if(err) throw err
        console.log(`[Commandlogs] Loaded ${files.length} commands of module ${c}`)
        files.forEach(f => {
            const cmd = require(`./commands/${c}/${f}`)
            client.commands.set(cmd.name, cmd)
        })
    })
})

client.on("ready", () => {
    console.log(`${bot_name} is online!`)

    /* Scheduled Message Test
    let scheduledMessageTest = new cron.CronJob('* * * * * *', () => {
        var channelBotCommands = client.channels.cache.get('804910099411632138')
        var server1 = client.guilds.cache.get('734586607285567528')
        var randomUser1 = server1.members.cache.random()
        var userName = randomUser1.displayName
        channelBotCommands.send(`Random user: ${userName}`)
    }, null, true, 'America/New_York')
    scheduledMessageTest.start() */
});

client.on('message', async message => {
    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()

    /* Command handling */
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if(!command) return

    if(command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
    }

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    try {
        command.execute(message);
	} catch (error) {
		console.error(error);
		// message.reply('There was an error trying to execute that command!');
	}

    /* Execute command manually */
    /* client.commands.get('commandName').execute(message, args); */

    /* Delete messages after specified time in specific channel /*
    /* if(message.channel.id == 'channel_ID') { message.delete({ timeout: 60000 }) } */

});

client.on("guildCreate", () => {
    console.log(`${bot_name} is online!`)
});

/* CronJob scheduled Discord message testing */
let scheduledMessage = new cron.CronJob('00 06 18 * * *', () => {
    const channelGeneral = client.channels.cache.get('804904254955061289')
    var server = client.guilds.cache.get('734586607285567528')
    var randomUser = server.members.cache.random()
    var userID = randomUser.id
    let flushedEmoji = '<:flushedBIG:793533537407467581>'
    channelGeneral.send(`<@${userID}> Hey you sussy baka ${flushedEmoji}, You're looking quite submissive and breedable tonight.`)
}, null, true, 'America/New_York')
scheduledMessage.start() 

client.login(process.env.TOKEN);