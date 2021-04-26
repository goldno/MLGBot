const fs = require('fs')
const Discord = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'displays the current song queue!',
    aliases: [],
    async execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if(!queue) return message.channel.send('There is nothing currently in the queue!');
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to show the queue!');

        let currentPage = 0;
        const embeds = generateQueueEmbed(message);

        const queueEmbed = await message.channel.send(
            `**Curent Page - ${currentPage + 1}/${embeds.length}**`,
            embeds[currentPage]
        );
        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("➡️");
        } catch (error) {
            console.log(error);
            message.channel.send(error.message).catch(console.error);
        }

        const filter = (reaction, user) =>
            ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name);
        const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if(reaction.emoji.name === "➡️") {
                    if(currentPage < embeds.length-1) {
                        currentPage++;
                        queueEmbed.edit(`**Curent Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else if(reaction.emoji.name === "⬅️") {
                    if(currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**Curent Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id);
            } catch (error) {
                console.log(error);
                return message.channel.send(error.message).catch(console.error);
            }
        });

    } 
};

function generateQueueEmbed(message) {
    const queue = message.client.queue.get(message.guild.id)
    const songs = queue.songs
    let embeds = [];
    let k = 10;
  
    for (let i = 0; i < songs.length; i += 10) {
      const current = songs.slice(i, k);
      let j = i;
      k += 10;
  
      const info = current.map((track) => `${++j} - [${track.name}](${track.link})`).join("\n");
  
      const embed = new Discord.MessageEmbed()
        .setTitle("Song Queue\n")
        .setColor("#F8AA2A")
        .setDescription(`**Current Song - [${songs[0].name}](${songs[0].link})**\n\n${info}`)
        .setTimestamp();
      embeds.push(embed);
    }

    return embeds;
}