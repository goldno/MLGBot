// Discord Client
const Client = require('./client/Client');
const client = new Client();

// Bot Config
const config = require('./config.json');
const { guildId } = require('./config.json');
const bot_name = process.env.BOT_NAME;
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

// Importing Rest & api-types
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Other Imports
require('dotenv').config();
const cron = require('cron');
const fs = require('fs');

// Read MessageEvent Commands
const modules = ['general', 'random', 'soundbites', 'anime'];
modules.forEach(c => {
    fs.readdir(`./commands/${c}/`, (err, files) => {
        if(err) throw err;
        console.log(`[Commandlogs] Loaded ${files.length} commands of module ${c}`);
        files.forEach(f => {
            const cmd = require(`./commands/${c}/${f}`);
            client.commands.set(cmd.name, cmd);
        });
    });
});

// Read Slash Commands
const modulesSlash = ['general', 'rank', 'random'];
modulesSlash.forEach(c => {
    fs.readdir(`./slashcommands/${c}/`, (err, files) => {
        if(err) throw err;
        console.log(`[Commandlogs] Loaded ${files.length} slash commands of module ${c}`);
        files.forEach(f => {
            const cmd = require(`./slashcommands/${c}/${f}`);
            client.slashcommands.set(cmd.data.name, cmd);
        });
    });
});

// Ready Event
client.once('ready', async () => {
    client.user.setPresence({
		status: 'online',
		activities: [{
			name: config.status,
			type: 'PLAYING',
		}]
	});

    // Registering Slash Commands
    const slashcommands = [];
    modulesSlash.forEach(c => {
        fs.readdir(`./slashcommands/${c}/`, (err, files) => {
            if(err) throw err;
            files.forEach(f => {
                const cmd = require(`./slashcommands/${c}/${f}`);
                slashcommands.push(cmd.data.toJSON());
            });
        });
    });

    await client.guilds.cache.get(guildId).commands.set(slashcommands);

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, guildId), { body: slashcommands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);

    console.log(`${process.env.BOT_NAME} is online!`);
});

// Interaction Event
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;

    const slashcommand = client.slashcommands.get(interaction.commandName);
    if (!slashcommand) return;

    try {
		await slashcommand.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});

// Message Event
client.on('messageCreate', async message => {
    /* If 2 ICANT emoji are posted, post WECANT emoji */
    const icantEmoji = '<:ICANT:927771695450828840>';
    const wecantEmoji = '<:wecant:939359818043514960>';
    await message.channel.messages.fetch({ limit: 2 }).then(messages => {
        const msgs = Array.from(messages.values());
        if(msgs[0].content == icantEmoji && msgs[1].content == icantEmoji) message.channel.send(`${wecantEmoji}`);
    });

    // Command handling
    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if(!command) return;

    if(command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    if(!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    try {
        command.execute(message);
	} catch (error) {
		console.error(error);
		// message.reply('There was an error trying to execute that command!');
	}

    //message.channel.send(message.content);
    //message.delete();
});


//  Warn members for playing league longer than 30 min
//  Only works if members have game activity/presence enabled
/* let banPresence = new cron.CronJob('00 09 18 * * *', () => {
    var server = client.guilds.cache.get('734586607285567528')
    var today = new Date()
    var currentTime = today.getMinutes()
    server.members.forEach(member => {
        let presenceTime = member.presence.activities[0].timestamps.start.getMinutes()
        var difference = Math.abs(currentTime-presenceTime)
        if(member.presence.activities[0].name=='' && difference >= 30) {
            message.channel.send(`Hey <@${member.id}>. You've been playing Lost Ark for more than 30 minutes. Go touch some grass!`)
        }
    })

    message.channel.send(`Current Minutes: ${currentTime} m`)
    message.channel.send(`Start Minutes: ${presenceTime} m`)
    message.channel.send(`Difference: ${difference} m`)


}, null, true, 'America/New_York')
banPresence.start() */

/* CronJob scheduled Discord message testing */
const scheduledMessage = new cron.CronJob('00 09 18 * * *', () => {
    const channelGeneral = client.channels.cache.get('931019066867609690');
    const server = client.guilds.cache.get('734586607285567528');
    const randomUser = server.members.cache.random();
    const userID = randomUser.id;
    const flushedEmoji = '<:flushedBIG:793533537407467581>';
    channelGeneral.send(`<@${userID}> Hey you sussy baka ${flushedEmoji}, You're looking quite submissive and breedable tonight.`);
}, null, true, 'America/New_York');
scheduledMessage.start();

client.on('channelDelete', channel => {
    const channelGeneral = client.channels.cache.get('931019066867609690');
    const channelDeleteId = channel.id;
    channel.guild.fetchAuditLogs({ 'type': 'CHANNEL_DELETE' })
        .then(logs => logs.entries.find(entry => entry.target.id == channelDeleteId))
        .then (entry => {
            const author = entry.executor;
            channelGeneral.send(`Channel ${channel.name} deleted by ${author.tag}!!!!`);
        });
});

client.login(process.env.TOKEN);