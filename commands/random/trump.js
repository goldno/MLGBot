const fs = require('fs')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { prefix } = require('../../config.json');

module.exports = {
    name: 'trump',
    description: 'displays a random trump quote or a random personalized trump quote for a given name!',
    aliases: [],
    async execute(message) {
        var query = message.content.slice(prefix.length).split(/ +/);
        query.shift()
        if(query.length == 1) {
            var link = `https://api.whatdoestrumpthink.com/api/v1/quotes/personalized?q=${query[0]}`
            fetch(link)
                .then(res => res.json())
                .then(json => {
                    const embed = new MessageEmbed()
                        .setColor('#BB7D61')
                        .setAuthor('Donald Trump')
                        .attachFiles(['./resources/images/trump.png'])
                        .setImage('attachment://trump.png')
                        .setDescription(json.message)
                        // .setTimestamp(json.appeared_at)
                        .setFooter('Powered by WhatDoesTrumpThink API')
                    message.channel.send(embed)
                    return
                }).catch(err => {
                    message.channel.send('Failed to retrieve quote :(')
                    return console.error(err)
                })
        } else if(query.length == 0) {
            fetch('https://api.whatdoestrumpthink.com/api/v1/quotes/random')
                .then(res => res.json())
                .then(json => {
                    const embed = new MessageEmbed()
                        .setColor('#BB7D61')
                        .setAuthor('Donald Trump')
                        .attachFiles(['./resources/images/trump.png'])
                        .setImage('attachment://trump.png')
                        .setDescription(json.message)
                        // .setTimestamp(json.appeared_at)
                        .setFooter('Powered by WhatDoesTrumpThink API')
                    message.channel.send(embed)
                    return
                }).catch(err => {
                    message.channel.send('Failed to retrieve quote :(')
                    return console.error(err)
                })
        } else {
            message.channel.send('Failed to retrieve quote :(')
            return
        }
    }
};