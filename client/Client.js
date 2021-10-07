const { Client, Collection, Intents } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			fetchAllMembers: true,
			disableEveryone: false,
			disabledEvents: ['TYPING_START'],
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]
		});

		this.commands = new Collection();
		this.aliases = new Collection()

		this.queue = new Map();

		this.config = config;
	}
};