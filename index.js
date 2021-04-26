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
});

client.on('message', async message => {
    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()

    if(message.channel.id == '786695945014083585') {
        message.delete({ timeout: 60000 })
    }

    const gpuWords = ['3060', '3060 Ti', '3060 TI', '3060 ti', '3070']
    const roleId = '835313911229186058'
    if(message.channel.id == '833862667453464577' && message.author.id != '778104568222580737' && message.author.id != '778719961106874375') {
        for (var i = 0; i < gpuWords.length; i++) {
            if (message.content.includes(gpuWords[i]) && !message.content.includes('PC')) {
                message.channel.send(`<@&${roleId}>, theres a ${gpuWords[i]} for sale!!!`)
                break;
            }
        }
    }

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

    // const args = message.content.slice(prefix.length).split(/ +/);
    // const command = args.shift().toLowerCase();

    // if(command === 'pog') {
    //     client.commands.get('pog').execute(message, args);
    // } else if(command == 'pogging') {
    //     client.commands.get('pogging').execute(message, args);
    // }
});

// let scheduledMessage = new cron.CronJob('00 00 12 * * *', () => {
//     let channel = client.channels.cache.get('783744129032257567')
//     let words = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']
//     let date = new Date()
//     channel.send(`@everyone` + ` Pog!! Its the ${words[date.getDate()-10]} day of Hanukkah!!!!`)
// }, null, true, 'America/New_York')
// scheduledMessage.start()

client.login(process.env.TOKEN);