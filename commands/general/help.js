const fs = require('fs')
const Discord = require('discord.js');
const prefix = process.env.PREFIX

module.exports = {
    name: 'help',
    description: 'displays a list of possible commands!',
    aliases: [],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        const helpModule = args.join(' ')

        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }

        const modules = ['general', 'music', 'random', 'soundbites', 'weather', 'anime', 'erbs']

        if(args.length > 0) {
            if(!modules.includes(helpModule)) return message.channel.send('Incorrect command module name!')
            let str = ''
            let helpEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
            var moduleResult = modules.filter((moduleName) => {
                return helpModule.toLowerCase() == moduleName.toLowerCase()
            })
            fs.readdir(`././commands/${moduleResult}/`, (err, files) => {
                if(err) console.error(err)
                files.forEach(f => {
                    const command = require(`../../commands/${moduleResult}/${f}`)
                    if(command.aliases.length > 0) {
                        str += `**${command.name}** [${command.aliases}]: ${command.description}\n`
                    } else {
                        str += `**${command.name}:** ${command.description}\n`
                    }
                })
                helpEmbed.setTitle(capitalize(moduleResult))
                helpEmbed.setDescription(str)
                message.channel.send({ embeds: [helpEmbed] });
            })
        } else {
            let modulesEmbed = new Discord.MessageEmbed() 
                .setColor('0099ff')
                .setTitle(`List of Command Modules — Type ${prefix}help [module name]`)
            let modulesStr = ''
            modules.forEach(mod => {
                modCap = capitalize(mod)
                modulesStr += `${modCap}\n`

            })
            modulesEmbed.setDescription(modulesStr)
            message.channel.send({ embeds: [modulesEmbed] })
        }

        // let str = ''
        // let help = new Discord.MessageEmbed()
	    //     .setColor('#0099ff')
        // modules.forEach(c => {
        //     fs.readdir(`././commands/${c}/`, (err, files) => {
        //         if(err) throw err
        //         files.forEach(f => {
        //             const command = require(`../../commands/${c}/${f}`)
        //             if(command.aliases.length > 0) {
        //                 str += `**${command.name}** [${command.aliases}]: ${command.description}\n`
        //             } else {
        //                 str += `**${command.name}:** ${command.description}\n`
        //             }
        //         })
        //         help.setTitle(capitalize(c))
        //         help.setDescription(str)
        //         message.channel.send(help);
        //         str = ''
        //     })
        // })
    }
};