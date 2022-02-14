const fs = require('fs');
const Discord = require('discord.js');
const prefix = process.env.PREFIX;

module.exports = {
    name: 'help',
    description: 'displays a list of possible commands!',
    aliases: [],
    async execute(message) {
        const args = message.content.slice(prefix.length).split(/ +/);
        args.shift();
        const helpModule = args.join(' ');
        console.log(helpModule);

        const capitalize = (s) => {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        };
        const toLower = (s) => {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toLowerCase() + s.slice(1);
        };

        const modules = ['general', 'random', 'soundbites', 'anime'];

        if(args.length > 0) {
            if(!modules.includes(toLower(helpModule))) return message.channel.send('Incorrect command module name!');
            let str = '';
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff');
            const moduleResult = modules.filter((moduleName) => {
                return helpModule.toLowerCase() == moduleName.toLowerCase();
            });
            fs.readdir(`././commands/${moduleResult}/`, (err, files) => {
                if(err) console.error(err);
                files.forEach(f => {
                    const command = require(`../../commands/${moduleResult}/${f}`);
                    if(command.aliases.length > 0) {
                        str += `**${command.name}** [${command.aliases}]: ${command.description}\n`;
                    } else {
                        str += `**${command.name}:** ${command.description}\n`;
                    }
                });
                helpEmbed.setTitle(capitalize(moduleResult));
                helpEmbed.setDescription(str);
                message.channel.send({ embeds: [helpEmbed] });
            });
        } else {
            const modulesEmbed = new Discord.MessageEmbed()
                .setColor('0099ff')
                .setTitle(`List of Command Modules — Type ${prefix}help [module name]`);
            let modulesStr = '';
            modules.forEach(mod => {
                const modCap = capitalize(mod);
                modulesStr += `${modCap}\n`;

            });
            modulesEmbed.setDescription(modulesStr);
            message.channel.send({ embeds: [modulesEmbed] });
        }
    }
};